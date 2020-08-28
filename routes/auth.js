const router = require('express').Router()
const passport = require('passport')

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/google/oauth2callback', passport.authenticate('google', {successRedirect: '/typeones', failureRedirect: '/typeones'}))
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/typeones')
})

module.exports = router