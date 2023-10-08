const mongoose = require('mongoose')


const ProfileSchema = new mongoose.Schema({
    username:String,
    NameProfile:String,
    Subs:String,
    imageName:String,
    imageFile:Buffer,
    imageType:String,
})


const profiles = mongoose.model('profiles',ProfileSchema)


module.exports = profiles