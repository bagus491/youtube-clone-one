const mongoose = require('mongoose')


const VideoSchema = new mongoose.Schema({
    username:String,
    Title:String,
    Desc:String,
    PostDate:String,
    Videoname:String,
    Videofile:Buffer,
    Videotype:String,
    Views:String,
})


const videos = mongoose.model('videos',VideoSchema)


module.exports = videos