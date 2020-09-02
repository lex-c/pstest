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
            User.find({ipAdd: ip}, (err, user) => {
                if (err) return console.log(err)
                if (!user._id) {
                    User.create({ipAdd: ip}, (err, user) => {console.log('made a new user and on to send pics'); sendPics(user, socket)})
                } else if (user._id) {
                    console.log('in the setUser with user already present', user._id)
                    sendPics(user, socket)
                }
            })
        })
        socket.on('upInt', (currPicInt) => {
            console.log('receiving', currPicInt)
            User.find({ipAdd: currPicInt[2]}, (err, user) => {
                if (!user._id) return console.log('in up int no user found')
                const currPicId = currPicInt[0]
                const currIntNum = parseInt(currPicInt[1])
                for (let rotPic of user.rotPics) {
                    if (rotPic.apiPId === currPicId) {
                        let tot = rotPic.intNum + currIntNum
                        rotPic.set({intNum: tot})
                        if (currIntNum > 4) {
                            let contains = false
                            for (let intPic of user.intPics) {
                                if (intPic.apiPId === currPicId) {
                                    console.log('found one in')
                                    let totInt = intPic.intNum + currIntNum
                                    intPic.set({intNum: totInt})
                                    contains = true
                                }
                            }
                            if (!contains) user.intPics.push(rotPic)
                            user.intPics.sort((a, b) => b.intNum - a.intNum)
                            let intPicsArr = [...user.intPics]
                            intPicsArr.slice(0, 4)
                            user.set({intPics: intPicsArr})
                        }
                    }
                }
                user.save()
            })
        })
        socket.on('scrolldwn', () => {
            console.log(`they're down`)
            User.findOne({}, (err, user) => sendPics(user, socket))
        })
        socket.on('disconnect', () => {
            console.log('they left now')
        })
    })
}

const sendPics = (user, socket) => {
    console.log(`in the send pics; tags: ${user.intTags} and the intpicIDs ${user.intPics.map(pic => pic.apiPId)}`)
    let optimTags, allTags, optimToQuery
    if (user.intPics.length) {
        allTags = user.intPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
        optimTags = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 3)
    } else if (user.logPics.length) {
        allTags = user.logPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
        optimTags = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 3)
    } else {
        optimTags = ''
        optimToQuery = 'food'
    }
    if (optimTags) optimToQuery = [...optimTags].join(' OR ')
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
    // const qParams = {
    //     "query": optimToQuery,
    //     "image-type": "photo",
    //     "page": 1,
    //     "per_page": 10,
    //     "sort": "popular",
    // }
    // imagesApi.searchImages(qParams)
    .then(response => {
        console.log(response.data.hits.map(hit => hit.id))
        let currentRotPics = response.data.hits.reduce((a, hit) => {a.push({picUrl: hit.webformatURL, picTags: hit.tags.split(' ').join('').split(','), apiPId: hit.id}); return a}, []) 
        console.log(currentRotPics.map(pic => pic.apiPId))
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
        user.set({intTags: [...optimTags]})
        user.set({rotPics: userRotPicsArr})
        user.save()
        .then(user => {
            console.log(`curr rot pics: ${user.rotPics.map(pic => pic.apiPId)}`)
            socket.emit('nextPics', user.rotPics)
        })
            // console.log('after: ', user.rotPics.map(pic => pic.intNum))
        // console.log(response.data.hits.map(hit => hit.id))
        // let currentRotPics = response.data.hits.reduce((a, hit) => {a.push({picUrl: hit.webformatURL, picTags: hit.tags.split(' ').join('').split(',')}); return a}, []) 
        // let rotPicsToSet = currentRotPics.reduce((a, rotPic, idx) => {
        //     for (let pastPic of user.rotPics) {
        //         if (rotPic.picUrl.slice(0, -13) === pastPic.picUrl.slice(0, -13)) {a.currentRotPics.splice(idx, 1); a.pastStaying.push(pastPic)}
        //     }
        //     return a
        // }, {currentRotPics, pastStaying: []})
        // console.log("the reduce compare: ", user.rotPics.map(pic => pic.intNum), rotPicsToSet.currentRotPics.map(pic => pic.picUrl), rotPicsToSet.pastStaying.map(pic => pic.intNum))
        // if (rotPicsToSet.pastStaying.length) {
        //     let pastUrls = rotPicsToSet.pastStaying.map(pic => pic.picUrl.slice(0, -13))
        //     let count = 0
        //     console.log('before: ', user.rotPics.map(pic => pic.intNum))
        //     for (let pastPic of user.rotPics) if (!pastUrls.includes(pastPic.picUrl.slice(0, -13)) && count <= rotPicsToSet.currentRotPics.length) {user.rotPics.pull(pastPic); count += 1}
        //     console.log('after: ', user.rotPics.map(pic => pic.intNum))
        // }
        // for (let pic of rotPicsToSet.currentRotPics) user.rotPics.push(pic)
        // user.set({intTags: [...optimTags]})
        // user.save()
        // .then(user => {
        //     console.log(`curr rot pics: ${user.rotPics.map(pic => pic.intNum)}`)
        //     socket.emit('nextPics', user.rotPics)
        // })
    })
}

module.exports = {setUser}