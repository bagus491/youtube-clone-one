//express-validator
const {check} = require('express-validator')

//users
const {GetUser} = require('../Utils/flowDBUser')


const Validation = [
    check('username').custom(async (value) => {
        const duplikat = await GetUser(value)
        if(duplikat){
            throw new Error('username Exist')
        }else{
            return true
        }
    }),
    check('password').isLength({min: 5}).withMessage('password length min 5'),
    check('email').isEmail().withMessage('email didnt valid')
]






module.exports = {Validation}