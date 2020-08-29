const mongoose = require('mongoose')
const Schema = mongoose.Schema

const picsIntSchema = new Schema({
    picId: String,
    intNum: Number
})

const picsRotSchema = new Schema({
    picId: String,
    intNum: {type: Number, default: 0}
    // srcUrl: String
})
const userSchema = new Schema({
    name: String,
    email: String,
    googleId: String,
    ipAdd: String,
    picsInt: [picsIntSchema],
    picsRot: [picsRotSchema]
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)