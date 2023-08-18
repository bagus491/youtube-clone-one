const express = require('express')
const app = express()
//UserControllers
const {HomeWeb} = require('../Controllers/UsersControllers')

//view engine
const mainlayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(mainlayouts)

const path = require('path')
app.set('views',path.join(__dirname, '../views'))

//get
app.get('/',HomeWeb)












module.exports = app