const mongoose = require('mongoose')
const Schema = mongoose.Schema

const picsIntSchema = new Schema({
    picObjId: String,
    int: Number
})

const userSchema = new Schema({
    name: String,
    email: String,
    googleId: String,
    ipAdd: String,
    picsInt: [picsIntSchema]
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)