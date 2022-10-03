

const verifyLogin = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            if(error.msg === 'Must be a valid email'){
                req.flash('errEmail', error.msg);
            }else{
                req.flash('errPassword', error.msg);
            }
        });
        res.render('auth/login', {
            title: `Login | ${title}`,
            layout: './layout/loginLayout',
            email: req.body.email,
            errEmail: req.flash('errEmail'),
            errPassword: req.flash('errPassword')
        });
        return;
    }
}

module.exports = {
    verifyLogin
}