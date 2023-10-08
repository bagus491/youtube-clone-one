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

//database
require('./src/Db/Db')

//addOn
const helmet = require('helmet')
app.use(helmet())

const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:3000'
}))

//four
const UserRouter = require('./src/Router/UserRouter')
app.use(UserRouter)

//third
app.use('/',(req,res) => {
    res.status(404).send('404 NOT FOUND')
})


//first-setup
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})