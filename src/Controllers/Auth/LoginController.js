const {jwt,secret} = require('../../Auth/AuthMiddleware')


//login
const LoginPost = (req,res) => {
    try{
        const {username} = req.body

        jwt.sign({username},secret,{expiresIn: '1h'}, (err,token) => {
            if(err){
                return res.status(401).json({msg : 'Not Authorization'})
            }
    
            res.cookie('token',token)
            req.session.User = username
            res.redirect('/')
        })
    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
}


module.exports = {LoginPost}