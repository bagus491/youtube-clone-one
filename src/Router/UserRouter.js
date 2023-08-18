const express = require('express')
const app = express()
//UserControllers
const {HomeWeb} = require('../Controllers/UsersControllers')


//get
app.get('/',HomeWeb)












module.exports = app