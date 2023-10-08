
const {NewVideo,GetVideo,GetDeleteVideo,GetVideoById,UpdateVideoViews} = require('../Utils/flowDBVideo')




// verify
const {AuthToken} = require('../Auth/AuthMiddleware')



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
      

      const getFuPro = await NewVideo(verifyToken,Title,Desc,Slug,req.files['Poster'][0],PostDate,req.files['Video'][0],Views)

   
      
    //saved
    const SaveVideo = await getFuPro.save()

    if(!SaveVideo){
      return res.status(401).redirect('/dasbord/upload')
    }

    req.flash('msg','success Add Video')
   return res.status(201).redirect('/dasbord/upload')

    }
    
    const getFuPro = await NewVideo(verifyToken,Title,Desc,Slug,req.files['Poster'][0],PostDate,req.files['Video'][0],Views)
      
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
   
    const {_id} = req.body

    const deleted = await GetDeleteVideo(_id)

    if(!deleted){
      return res.status(401).redirect('/dasbord')
    }

    req.flash('msg','success Delete')
    res.redirect('/dasbord')

    
  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}

//WatchVideo
const VideoWatch = async (req,res) => {
  try{
    const token = req.cookies.token 
    if(token){
      const verifyToken = await AuthToken(token)

      const VideoOk = await GetVideoById(req.params.id)
      if(!VideoOk){
        return res.status(401).redirect('/')
      } 


     //destruction
     const {_id,username,Title,Desc,Slug,PostDate,VideoFile,VideoType,Views} = VideoOk

 
     if(verifyToken != username){
       //const do Change Views
        let DataView = parseInt(Views)
      
        // add one
        DataView += 1

        //newViews
        const newView = DataView.toString()

        //update
        const updated = await UpdateVideoViews(_id,newView)
        if(!updated){
          return res.status(401)
        } 
     }

     //chanse
     const VideoData = VideoFile.toString('base64')
     const VideoPath = `data:${VideoType};base64,${VideoData}`;

    
     //filtersub
     const Videos = await GetVideo()

  
     const filterData = Videos.filter((e) => e._id.toString() != _id.toString())

     const MapFilterData = await Promise.all(
      filterData.map((e) => {
        const {_id,Title,Slug,PosterFile,PosterType,Views} = e 

        
          const PosterData = PosterFile.toString('base64')
         const PosterPath = `data:${PosterType};base64,${PosterData}`

         return {_id,Title,Slug,PosterPath,Views}

      })
     )

  
     
     const Data = {_id,username,Title,Desc,Slug,PostDate,VideoPath,Views}


     req.session.User = username
  
     res.render('Watch',{
      title:'halaman/watch',
      layout: 'main-layouts/main-layouts.ejs',
      Data,
      Role: req.session.User ?  req.session.User  : undefined,
      filterData:MapFilterData
     })
      
    }else{
      const VideoOk = await GetVideoById(req.params.id)
      if(!VideoOk){
        return res.status(401)
      } 

  

     //destruction
     const {_id,Title,Desc,Slug,PostDate,VideoFile,VideoType,Views} = VideoOk

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
     const VideoData = VideoFile.toString('base64')
     const VideoPath = `data:${VideoType};base64,${VideoData}`;


       //filtersub
       const Videos = await GetVideo()
    

       const filterData = Videos.filter((e) => e._id.toString() != req.params.id.toString())

  
       const MapFilterData = await Promise.all(
        filterData.map((e) => {
          const {_id,Title,Slug,PosterFile,PosterType,Views} = e 
  
          
            const PosterData = PosterFile.toString('base64')
           const PosterPath = `data:${PosterType};base64,${PosterData}`
  
           return {_id,Title,Slug,PosterPath,Views}
  
        })
       )

  
     
     const Data = {_id,Title,Desc,Slug,PostDate,VideoPath,Views}
  

     res.render('Watch',{
      title:'halaman/watch',
      layout: 'main-layouts/main-layouts.ejs',
      Data,
      Role: req.session.User ?  req.session.User  : undefined,
      filterData:MapFilterData
     })
    }

  }catch(error){
    res.status(500).json({msg : 'Internal Server Error'})
  }
}
  
 module.exports = {VideoPost,VideoDelete,VideoWatch}