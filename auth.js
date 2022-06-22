module.exports = function auth(req,res,next){
    if(req.session.logged){
        next()
    }else{
        req.session.logged = false
        res.redirect("http://localhost/login")
    }
}