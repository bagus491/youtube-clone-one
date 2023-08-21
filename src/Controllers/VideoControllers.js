const {NewVideo,GetVideo,GetDeleteVideo} = require('../Utils/Index')

//jsonwebtoken 
const jwt = require('jsonwebtoken')
const secret = '!@#$%&*()-==-}?123'

const {GetUser} = require('../Utils/Index')


//Profile
const VideoGet = async (req,res) =>{
    try{
      const token = req.cookies.token || req.headers.authorization
      if(!token){
        return res.status(401)
      }

      jwt.verify(token,secret, async (err,decoded) => {
        if(err){
            return res.status(401)
        }

        const decodedUser = decoded.username
        
        const CheckUser = await GetUser(decodedUser)
        if(!CheckUser){
            return res.status(401)
        }

        //this array
        const Videos = await GetVideo()

        //filterArray
        const FilterdArray = Videos.filter((e) => e.username === decodedUser)
       

        if(!FilterdArray){
            return res.status(203).render('Upload',{
             title: 'Upload',
             layout : 'Upload.ejs',
              Video: FilterdArray,
              msg: req.flash('msg')
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
            return res.status(203).render('Upload',{
                title: 'Upload',
                layout : 'Upload.ejs',
                 Vidoe: FilterdArray,
                 msg: req.flash('msg')
        })
        }
        
       
        res.render('Upload',{
            title: 'Upload',
            layout : 'Upload.ejs',
            Video: Changes,
            msg : req.flash('msg')
          })
      })
      
    }catch(error){
      res.status(500).json({msg : 'Internal Server Error'})
    }
  }

//NewProfile
const VideoPost = async (req,res)=>{
  try{
    const token = req.cookies.token || req.headers.authorization
    if(!token){
      return res.status(401)
    }

    jwt.verify(token,secret, async (err,decoded) => {
      if(err){
          return res.status(401)
      }

      const decodedUser = decoded.username
      
      const CheckUser = await GetUser(decodedUser)
      if(!CheckUser){
          return res.status(401)
      }

      const {Title,Desc} = req.body
      const PostDate = new Date()
      const Views = "0"
      
      const getFuPro = NewVideo(decodedUser,Title,Desc,PostDate,req.file,Views)
        
      //saved
      const SaveVideo = await getFuPro.save()

      if(!SaveVideo){
        return res.status(401)
      }

      req.flash('msg','success Add Video')
      res.status(201).redirect('/dasbord/upload')
    })
  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}


//DeleteProfile
const VideoDelete  = async (req,res) => {
  try{
    const token = req.cookies.token || req.headers.authorization
    if(!token){
      return res.status(401)
    }

    jwt.verify(token,secret, async (err,decoded) => {
      if(err){
          return res.status(401)
      }

      const decodedUser = decoded.username
      
      const CheckUser = await GetUser(decodedUser)
      if(!CheckUser){
          return res.status(401)
      }

      const oneUser = await GetProfile(decodedUser)
      if(!oneUser){
          return res.render('Profile',{
            title: 'Profile',
            layout : 'Profile.ejs',
            Profile: oneUser,
            msg: req.flash('msg')
          })
      }

      const {deleteProfile} = req.body

      const deleted = await GetDelete(deleteProfile)

      if(!deleted){
        return res.status(401)
      }

      req.flash('msg','success Delete')
      res.redirect('/dasbord/profile')
    })
    
  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}
  
 module.exports = {VideoGet,VideoPost,VideoDelete}