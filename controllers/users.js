const express = require('express')
const User = require('../models/user')
const axios = require('axios').default
const _ = require('lodash')
const passport = require('passport')

const setUser = (ioVar) => {
    ioVar.on('connection', (socket) => {
        console.log('connected now')
        socket.on('ipsend', ip => {
            console.log('in the ip send', ip)
            if (ip[1]) {
                User.findOneAndDelete({googleId: ip[1]}, (err, userByG) => {
                    User.findOneAndUpdate({ipAdd: ip}, {name: userByG.name, email: userByG.email, googleId: userByG.googleId, rotPics: []})
                    .then(user => {
                        socket.emit('isLogged')
                        sendPics(user, socket)
                    })
                })
            } else {
                User.findOne({ipAdd: ip[0]}, (err, user) => {
                    if (!user) {
                        User.create({ipAdd: ip[0]}, (err, newUser) => sendPics(newUser, socket))
                    } else {
                        sendPics(user, socket)
                    }
                })
            }
        })
        socket.on('upInt', currPicInt => {
            console.log('receiving', currPicInt)
            User.findOne({ipAdd: currPicInt[1]}, (err, user) => {
                if (!user) return console.log(`in up int no user found; user id ${user._id}`)
                user.save()
                .then(user => {
                    const currPicId = currPicInt[0]
                    for (let rotPic of user.rotPics) {
                        if (rotPic.apiPId === currPicId) {
                            let tot = rotPic.intNum + 1.2
                            rotPic.set({intNum: tot})
                            if (tot > 5) {
                                let contains = false
                                for (let intPic of user.intPics) {
                                    if (intPic.apiPId === currPicId) {
                                        let totInt = intPic.intNum + 1.2
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
                    for (let logPic of user.logPics) {
                        if (logPic.apiPId === currPicId) {
                            let tot = logPic.intNum + 1.2
                            logPic.set({intNum: tot})
                        }
                    }
                    user.save((err) => {
                        if (err) console.log(err)
                    })
                })
            })
        })
        socket.on('picToBin', ipAndPic => {
            socket.disconnect()
            User.findOne({ipAdd: ipAndPic[0]}, (err, user) => {
                let picToHold = [...user.rotPics].filter(pic => pic.apiPId === ipAndPic[1])[0]
                if (user.binPics.length < 6) {
                    if (![...user.binPics].filter(pic => pic.apiPId === ipAndPic[1]).length) {
                        console.log('added!')
                        user.binPics.push(picToHold)
                        user.save()
                    } else {
                        console.log(`Already in Bin!`)
                    }
                } else {
                    console.log(`Bin Already Full!`)
                }
            })
        })
        socket.on('showBin', ip => {
            User.findOne({ipAdd: ip}, (err, user) => {
                if (!user) return
                socket.emit('heresBin', user.binPics)
            })
        })
        socket.on('removePic', ipAndPic => {
            User.findOneAndUpdate({ipAdd: ipAndPic[0]}, {$pull: {'binPics': {'apiPId': ipAndPic[1]}}}, () => socket.disconnect())
        })
        // socket.on('customQuery', ipAndQ => {
        //     if (ipAndQ[1] === '') ipAndQ[1] = ' '
        //     User.findOne({ipAdd: ipAndQ[0]}, (err, user) => {
        //         sendPics(user, socket, ipAndQ[1])
        //     })
        // })
        socket.on('scrolldwn', ip => {
            User.findOne({ipAdd: ip}, (err, user) => sendPics(user, socket))
        })
        socket.on('askToChat', nmIntsIp => {
            socket.broadcast.emit('incoming', nmIntsIp)
        })
        socket.on('leaving', () => {
            socket.broadcast.emit('hostLeft', 1)
        })
        socket.on('disconnect', () => {
            console.log('they left now')
        })
    })
}

const sendPics = (user, socket, Q) => {
    user.save()
    .then(user => {
        let optimTags, tagsToSave, allTags, optimToQuery
        // if (Q) {
        //     console.log(`in the Q in send and here's the Q: ${Q} and here's user ${user.ipAdd}`)
        //     optimTags = ''
        //     tagsToSave = (user.intTags || '')
        //     optimToQuery = Q
        // } else 
        if (user.intPics.length) {
            allTags = user.intPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
            tagsToSave = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 4)
            optimTags = tagsToSave.slice(0, 3)
        } else if (user.logPics.length) {
            allTags = user.logPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
            tagsToSave = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 4)
            optimTags = tagsToSave.slice(0, 3)
        } else {
            optimTags = ''
            tagsToSave = ''
            optimToQuery = 'food'
        }
        if (optimTags) optimToQuery = `${optimTags[0]}+${optimTags[1]} OR ${optimTags[1]}+${optimTags[2]} OR ${optimTags[2]}+${optimTags[0]}`
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
            if (user.rotPics.length) user.set({logPics: [...user.rotPics]})
            user.set({rotPics: userRotPicsArr})
            user.save((err, user) => {
                if (err) return console.log(err)
                socket.emit('nextPics', user.rotPics)
            })
        })
    })
}

module.exports = {setUser}