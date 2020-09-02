const express = require('express')
const User = require('../models/user')
const axios = require('axios').default
const _ = require('lodash')
const passport = require('passport')
const e = require('express')
// const sstk = require('shutterstock-api')
// const applicationConsumerId = process.env.SSTK_KEY
// const applicationConsumerSecret = process.env.SSTK_SECRET
// sstk.setBasicAuth(applicationConsumerId, applicationConsumerSecret);

// const imagesApi = new sstk.ImagesApi()

const setUser = (ioVar) => {
    ioVar.on('connection', (socket) => {
        console.log('connected now')
        socket.on('ipsend', ip => {
            console.log('in the ip send', ip)
            User.findOne({ipAdd: ip}, (err, user) => {
                if (!user) {
                    User.create({ipAdd: ip})
                    .then(user => {console.log('made a new user and on to send pics'); sendPics(user, socket)})
                } else {
                    console.log(`found it ${user._id}`)
                    sendPics(user, socket)
                }
            })
        })
        socket.on('upInt', currPicInt => {
            console.log('receiving', currPicInt)
            User.findOne({ipAdd: currPicInt[2]}, (err, user) => {
                if (!user) return console.log(`in up int no user found; user id ${user._id}`)
                user.save()
                .then(user => {
                    const currPicId = currPicInt[0]
                    const currIntNum = parseInt(currPicInt[1])
                    for (let rotPic of user.rotPics) {
                        if (rotPic.apiPId === currPicId) {
                            let tot = rotPic.intNum + currIntNum
                            rotPic.set({intNum: tot})
                            if (currIntNum > 2) {
                                let contains = false
                                for (let intPic of user.intPics) {
                                    if (intPic.apiPId === currPicId) {
                                        let totInt = intPic.intNum + currIntNum
                                        intPic.set({intNum: totInt})
                                        contains = true
                                    }
                                }
                                if (!contains) user.intPics.push(rotPic)
                                user.intPics.sort((a, b) => b.intNum - a.intNum)
                                let intPicsArr = [...user.intPics]
                                let shortIntPArr = intPicsArr.slice(0, 6)
                                user.set({intPics: shortIntPArr})
                            }
                        }
                    }
                    user.save((err) => {
                        if (err) console.log(err)
                    })
                })
            })
        })
        socket.on('scrolldwn', ip => {
            User.findOne({ipAdd: ip}, (err, user) => sendPics(user, socket))
        })
        socket.on('disconnect', () => {
            console.log('they left now')
        })
    })
}

const sendPics = (user, socket) => {
    console.log(`in the send pics; user: ${user._id} tags: ${user.intTags}`)
    user.save()
    .then(user => {
        let optimTags, tagsToSave, allTags, optimToQuery
        if (user.intPics.length) {
            allTags = user.intPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
            tagsToSave = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 4)
            optimTags = tagsToSave.slice(0, 2)
        } else if (user.logPics.length) {
            allTags = user.logPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
            tagsToSave = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 4)
            optimTags = tagsToSave.slice(0, 2)
        } else {
            optimTags = ''
            tagsToSave = ''
            optimToQuery = 'food'
        }
        if (optimTags) optimToQuery = [...optimTags].join('+')
        const options = {
            url: 'https://pixabay.com/api/',
            method: 'get',
            params: {
                key: process.env.PIXB_KEY,
                q: optimToQuery,
                image_type: 'photo',
                order: 'popular',
                per_page: 10,
            }
        }
        axios(options)
        .then(response => {
            console.log(`api response: ${response.data.hits.map(hit => hit.id)}`)
            let currentRotPics = response.data.hits.reduce((a, hit) => {a.push({picUrl: hit.webformatURL, picTags: hit.tags.split(' ').join('').split(','), apiPId: hit.id}); return a}, [])
            let userRotPicsArr
            if (user.rotPics.length) {
                let rotPicsToSet = currentRotPics.reduce((a, rotPic, idx) => {
                    for (let pastPic of user.rotPics) {
                        if (rotPic.apiPId === pastPic.apiPId) {a.currentRotPics.splice(idx, 1); a.pastStaying.push(pastPic)}
                    }
                    return a
                }, {currentRotPics: [...currentRotPics], pastStaying: []})
                userRotPicsArr = [...user.rotPics]
                if (rotPicsToSet.pastStaying.length) {
                    let pastIds = rotPicsToSet.pastStaying.map(pic => pic.apiPId)
                    let count = 0
                    for (let pastPic of userRotPicsArr) if (!pastIds.includes(pastPic.apiPId) && count <= rotPicsToSet.currentRotPics.length) {console.log(userRotPicsArr.indexOf(pastPic)); userRotPicsArr.splice(userRotPicsArr.indexOf(pastPic), 1); count += 1}
                    for (let pic of rotPicsToSet.currentRotPics) userRotPicsArr.push(pic)
                } else {
                    userRotPicsArr = rotPicsToSet.currentRotPics
                }
            } else {
                userRotPicsArr = currentRotPics
            }
            user.set({intTags: [...tagsToSave]})
            user.set({rotPics: userRotPicsArr})
            user.save((err, user) => {
                if (err) return console.log(err)
                console.log(`curr rot pics: ${user.rotPics.map(pic => pic.apiPId)}`)
                socket.emit('nextPics', user.rotPics)
            })
        })
    })
}

module.exports = {setUser}