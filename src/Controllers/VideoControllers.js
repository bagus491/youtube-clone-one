
const {NewVideo,GetVideo,GetDeleteVideo,GetVideoById,UpdateVideoViews} = require('../Utils/flowDBVideo')

//User
const {GetUser} = require('../Utils/flowDBUser')


// verify
const {jwt,secret,AuthToken} = require('../Auth/AuthMiddleware')



//NewProfile
const VideoPost = async (req,res)=>{
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

    const {Title,Desc} = req.body
    const PostDate = new Date()
    const Views = "0"

    //validatePoster
    const PosterType = req.files['Poster'][0].mimetype
    //PosterValid
    const PosterValid = ['png','jpeg','jpg']
    // splitPoster
    const TypeChange = PosterType.split('/')
    // getLast
    const lastFormat = TypeChange[TypeChange.length - 1]
    // sameArray
    const FindPosterFormat = PosterValid.find((e) => e === lastFormat)

    if(!FindPosterFormat)
    {
      req.flash('msg','Your Upload Not Poster')
      return res.status(401).redirect('/dasbord/upload')
    }

    //videoValidate
    const VideoType = req.files['Video'][0].mimetype
    //videoRule
    const VideoRule = ['mp4','mkv','mov','avi']
    //VideoTypeToArray
    const ChangeType = VideoType.split('/')
    // findVideoRule
    const getFormat = ChangeType[ChangeType.length - 1]
    //sameArray
    const FindFormat = VideoRule.find((e) => e === getFormat)

    if(!FindFormat)
    {
      req.flash('msg','Your Upload Not Video')
      return res.status(401).redirect('/dasbord/upload')
    }


    //slug
    const TitleSplit = Title.split(' ')
   

    if(TitleSplit.length > 0)
    {

      const addStrip = TitleSplit.map((e) => {
        return e += '-'
      })

      //delete all - 
      // getLast
      const lastStrip = addStrip[addStrip.length - 1]
      // splitAgain
      const lastStripSplit = lastStrip.split('')
      // deleteLast
      delete lastStripSplit[lastStripSplit.length - 1]
      

      //makenewArray
      const beforeSlug = addStrip.filter((e) => e !== lastStrip)

      const Slug = beforeSlug.join('') + lastStripSplit.join('')
      

      const getFuPro = await NewVideo(verifyToken,Title,Desc,Slug,req.files['Video'][0],PostDate,req.files['Poster'][0],Views)

   
      
    //saved
    const SaveVideo = await getFuPro.save()

    if(!SaveVideo){
      return res.status(401).redirect('/dasbord/upload')
    }

    req.flash('msg','success Add Video')
   return res.status(201).redirect('/dasbord/upload')

    }
    
    const getFuPro = await NewVideo(verifyToken,Title,Desc,Slug,req.files['Video'][0],PostDate,req.files['Poster'][0],Views)
      
    //saved
    const SaveVideo = await getFuPro.save()

    if(!SaveVideo){
      return res.status(401).redirect('/dasbord/upload')
    }

    req.flash('msg','success Add Video')
    res.status(201).redirect('/dasbord/upload')


  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}


//DeleteProfile
const VideoDelete  = async (req,res) => {
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
   
    const {deleteVIdeo} = req.body

    const deleted = await GetDeleteVideo(deleteVIdeo)

    if(!deleted){
      return res.status(401).redirect('/dasbord')
    }

    req.flash('msg','success Delete')
    res.redirect('/dasbord/upload')

    
  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}

//WatchVideo
const VideoWatch = async (req,res) => {
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
  
        const VideoOk = await GetVideoById(req.params.id)
        if(!VideoOk){
          return res.status(401).redirect('/login')
        } 
  
       //destruction
       const {_id,username,Title,Desc,PostDate,Videofile,Videotype,Views} = VideoOk


       if(decodedUser != username){
         //const do Change Views
          let DataView = parseInt(Views)
        
          // add one
          DataView += 1
  
          //newViews
          const newView = DataView.toString()
  
          //update
          const updated = await UpdateVideoViews(req.params.id,newView)
          if(!updated){
            return res.status(401)
          } 
       }

       //chanse
       const VideoData = Videofile.toString('base64')
       const VideoPath = `data:${Videotype};base64,${VideoData}`;

       //filtersub
       const Videos = await GetVideo()
    
       const filterData = Videos.filter((e) => e._id != req.params.id)
        
       const Data = {_id,username,Title,Desc,PostDate,VideoPath,Views}
      

       res.render('Watch',{
        title:'halaman/watch',
        layout: 'Watch.ejs',
        Data,
        user:true,
        filterData
       })
        
      })
      
    }else{
      const VideoOk = await GetVideoById(req.params.id)
      if(!VideoOk){
        return res.status(401)
      } 

     //destruction
     const {_id,Title,Desc,PostDate,Videofile,Videotype,Views} = VideoOk

       //const do Change Views
       let DataView = parseInt(Views)
      
       // add one
       DataView += 1

       //newViews
       const newView = DataView.toString()

       //update
       const updated = await UpdateVideoViews(req.params.id,newView)
       if(!updated){
         return res.status(401)
       }
    
     //chanse
     const VideoData = Videofile.toString('base64')
     const VideoPath = `data:${Videotype};base64,${VideoData}`;

       //filtersub
       const Videos = await GetVideo()

       const filterData = Videos.filter((e) => e._id.toString() != req.params.id.toString())
  
     
     const Data = {_id,Title,Desc,PostDate,VideoPath,Views}

     res.render('Watch',{
      title:'halaman/watch',
      layout: 'Watch.ejs',
      Data,
      user:false,
      filterData
     })
    }

  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}
  
 module.exports = {VideoPost,VideoDelete,VideoWatch}