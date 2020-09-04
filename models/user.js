const mongoose = require('mongoose')
const Schema = mongoose.Schema

const picSchema = new Schema({
    picUrl: String,
    picTags: [String],
    intNum: {type: Number, default: 0},
    apiPId: String
})
const messSchema = new Schema({
    message: String,
    sent: {type: Boolean, default: false}
}, {timestamps: true})

const userSchema = new Schema({
    name: String,
    email: String,
    googleId: String,
    ipAdd: String,
    intTags: {type: [String], default: []},
    intPics: {type: [picSchema], default: []},
    rotPics: {type: [picSchema], default: []},
    logPics: {type: [picSchema], default: []},
    binPics: {type: [picSchema], default: []},
    messages: {type: [messSchema], default: []}
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)