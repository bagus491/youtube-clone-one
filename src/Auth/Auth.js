const express  = require('express')
const app = express()
const {validationResult} = require('express-validator')
const {NewUser,Validation,GetUser} = require('../Utils/Index')

//const path 
const path = require('path')
app.set('views',path.join(__dirname, '../views'))

//jsonwebtoken 
const jwt = require('jsonwebtoken')
const secret = '!@#$%&*()-==-}?123'

//bcrypt
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

//passport
const passport = require('passport')
const LocalPassport = require('passport-local').Strategy


passport.use(new LocalPassport({usernameField: 'username'},async (username,password,done) => {
    try{
        const dataOk  = await GetUser(username)
        if(!dataOk){
            return done(null,false,{message: 'username didnt valid'})
        }
    
        const PassOk = bcrypt.compareSync(password,dataOk.password)
        if(!PassOk){
            return done(null,false,{message: 'password didnt valid'})
        }

       return done(null,dataOk) 
    }catch(error){
        return done(error)
    }
}))

passport.serializeUser((dataOk,done) => {
    return done(null,dataOk.username)
})

passport.deserializeUser(async (username,done) => {
    try{
        const getUser = await GetUser(username)
        if(getUser){
            return done(null,getUser)
        }
    }catch(error){
        return done(error)
    }
})

app.use(passport.initialize())
app.use(passport.session())

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

//post
app.post('/register',Validation,RegisterPost)

//login
const LoginPost = (req,res) => {
    try{
        const {username} = req.body

        jwt.sign({username},secret,{expiresIn: '1h'}, (err,token) => {
            if(err){
                return res.status(401).json({msg : 'Not Authorization'})
            }
    
            res.cookie('token',token)
            res.redirect('/dasbord')
        })
    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
}

app.post('/login',passport.authenticate('local',{failureRedirect: '/login'}),LoginPost)

module.exports = app