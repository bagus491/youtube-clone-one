
//getVideo
const {GetVideo} = require('../Utils/flowDBVideo')

//getUser
const {GetUser} = require('../Utils/flowDBUser')

//verfiy
const {AuthToken} = require('../Auth/AuthMiddleware')


//homeWeb
const HomeWeb = async (req,res) => {
    try{
      const token = req.cookies.token

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

      const verifyToken = await AuthToken(token)
     
       req.session.User = verifyToken

      res.render('HomeWeb',{
        title: 'Home',
        layout : 'main-layouts/main-layouts.ejs',
        Video: dataMap,
        Role: req.session.User ?  req.session.User  : undefined
      })
    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
}


//Dasbord
const DasbordWeb = async (req,res) => {
  try{
    const token = req.cookies.token || req.headers.authorization
    if(!token){
      return res.status(401)
    }

    const verifyToken = await AuthToken(token)

    if(!verifyToken)
    {
      return res.status(401).redirect('/login')
    }

    //this array
    const Videos = await GetVideo()

    //filterArray
    const FilterdArray = Videos.filter((e) => e.username === verifyToken)
   
    req.session.User = verifyToken

    if(!FilterdArray){
        return res.status(203).render('Dasbord',{
         title: 'halaman/Dasbord',
         layout : 'main-layouts/main-layouts.ejs',
          Video: FilterdArray,
          msg: req.flash('msg'),
          Role: req.session.User ?  req.session.User  : undefined
        })

    }

    //map
    const Changes = await Promise.all(
        FilterdArray.map((e) => {
            const {_id,Title,Desc,PostDate,Videofile,Videotype,Views} = e
            
            //decoded
            const VideoData = Videofile.toString('base64')
            //path
            const VideoPath = `data:${Videotype};base64,${VideoData}`

            return {_id,Title,Desc,PostDate,VideoPath,Views}
        })
    )

    if(!Changes){
      return res.status(203).render('Dasbord',{
        title: 'halaman/Dasbord',
        layout : 'main-layouts/main-layouts.ejs',
         Video: FilterdArray,
         msg: req.flash('msg'),
         Role: req.session.User ?  req.session.User  : undefined
       })
    }
    
   
    res.status(200).render('Dasbord',{
      title: 'halaman/Dasbord',
      layout : 'main-layouts/main-layouts.ejs',
       Video: FilterdArray,
       msg: req.flash('msg'),
       Role: req.session.User ?  req.session.User  : undefined
     })

  }catch(error){
      res.status(500).json({msg : 'Internal Server Error'})
  }
}

// --dasbordupload
const DasbordUpload = async (req,res) => {
  try{
    const token = req.cookies.token
    if(!token){
      return res.status(401).redirect('/login')
    }

    const verifyToken =  await AuthToken(token)
    
    if(!verifyToken)
    {
      return res.status(401).redirect('/login')
    }

    req.session.User = verifyToken

    res.render('UploadDasbord',{
      title: 'halaman/upload',
      layout: 'main-layouts/main-layouts.ejs',
      msg: req.flash('msg'),
      Role: req.session.User ? req.session.User   :  undefined
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

module.exports = {HomeWeb,LoginPage,RegisterPage,DasbordWeb,DasbordUpload,SearchVideo}