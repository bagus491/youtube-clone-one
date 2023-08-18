const express = require('express')
const app = express()
//UserControllers
const {HomeWeb,LoginPage,RegisterPage,DasbordWeb} = require('../Controllers/UsersControllers')
//auth
const Auth = require('../Auth/Auth')

//view engine
const mainlayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(mainlayouts)

const path = require('path')
app.set('views',path.join(__dirname, '../views'))

app.use(express.static(path.join(__dirname, '../public/')))

//get
app.get('/',HomeWeb)
//loginpage
app.get('/login',LoginPage)
//Register
app.get('/register',RegisterPage)
//Dasbord
app.get('/dasbord',DasbordWeb)








app.use(Auth)

module.exports = app