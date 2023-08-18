


//homeWeb
const HomeWeb = (req,res) => {
    try{
        res.send('hello world')
    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
}








module.exports = {HomeWeb}