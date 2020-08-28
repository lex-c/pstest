const path = require('path')
const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const httpErrors = require('http-errors')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
require('dotenv').config()
require('./config/database')
require('./config/pass')
const indexRouter = require('./routes/index')
const onesRouter = require('./routes/typeones')
const authRouter =require('./routes/auth')
// const twosRouter = require('./routes/typetwos')

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
app.use('/typeones', onesRouter)
app.use('/auth', authRouter)
// app.use('/typetwos', twosRouter)

app.use((req, res, next) => next(httpErrors(404)))
app.use((err, req, res, next) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app