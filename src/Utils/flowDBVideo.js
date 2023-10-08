//modal video
const Videos = require('../Models/Videos')
// new Profile
const NewVideo = (username,Title,Desc,Slug,Ps,PostDate,Vd,Views) =>{
    return new Videos({
        username,
        Title,
        Desc,
        Slug,
        PosterName: Ps.filename,
        PosterFile: Ps.buffer,
        PosterType: Ps.mimetype,
        PostDate,
        VideoName:Vd.filename,
        VideoFile:Vd.buffer,
        VideoType:Vd.mimetype,
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