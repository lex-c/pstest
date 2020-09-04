const express = require('express')
const User = require('../models/user')

function picsIndex(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    User.findOne({ipAdd: ip}, (err, ipUser) => {
        if (!ipUser) return res.render('pics/index', {title: 'All Pics', ip})
        if (ipUser && req.user || ipUser && req.query.userIp) {
            if (ipUser && req.user) res.render('pics/index', {title: 'All Pics', user: req.user, ip})
            if (ipUser && req.query.userIp) {
                User.findOne({ipAdd: req.query.userIp}, (err, userFnd) => {
                    res.render('pics/index', {title: 'All Pics', user: userFnd, ip: req.query.userIp})
                })
            }
        }
        if (ipUser && ipUser.googleId) return res.render('pics/index', {title: 'All Pics', ipUser, ip})
        res.render('pics/index', {title: 'All Pics', ints: ipUser.intTags, ip})
    })
}


module.exports = {picsIndex}