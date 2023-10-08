const {NewProfil,GetProfile,DeleteProfile} = require('../Utils/flowDBProfile')

// authToken
const {AuthToken} = require('../Auth/AuthMiddleware')




//Profile
const ProfileGet = async (req,res) =>{
    try{
      const token = req.cookies.token 
      if(!token){
        return res.status(401).redirect('/login')
      }

      const verifyToken = await AuthToken(token)
      

      if(!verifyToken)
      {
        return res.status(401).redirect('/login')
      }

      const oneUser = await GetProfile(verifyToken)
      if(!oneUser){
          return res.status(200).render('ProfileDasbord',{
            title: 'halaman/profile',
            layout : 'main-layouts/dasbord-layouts.ejs',
            Profile: oneUser,
            msg: req.flash('msg')
          })
      }

      const {_id,NameProfile,Subs,imageFile,imageType} = oneUser
      //decodediMage
      const ImageData = imageFile.toString('base64')
      const ImagePath  = `data:${imageType};base64,${ImageData}`
      const Profile = {_id,NameProfile,Subs ,ImagePath}
  
      res.render('ProfileDasbord',{
        title: 'halaman/profile',
        layout : 'main-layouts/dasbord-layouts.ejs',
        Profile,
        msg: req.flash('msg')
      })
      
    }catch(error){
      res.status(500).json({msg : 'Internal Server Error'})
    }
  }

//NewProfile
const ProfilePost = async (req,res)=>{
  try{
    const token = req.cookies.token 
    if(!token){
      return res.status(401).redirect('/login')
    }
   

  const verifyToken = await AuthToken(token)


  if(!verifyToken)
  {
    return res.status(401).redirect('/login')
  }

  const {NameProfile} = req.body

  let Subs = "0"
      
  const getFuPro = NewProfil(verifyToken,NameProfile,Subs,req.file)
    
  //saved
  const SaveProfile = await getFuPro.save()

  if(!SaveProfile){
    return res.status(401)
  }

  req.flash('msg','success Add Profile')
  res.status(201).redirect('/dasbord/profile')


  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}


//DeleteProfile
const ProfileDelete  = async (req,res) => {
  try{
    const token = req.cookies.token 
  
    if(!token){
      return res.status(401).redirect('/login')
    }

    const verifyToken = await AuthToken(token)

    
    if(!verifyToken)
    {
      return res.status(401).redirect('/login')
    }

    const oneUser = await GetProfile(verifyToken)

    if(!oneUser){
        return res.render('ProfileDasbord',{
          title: 'halaman/profile',
          layout : 'main-layouts/dasbord-layouts.ejs',
          Profile: oneUser,
          msg: req.flash('msg')
        })
    }

    const {_id} = req.body

    const deleted = await DeleteProfile(_id)

    if(!deleted){
      return res.status(401)
    }

    req.flash('msg','success Delete')
    res.redirect('/dasbord/profile')


  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}
  
 module.exports = {ProfileGet,ProfilePost,ProfileDelete}