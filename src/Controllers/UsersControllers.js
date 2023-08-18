//jsonwebtoken 
const jwt = require('jsonwebtoken')
const secret = '!@#$%&*()-==-}?123'
//getUser
const {GetUser} = require('../Utils/Index')

//homeWeb
const HomeWeb = (req,res) => {
    try{
      res.render('HomeWeb',{
        title: 'Home',
        layout : 'main-layouts/main-layouts.ejs'
      })
    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
}


//loginpage
const LoginPage = (req,res) => {
  try{
    const token = req.cookies.token || req.headers.authorization
    if(!token) {
      return res.status(401).render('Login',{
        title: 'Login',
        layout : 'Login.ejs',
        msg: req.flash('msg')
      })
    }

    jwt.verify(token,secret,async (err,decoded) => {
      if(err){
        return res.status(401).redirect('/login')
    }

    const decodedUser = decoded.username
    
    const CheckUser = await GetUser(decodedUser)
    if(!CheckUser){
        return res.status(401).redirect('/login')
    }

    res.redirect('/dasbord')
    })
  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}

//loginpage
const RegisterPage = (req,res) => {
  try{
    res.render('Register',{
      title: 'Register',
      layout : 'Register.ejs'
    })
  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}


//Dasbord
const DasbordWeb = (req,res) => {
  try{
    res.render('Dasbord',{
      title: 'Dasbord',
      layout : 'main-layouts/main-layouts.ejs'
    })
  }catch(error){
      res.status(500).json({msg : 'Internal Server Error'})
  }
}



module.exports = {HomeWeb,LoginPage,RegisterPage,DasbordWeb,jwt,secret}