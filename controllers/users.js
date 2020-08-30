const express = require('express')
const User = require('../models/user')
const axios = require('axios').default
const _ = require('lodash')
// const app = require('../server')
// const passport = require('passport')

// const setUser = (ioVar) => {
//     ioVar.on('connection', (socket) => {
//         console.log('connected now')
//         User.exists({ipAdd: socket.handshake.address}, (err, user) => {
//             if (err) return console.log(err)
//             if (!user) {
//                 User.create({ipAdd: socket.handshake.address}, () => {})
//                 .then(user => sendPics(user, socket))
//             }
//             sendPics(user, socket)
//         })
//         socket.on('upInt', (currPicInt) => {
//             console.log('receiving', socket.handshake.address, currPicInt)
//             const currPicId = currPicInt[0]
//             const currIntNum = parseInt(currPicInt[1])
//             User.findOne({ipAdd: socket.handshake.address}, (err, user) => {for (let pic of rotPics) if (pic._id.equals(currPicId)) pic.set({intNum: currIntNum}); user.save()})
//         })
//         socket.on('disconnect', () => console.log('they left now'))
//     })
// }

// const sendPics = (user, socket) => {
//     console.log('in the send pics')
//     // let optimTags, allTags
//     // if (user.intPics.length) {
//     //     allTags = intPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
//     //     optimTags = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 4)
//     // } else if (user.logPics.length) {
//     //     allTags = logPics.reduce((a, pic) => {pic.picTags.forEach(tag => a.push(tag)); return a}, [])
//     //     optimTags = _.chain(allTags).countBy().toPairs().sortBy(1).reverse().map(0).value().slice(0, 4)
//     // } else {
//     //     optimTags = ''
//     // }
//     // const options = {
//     //     url: 'https://pixabay.com/api/',
//     //     method: 'get',
//     //     params: {
//     //         key: process.env.PIXB_KEY,
//     //         q: optimTags,
//     //         image_type: 'photo',
//     //         per_page: 6,
//     //         headers: {'X-Requested-With': 'XMLHttpRequest'}
//     //         // timeout: 10000,
//     //     }
//     // }
//     // axios(options)
//     // .then(response => {
//     //     console.log(response.data)
//         // const currentRotPics = response.data.hits.reduce((a, hit) => {a.push({picUrl: hit.webformatURL, picTags: hit.tags.split(' ').join('').split(',')}); return a}, []) 
//         // currentRotPics.forEach(pic => user.rotPics.push(pic))
//         // user.save()
//         // .then(user => {
//         //     socket.emit('nextPics', user.rotPics)
//         //     sendPics(user, socket)
//         // })
//     // })
// }

// module.exports = {setUser}