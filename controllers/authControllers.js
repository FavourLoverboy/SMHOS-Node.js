// login
module.exports.login_get = (req, res) => {
    res.render('auth/login', {
        title: 'Login Page'
    });
}