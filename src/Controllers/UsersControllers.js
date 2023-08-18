


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
    res.render('Login',{
      title: 'Login',
      layout : 'Login.ejs',
      msg: req.flash('msg')
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






module.exports = {HomeWeb,LoginPage,RegisterPage}