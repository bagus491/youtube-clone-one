const mongoose = require('mongoose')


const VideoSchema = new mongoose.Schema({
    username:String,
    Title:String,
    Desc:String,
    Slug:String,
    PosterName:String,
    PosterFile:Buffer,
    PosterType:String,
    PostDate:String,
    VideoName:String,
    VideoFile:Buffer,
    VideoType:String,
    Views:String,
})


const videos = mongoose.model('videos',VideoSchema)


module.exports = videos