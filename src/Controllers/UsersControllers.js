//jsonwebtoken 
const jwt = require('jsonwebtoken')
const secret = '!@#$%&*()-==-}?123'
//getVideo
const {GetVideo} = require('../Utils/flowDBVideo')

//getUser
const {GetUser} = require('../Utils/flowDBUser')


//homeWeb
const HomeWeb = async (req,res) => {
    try{
      const Datas = await GetVideo()

    
      //map
      const dataMap = await Promise.all(
        Datas.map((e) => {
          const {_id,username,Title,Desc,PostDate,Videofile,Videotype,Views} = e
                  
          //decoded
          const VideoData = Videofile.toString('base64')
          //path
          const VideoPath = `data:${Videotype};base64,${VideoData}`
  
          return {_id,username,Title,Desc,PostDate,VideoPath,Views}
        })
      )
     

      res.render('HomeWeb',{
        title: 'Home',
        layout : 'main-layouts/main-layouts.ejs',
        Video: dataMap
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
        return res.status(401).render('Login',{
          title: 'Login',
          layout : 'Login.ejs',
          msg: req.flash('msg')
        })
    }

    const decodedUser = decoded.username
    
    const CheckUser = await GetUser(decodedUser)
    if(!CheckUser){
        return res.status(401).render('Login',{
          title: 'Login',
          layout : 'Login.ejs',
          msg: req.flash('msg')
        })
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
const DasbordWeb = async (req,res) => {
  try{
    const Datas = await GetVideo()

    //map
    const dataMap = await Promise.all(
      Datas.map((e) => {
        const {_id,Title,Desc,PostDate,Videofile,Videotype,Views} = e
                
        //decoded
        const VideoData = Videofile.toString('base64')
        //path
        const VideoPath = `data:${Videotype};base64,${VideoData}`

        return {_id,Title,Desc,PostDate,VideoPath,Views}
      })
    )
    res.render('Dasbord',{
      title: 'Dasbord',
      layout : 'Dasbord.ejs',
      Video: dataMap
    })
  }catch(error){
      res.status(500).json({msg : 'Internal Server Error'})
  }
}


//search
const SearchVideo = async (req,res) => {
  try{
    const token = req.cookies.token || req.headers.authorization
    if(token){
      jwt.verify(token,secret, async (err,decoded) => {
        if(err){
          return res.status(401).redirect('/login')
        }
        const decodedUser = decoded.username
  
        const dataOk = await GetUser(decodedUser)
        if(!dataOk){
          return res.status(401).redirect('/login')
        }
  
        const {q} = req.query
    
        //videoDatas
        const Datas = await GetVideo()
    
        //filter
        const FilterDatas = Datas.filter((e) => e.Title.toLowerCase().includes(q.toLowerCase()))
  
      
       res.render('Search',{
        title:'halaman/search',
        layout: 'search.ejs',
        user:true,
       Video: FilterDatas
       })
        
      })
      
    }else{
    
      const {q} = req.query
    
      //videoDatas
      const Datas = await GetVideo()
  
      //filter
      const FilterDatas = Datas.filter((e) => e.Title.toLowerCase().includes(q.toLowerCase()))

      res.render('Search',{
        title:'halaman/search',
        layout: 'search.ejs',
        user:false,
       Video: FilterDatas
       })
    }
  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}

module.exports = {HomeWeb,LoginPage,RegisterPage,DasbordWeb,jwt,secret,SearchVideo}