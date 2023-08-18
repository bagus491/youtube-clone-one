//first-setup
const express = require('express')
const app = express()
const port = 3000

//two-setup
//middleware

//morgan
const morgan = require('morgan')
app.use(morgan('dev'))

//express-rate-limiter
const limiter = require('express-rate-limit')
app.use(limiter({
    windowMS: 10 * 60 * 1000,
    max: 100,
    message: "You Have Many Request"
}));

//url-encoded
app.use(express.urlencoded({extended: 'false'}))

//cookie-parser,session,flash
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')

app.use(cookieParser('secret'))
app.use(session({
    resave:true,
    saveUninitialized: true,
    secret : 'secret',
    cookie: {maxAge: 6000}
}))
app.use(flash())

//view engine
const mainlayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(mainlayouts)

const path = require('path')
app.set('views',path.join(__dirname, './src/views'))

//database
require('./src/Db/Db')


//first-setup
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})