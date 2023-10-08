
//getVideo
const {GetVideo} = require('../Utils/flowDBVideo')



//getProfile
const {GetProfile} = require('../Utils/flowDBProfile')

//verfiy
const {AuthToken} = require('../Auth/AuthMiddleware')


//homeWeb
const HomeWeb = async (req,res) => {
    try{
      const token = req.cookies.token

      let page = req.query.page

      let Datas = await GetVideo()

      let search = req.query.q


      if(search === '')
      {
        return res.status(401).redirect('/')
      }

      if(search)
      {

      let newDatas = Datas.filter((e) => e.Title.toLowerCase().includes(search.toLowerCase()) || e.username.toLowerCase().includes(search.toLowerCase()))

      
         //map
      const dataMap = await Promise.all(
        newDatas.map((e) => {
          const {_id,username,Title,Desc,Slug,PostDate,VideoFile,VideoType,PosterFile,PosterType,Views} = e
                  
          //decoded
          const VideoData = VideoFile.toString('base64')
          //path
          const VideoPath = `data:${VideoType};base64,${VideoData}`
            //decodedPoster
            const PosterData = PosterFile.toString('base64')
            // value
            const PosterPath = `data:${PosterType};base64,${PosterData}`
  
          return {_id,username,Title,Desc,Slug,PostDate,VideoPath,PosterPath,Views}
        })
      )

      const verifyToken = await AuthToken(token)
     
       req.session.User = verifyToken

      return res.render('HomeWeb',{
        title: 'Home',
        layout : 'main-layouts/main-layouts.ejs',
        Video: dataMap,
        Role: req.session.User ?  req.session.User  : undefined
      })

      }

      //map
      const dataMap = await Promise.all(
        Datas.map((e) => {
          const {_id,username,Title,Desc,Slug,PostDate,VideoFile,VideoType,PosterFile,PosterType,Views} = e
                  
          //decoded
          const VideoData = VideoFile.toString('base64')
          //path
          const VideoPath = `data:${VideoType};base64,${VideoData}`
            //decodedPoster
            const PosterData = PosterFile.toString('base64')
            // value
            const PosterPath = `data:${PosterType};base64,${PosterData}`
  
          return {_id,username,Title,Desc,Slug,PostDate,VideoPath,PosterPath,Views}
        })
      )

      const verifyToken = await AuthToken(token)
     
       req.session.User = verifyToken

       //pagination
       let jmlhperhalaman = 5
      //  panjangData
      let panjangData = dataMap.length
      // jmlhhalaman
      let jmlhhalaman = Math.ceil(panjangData / jmlhperhalaman)
      // awal data
      let pageData = page ?  page  : 1

      // strindex
      let strindex = (pageData - 1 ) * jmlhperhalaman
      //lastindex
      let indexlas = strindex + jmlhperhalaman;

      // math.slice
      const dataMapSlice = dataMap.slice(strindex,indexlas)
      

      res.render('HomeWeb',{
        title: 'Home',
        layout : 'main-layouts/main-layouts.ejs',
        Video: dataMapSlice,
        Role: req.session.User ?  req.session.User  : undefined,
        jmlhhalaman
      })
    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
}


//Dasbord
const DasbordWeb = async (req,res) => {
  try{
    const token = req.cookies.token 
    if(!token){
      return res.status(401)
    }

    const verifyToken = await AuthToken(token)

    if(!verifyToken)
    {
      return res.status(401).redirect('/login')
    }

    const search = req.query.q

    if(search)
    {
      return res.redirect('/')
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
            const {_id,Title,Desc,Slug,PosterType,PosterFile,PostDate,VideoFile,VideoType,Views} = e
            
            //decoded
            const VideoData = VideoFile.toString('base64')
            //path
            const VideoPath = `data:${VideoType};base64,${VideoData}`

            //decodedPoster
            const PosterData = PosterFile.toString('base64')
            // value
            const PosterPath = `data:${PosterType};base64,${PosterData}`

  

            return {_id,Title,Desc,Slug,PostDate,VideoPath,PosterPath,Views}
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
       Video: Changes,
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

    const search = req.query.q

    if(search)
    {
      return res.redirect('/')
    }

    //checkProfile
    const checkProfile = await GetProfile(verifyToken)

    if(!checkProfile)
    {
      req.flash('msg','upload Profile First')
      return res.status(401).redirect('/dasbord/profile')
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
const LoginPage = async (req,res) => {
  try{
    const token = req.cookies.token 
    if(!token) {
      return res.status(401).render('Login',{
        title: 'Login',
        layout : 'Login.ejs',
        msg: req.flash('msg')
      })
    }

    const verifyToken = await AuthToken(token)
    if(!verifyToken)
    {
      return res.status(401).render('Login',{
        title: 'Login',
        layout : 'Login.ejs',
        msg: req.flash('msg')
      })
    }

    
    res.redirect('/')
    
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





module.exports = {HomeWeb,LoginPage,RegisterPage,DasbordWeb,DasbordUpload}