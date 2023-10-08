const express = require('express')
const app = express()

//UserControllers
const {HomeWeb,LoginPage,RegisterPage,DasbordWeb,DasbordUpload} = require('../Controllers/UsersControllers')

//ProfileControllers
const {ProfilePost,ProfileGet,ProfileDelete}  = require('../Controllers/ProfileControllers')

//VideoControllers
const {VideoPost,VideoDelete,VideoWatch} = require('../Controllers/VideoControllers')

//LogoutController
const {LogoutUser} = require('../Controllers/Auth/LogoutController')

//auth
const Auth = require('../Auth/AuthUsers')

const {CheckDasbord} =  require('../Controllers/Auth/MiddlewareDasbord')

//view engine
const mainlayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(mainlayouts)

const path = require('path')
app.set('views',path.join(__dirname, '../views'))

app.use(express.static(path.join(__dirname, '../public')))

//multer
const multer = require('multer')
const storage = multer.memoryStorage()
const Upload = multer({storage: storage})

//method_override
const override = require('method-override')
app.use(override('_method'))

//midleware
app.use('/dasbord',CheckDasbord)

//get
app.get('/',HomeWeb)
//loginpage
app.get('/login',LoginPage)
//Register
app.get('/register',RegisterPage)
//Watch
app.get('/watch/:Slug/:id',VideoWatch)



//Dasbord
app.get('/dasbord',DasbordWeb)

//upload
app.get('/dasbord/upload',DasbordUpload)
app.post('/dasbord/upload',Upload.fields([{name: 'Video'},{name:'Poster'}]),VideoPost)
app.delete('/dasbord/upload',VideoDelete)

//profile
app.get('/dasbord/profile',ProfileGet)
app.post('/dasbord/profile',Upload.single('Avatar'),ProfilePost)
app.delete('/dasbord/profile',ProfileDelete)


//logout
app.get('/dasbord/logout',LogoutUser)


app.use(Auth)

module.exports = app