//profile Model
const Profile = require('../Models/Profile')


// new Profile
const NewProfil = (username,NameProfile,file) =>{
    return new Profile({
        username,
        NameProfile,
        imageName:file.filename,
        imageFile:file.buffer,
        imageType:file.mimetype,
    })
}

//GetProfile
const GetProfile = async (username) => {
    return await Profile.findOne({username})
}

//deleteProfile
const DeleteProfile = async(_id) => {
    return await Profile.deleteOne({_id})
}


module.exports = {NewProfil,GetProfile,DeleteProfile}