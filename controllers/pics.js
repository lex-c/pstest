const express = require('express')

function picsIndex(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (!req.user) return res.render('pics/index', {title: 'All Pics', ip})
    res.render('pics/index', {title: 'All Pics', name: req.user.name, user: req.user, ip})
}


module.exports = {picsIndex}