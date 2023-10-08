//logout

const LogoutUser = (req,res) => {
    try{
    req.flash('msg','success Logout')
    res.clearCookie('token','')
    res.session.User = ''
    res.redirect('/login')
    }catch(error){
        return res.status(500).send({msg:'Internal Server Error'})
    }
}


module.exports = {LogoutUser}