const express = require('express')

function picsIndex(req, res) {
    if (!req.user) return res.render('pics/index', {title: 'All Pics'})
    res.render('pics/index', {title: 'All Pics', name: req.user.name, user: req.user})
}


module.exports = {picsIndex}