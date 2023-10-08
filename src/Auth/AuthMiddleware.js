// jwt must here
//jsonwebtoken 
const jwt = require('jsonwebtoken')
const secret = '!@#$%&*()-==-}?123'



//checkToken

//UsersModel
const {GetUser} = require('../Utils/flowDBUser')

const AuthToken = (token) => {
    try{
        return jwt.verify(token,secret,async(err,decoded) => {
            if(err) return false;

            //decodedUser 
            const UserDecoded = decoded.username

            //checkUser
            const UserOk = await GetUser(UserDecoded)

            if(!UserOk)
            {
                return false
            }

            return UserDecoded
        })
    }catch(error){
        return false
    }
}


module.exports = {AuthToken}