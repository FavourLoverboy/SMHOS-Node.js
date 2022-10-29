require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const initializePassport = require('../config/passport');

const admin = process.env.ADMIN;
const church = process.env.CHURCH;
const leader = process.env.LEADER;
const member = process.env.MEMBER;
const title = process.env.TITLE;

initializePassport(passport);

// Member login get
module.exports.login_get = (req, res) => {
    res.render('auth/login', {
        title: `Login | ${title}`,
        layout: './layout/loginLayout',
        email: req.body.email,
        errEmail: req.flash('errEmail'),
        errPassword: req.flash('errPassword')
    });
}
// Member login post
module.exports.login_post = passport.authenticate('local', {
    successRedirect: '/check',
    failureRedirect: '/',
    failureFlash: true
})

// logout
module.exports.logout = ((req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// 404 page
module.exports.page_404 = (req, res) => {
    res.render('auth/404', {
        title: `404 | ${title}`,
        layout: './layout/loginLayout',
    })
} 

// check user rank (level)
module.exports.check = async (req, res) => {
    const user = req.user;
    let sql = `UPDATE members SET login = NOW() WHERE password = '${user.password}'`;
    const update = await db.promise().query(sql);

    if(user.level == 'A'){
        res.redirect(`/${admin}/dashboard`);
    }else if(user.level == 'C'){
        res.redirect(`/${church}/dashboard`);
    }else if(user.level == 'L'){
        res.redirect(`/${leader}/dashboard`);
    }else{
        res.redirect(`/${member}/dashboard`);
    }
}