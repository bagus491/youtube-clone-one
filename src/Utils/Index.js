//users model

const Users = require('../Models/Users')

//express-validator
const {check} = require('express-validator')


const Validation = [
    check('username').custom(async (value) => {
        const duplikat = await Users.findOne({username: value})
        if(duplikat){
            throw new Error('username Exist')
        }else{
            return true
        }
    }),
    check('password').isLength({min: 5}).withMessage('password length min 5'),
    check('email').isEmail().withMessage('email didnt valid')
]

//NewUsrs
const NewUser = (username,password,email) => {
    return new Users({
        username,
        password,
        email,
    })
}

//getUsers 
const GetUser = async (username) => {
    return await Users.findOne({username})
}


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
const GetDelete = async(NameProfile) => {
    return await Profile.deleteOne({NameProfile})
}

module.exports = {NewUser,Validation,GetUser,NewProfil,GetProfile,GetDelete}