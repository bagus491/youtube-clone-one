const {AuthToken} = require('../../Auth/AuthMiddleware')


const CheckDasbord = (req,res,next) =>{
    try{
        const token = req.cookies.token 
        if(!token){
            return res.status(401).redirect('/login')
        }

        const VerifyToken = AuthToken(token)

        if(!VerifyToken)
        {
            return res.status(401).redirect('/login')
        }

        req.session.User = VerifyToken
        next()

    }catch(error){
        res.status(500).json({msg : 'Internal Server Error'})
    }
}


module.exports  = {CheckDasbord}