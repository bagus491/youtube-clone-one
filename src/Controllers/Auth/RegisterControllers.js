//bcrypt
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)


// validator
const {validationResult} = require('express-validator')

//modelUser
const {NewUser} = require('../../Utils/flowDBUser')



//RegisterPost
const RegisterPost = async (req,res) => {
    try{
        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.status(401).render('Register',{
                                  title: 'Register',
                                  layout : 'Register.ejs',
                                  error: error.array()
                                  })
        }

        const {username,password,email} = req.body
        
        //bcryptScript
        const PassOk = bcrypt.hashSync(password,salt)

        const getUser = NewUser(username,PassOk,email)

        //saved
        const saveUser = await getUser.save()

        if(!saveUser){
            return res.status(401).render('Register',{
                title: 'Register',
                layout : 'Register.ejs',
                error: error.array()
                })
        }

        req.flash('msg','Success Register')
        res.status(201).redirect('/login')

    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
}


module.exports = {RegisterPost}