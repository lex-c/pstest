const express = require('express')
const User = require('../models/user')
const axios = require('axios').default
const _ = require('lodash')
const passport = require('passport')
let sendPicsCounter = {}

const setUser = (ioVar) => {
    ioVar.on('connection', (socket) => {
        sendPicsCounter[`${socket.handshake.address}`] = 0
        console.log('connected now')
        User.find({ipAdd: socket.handshake.address}, (err, user) => {
            if (err) return console.log(err)
            if (!user._id) return User.create({ipAdd: socket.handshake.address}, (err, user) => sendPics(user, socket))
            console.log('in the setUser with user already present', user._id)
            sendPics(user, socket)
        })
        socket.on('upInt', (currPicInt) => {
            console.log('receiving', socket.handshake.address, currPicInt)
            const currPicId = currPicInt[0]
            const currIntNum = parseInt(currPicInt[1])
            User.findOne({ipAdd: socket.handshake.address}, (err, user) => {
                for (let rotPic of user.rotPics) {
                    if (rotPic._id.equals(currPicId)) {
                        // console.log('found the rotPic')
                        rotPic.set({intNum: currIntNum})
                        let rotPicUrls1 = user.rotPics.map(pic => pic.picTags)
                        // console.log(`original rotPics: ${rotPicUrls1}`)
                        if (currIntNum > 3) {
                            let contains = false
                            for (let intPic of user.intPics) {
                                if (intPic._id.equals(currPicId)) {
                                    intPic.set({intNum: currIntNum})
                                    contains = true
                                }
                            }
                            if (!contains) user.intPics.push(rotPic)
                            // console.log('newintpics', user.intPics)
                        }
                    }
                }
                user.save()
                .then(user => {
                    sendPicsCounter[`${socket.handshake.address}`] += 1
                    if (sendPicsCounter[`${socket.handshake.address}`] % 5 === 0) sendPics(user, socket)
                })
            })
        })
        socket.on('disconnect', () => {
            delete sendPicsCounter[`${socket.handshake.address}`]
            console.log('they left now')
        })
    })
}

const sendPics = (user, socket) => {
    console.log('in the send pics', user.intTags)
    let optimTags, allTags, optimToQuery
    if (user.intPics.length) {
        console.log('theres intpics')
        allTags = user.intPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
        optimTags = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 4)
    } else if (user.logPics.length) {
        allTags = user.logPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
        optimTags = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 4)
    } else {
        optimTags = ''
        optimToQuery = ''
    }
    if (optimTags) optimToQuery = optimTags.split(' ').join('').split(',').join('+')
    console.log(optimTags)
    const options = {
        url: 'https://pixabay.com/api/',
        method: 'get',
        params: {
            key: process.env.PIXB_KEY,
            q: optimToQuery,
            image_type: 'photo',
            per_page: 6,
        }
    }
    axios(options)
    .then(response => {
        console.log(response.data.hits)
        const currentRotPics = response.data.hits.reduce((a, hit) => {a.push({picUrl: hit.webformatURL, picTags: hit.tags.split(' ').join('').split(',')}); return a}, []) 
        user.set({rotPics: [...currentRotPics]})
        user.set({intTags: [...optimTags]})
        user.save()
        .then(user => socket.emit('nextPics', user.rotPics))
    })
}

module.exports = {setUser}