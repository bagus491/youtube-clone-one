const express = require('express')
const app = express()
//UserControllers
const {HomeWeb,LoginPage,RegisterPage,DasbordWeb,jwt,secret,UploadWeb,ProfileWeb} = require('../Controllers/UsersControllers')
//auth
const Auth = require('../Auth/Auth')
//getUser
const {GetUser} = require('../Utils/Index')

//view engine
const mainlayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(mainlayouts)

const path = require('path')
app.set('views',path.join(__dirname, '../views'))

app.use(express.static(path.join(__dirname, '../public/')))

//midleware

app.use('/dasbord/',(req,res,next) => {
    try{
        const token = req.cookies.token || req.headers.authorization
        if(!token){
            return res.status(401).redirect('/login')
        }

        jwt.verify(token,secret,async(err,decoded) => {
            if(err){
                return res.status(401).redirect('/login')
            }

            const decodedUser = decoded.username
            
            const CheckUser = await GetUser(decodedUser)
            if(!CheckUser){
                return res.status(401).redirect('/login')
            }

            next()
        })
    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
})

//get
app.get('/',HomeWeb)
//loginpage
app.get('/login',LoginPage)
//Register
app.get('/register',RegisterPage)
//Dasbord
app.get('/dasbord',DasbordWeb)
//upload
app.get('/dasbord/upload',UploadWeb)
//profile
app.get('/dasbord/profile',ProfileWeb)


//logout
app.get('/dasbord/logout',(req,res) => {
    req.flash('msg','success Logout')
    res.clearCookie('token','')
    res.redirect('/login')
})



app.use(Auth)

module.exports = app