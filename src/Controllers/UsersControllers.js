


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








module.exports = {HomeWeb}