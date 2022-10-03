const checkAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

const checkNotAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        res.redirect('/check');
    }
    next();
}


module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}