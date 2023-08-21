const express = require('express')
const app = express()
//UserControllers
const {HomeWeb,LoginPage,RegisterPage,DasbordWeb,jwt,secret,SearchVideo} = require('../Controllers/UsersControllers')
const {ProfilePost,ProfileGet,ProfileDelete}  = require('../Controllers/ProfileControllers')
const {VideoGet,VideoPost,VideoDelete,VideoWatch} = require('../Controllers/VideoControllers')
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

//multer
const multer = require('multer')
const storage = multer.memoryStorage()
const Upload = multer({storage: storage})

//method_override
const override = require('method-override')
app.use(override('_method'))

//midleware

app.use('/dasbord/',(req,res,next) => {
    try{
        const token = req.cookies.token || req.headers.authorization
        if(!token){
            return res.status(401).redirect('/login').clearCookie('token','')
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
app.get('/dasbord/upload',VideoGet)
//profile
app.get('/dasbord/profile',ProfileGet)
//Watch
app.get('/watch/:id',VideoWatch)
//search
app.get('/search',SearchVideo)

//post
app.post('/dasbord/profile',Upload.single('Avatar'),ProfilePost)
app.post('/dasbord/upload',Upload.single('Video'),VideoPost)

//deleteProfile
app.delete('/dasbord/profile',ProfileDelete)
//deleteVideo
app.delete('/dasbord/upload',VideoDelete)
//logout
app.get('/dasbord/logout',(req,res) => {
    req.flash('msg','success Logout')
    res.clearCookie('token','')
    res.redirect('/login')
})



app.use(Auth)

module.exports = app