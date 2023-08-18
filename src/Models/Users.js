const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
})


const users = mongoose.model('users',UserSchema)


module.exports = users