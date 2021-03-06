const path = require('path')
const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const httpErrors = require('http-errors')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()
require('./config/database')
require('./config/pass')
const cors = require('cors')
const indexRouter = require('./routes/index')
const picsRouter = require('./routes/pics')
const authRouter = require('./routes/auth')
const chatRouter = require('./routes/chat')

const app = express()

app.set('view engine', 'pug')

app.use(cors())
app.use(logger('dev'))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESS_SEC,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/pics', picsRouter)
app.use('/auth', authRouter)
app.use('/chat', chatRouter)

app.use((req, res, next) => next(httpErrors(404)))
app.use((err, req, res, next) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app