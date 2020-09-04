const User = require("../models/user")

const chatPage = (req, res) => {
    const isAdd = req.params.isAdd ? 'isAdd' : ''
    const me = req.params.isMe ? 'isMe' : ''
    User.findOne({ipAdd: req.params.userIp}, (err, userByIp) => {
        res.render('pics/chat', {title: 'Chat', user: userByIp, isAdd, me})
    })
}

const addMess = (req, res) => {
    User.findOneAndUpdate({ipAdd: req.params.userIp}, {$push: {messages: {$each: [req.body], $sort: {createdAt: 1}}}}, (err, user) => {
        res.redirect(`/chat/${req.params.userIp}/${true}/${true}`)
    })
}

const hostAddMess = (req, res) => {
    User.findOneAndUpdate({ipAdd: req.params.userIp}, {$push: {messages: {$each: [req.body], $sort: {createdAt: 1}}}}, (err, user) => {
        res.redirect(`/chat/host/${req.params.userIp}/${true}/${true}`)
    })
}

const hostPage = (req, res) => {
    if (req.params.userIp) {
        const isAdd = req.params.isAdd ? 'isAdd' : ''
        const me = req.params.isMe ? 'isMe' : ''
        User.findOne({ipAdd: req.params.userIp}, (err, user) => {
            res.render('pics/hostchat', {user, isAdd, me})
        })
    } else {
        res.render('pics/hostchat')
    }
}

module.exports = {chatPage, addMess, hostAddMess, hostPage}