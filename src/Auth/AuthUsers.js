const express  = require('express')
const app = express()


//modelUser
const {GetUser} = require('../Utils/flowDBUser')

//validation
const {Validation} = require('../Utils/Verify.js')

//const path 
const path = require('path')
app.set('views',path.join(__dirname, '../views'))

//registerController
const {RegisterPost} = require('../Controllers/Auth/RegisterControllers')

//loginController
const {LoginPost} = require('../Controllers/Auth/LoginController')


//passport
const passport = require('passport')
const LocalPassport = require('passport-local').Strategy

//bcrypt
const bcrypt = require('bcrypt')



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


//post
app.post('/register',Validation,RegisterPost)



app.post('/login',passport.authenticate('local',{failureRedirect: '/login'}),LoginPost)

module.exports = app