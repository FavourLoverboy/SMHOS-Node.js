// import dependencies
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');


// import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require('./routes/memberRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// MiddleWare
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    cookie: {
        maxAge: 60000 * 60
    },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
app.use(expressLayouts);

// View Engine
app.set('view engine', 'ejs');
app.set('layout', './layout/loginLayout');

app.listen(PORT, () => {
    console.log('Server has started.');
});

// routes
app.use(authRoutes);
app.use(adminRoutes);
app.use(memberRoutes);