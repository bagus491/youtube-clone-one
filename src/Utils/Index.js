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


module.exports = {NewUser,Validation,GetUser}