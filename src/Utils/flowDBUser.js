//users model

const Users = require('../Models/Users')


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







module.exports = {NewUser,GetUser}