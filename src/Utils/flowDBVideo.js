//modal video
const Videos = require('../Models/Videos')
// new Profile
const NewVideo = (username,Title,Desc,PostDate,file,Views) =>{
    return new Videos({
        username,
        Title,
        Desc,
        PostDate,
        Videoname:file.filename,
        Videofile:file.buffer,
        Videotype:file.mimetype,
        Views,
    })
}

//GetProfile
const GetVideo = async () => {
    return await Videos.find()
}

//deleteProfile
const GetDeleteVideo = async(id) => {
    return await Videos.deleteOne({_id:id})
}

//getVideoById
const GetVideoById = async(id) => {
    return await Videos.findOne({_id:id})
}

//updateVideoViews
const UpdateVideoViews = async(id,Views) => {
    return await Videos.updateOne(
        {
            _id: id
        },
        {
            $set: {
                Views,
            }
        }
    )
}



module.exports  = {NewVideo,GetVideo,GetDeleteVideo,GetVideoById,UpdateVideoViews}