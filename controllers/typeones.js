const express = require('express')

function onesIndex(req, res) {
    if (!req.user) return res.render('typeones/index', {title: 'Ones'})
    res.render('typeones/index', {title: 'Ones', name: req.user.name, user: req.user})
}


module.exports = {onesIndex}