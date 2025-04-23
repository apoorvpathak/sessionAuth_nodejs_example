export function checkLoggedIn(req, res, next){
    if(req.session.user){
        next()
    } else {
        res.redirect('/login')
    }
}

export function bypassLogin(req, res, next){
    if(!req.session.user){
        next()
    } else {
        res.redirect('/')
    }
}