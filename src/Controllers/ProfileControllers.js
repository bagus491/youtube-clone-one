const {NewProfil,GetProfile,DeleteProfile} = require('../Utils/flowDBProfile')

//jsonwebtoken 
const jwt = require('jsonwebtoken')
const secret = '!@#$%&*()-==-}?123'

const {GetUser} = require('../Utils/flowDBUser')


//Profile
const ProfileGet = async (req,res) =>{
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
            return res.status(203).render('Profile',{
              title: 'Profile',
              layout : 'Profile.ejs',
              Profile: oneUser,
              msg: req.flash('msg')
            })
        }

        const {_id,NameProfile,imageFile,imageType} = oneUser
        //decodediMage
        const ImageData = imageFile.toString('base64')
        const ImagePath  = `data:${imageType};base64,${ImageData}`

        const Profile = {_id,NameProfile,ImagePath}
        res.render('Profile',{
          title: 'Profile',
          layout : 'Profile.ejs',
          Profile,
          msg: req.flash('msg')
        })
      })
      
    }catch(error){
      res.status(500).json({msg : 'Internal Server Error'})
    }
  }

//NewProfile
const ProfilePost = async (req,res)=>{
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

      const {NameProfile} = req.body
      
      const getFuPro = NewProfil(decodedUser,NameProfile,req.file)
        
      //saved
      const SaveProfile = await getFuPro.save()

      if(!SaveProfile){
        return res.status(401)
      }

      req.flash('msg','success Add Profile')
      res.status(201).redirect('/dasbord/profile')
    })
  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}


//DeleteProfile
const ProfileDelete  = async (req,res) => {
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

      const deleted = await DeleteProfile(deleteProfile)

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
  
 module.exports = {ProfileGet,ProfilePost,ProfileDelete}