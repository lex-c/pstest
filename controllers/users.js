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
                        let tot = rotPic.intNum + currIntNum
                        rotPic.set({intNum: tot})
                        let rotPicUrls1 = user.rotPics.map(pic => pic.picTags)
                        // console.log(`original rotPics: ${rotPicUrls1}`)
                        if (currIntNum > 4) {
                            let contains = false
                            for (let intPic of user.intPics) {
                                if (intPic._id.equals(currPicId)) {
                                    let totInt = intPic.intNum + currIntNum
                                    intPic.set({intNum: totInt})
                                    contains = true
                                }
                            }
                            if (!contains) user.intPics.push(rotPic)
                            user.intPics.sort((a, b) => b.intNum - a.intNum)
                            user.intPics.forEach((pic, idx) => {if (idx > 2) user.intPics.pull(pic)})
                        }
                    }
                }
                user.save()
                .then(user => {
                    sendPicsCounter[`${socket.handshake.address}`] += 1
                    if (sendPicsCounter[`${socket.handshake.address}`] % 10 === 0) sendPics(user, socket)
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
    console.log(`in the send pics; tags: ${user.intTags} and the intNums ${user.intPics.map(pic => pic.intNum)}`)
    let optimTags, allTags, optimToQuery
    if (user.intPics.length) {
        allTags = user.intPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
        optimTags = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 3)
    } else if (user.logPics.length) {
        allTags = user.logPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
        optimTags = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 3)
    } else {
        optimTags = ''
        optimToQuery = ''
    }
    if (optimTags) optimToQuery = [...optimTags].join('+')
    const options = {
        url: 'https://pixabay.com/api/',
        method: 'get',
        params: {
            key: process.env.PIXB_KEY,
            q: optimToQuery,
            image_type: 'photo',
            min_height: 800,
            order: 'latest',
            per_page: 10,
        }
    }
    axios(options)
    .then(response => {
        // console.log(response.data.hits)
        let currentRotPics = response.data.hits.reduce((a, hit) => {a.push({picUrl: hit.webformatURL, picTags: hit.tags.split(' ').join('').split(',')}); return a}, []) 
        let rotPicsToSet = currentRotPics.reduce((a, rotPic, idx) => {
            for (let pastPic of user.rotPics) {
                if (rotPic.picUrl.slice(0, -13) === pastPic.picUrl.slice(0, -13)) {a.currentRotPics.splice(idx, 1); a.pastStaying.push(pastPic)}
            }
            return a
        }, {currentRotPics, pastStaying: []})
        if (rotPicsToSet.pastStaying.length) {
            let pastUrls = rotPicsToSet.pastStaying.map(pic => pic.picUrl.slice(0, -13))
            for (let pastPic of user.rotPics) if (!pastUrls.includes(pastPic.picUrl.slice(0, -13))) user.rotPics.pull(pastPic)
        }
        for (let pic of rotPicsToSet.currentRotPics) user.rotPics.push(pic)
        user.set({intTags: [...optimTags]})
        user.save()
        .then(user => socket.emit('nextPics', user.rotPics))
    })
}

module.exports = {setUser}