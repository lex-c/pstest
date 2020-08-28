const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user')

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CB
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({googleId: profile.id}, (err, user) => {
            if (err) return done(err)
            if (user) {return done(null, user)}
            else {
                var newUser = new User({name: profile.displayName, email: profile.emails[0].value, googleId: profile.id})
                newUser.save((err) => {
                    if (err) return done(err)
                    return done(null, user)
                })
            }
        })
    }
    )
)

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
})

