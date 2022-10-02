// import dependencies
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

// import routes
const authRoutes = require('./routes/authRoutes');

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

// View Engine
app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log('Server has started.');
});

// routes
app.use(authRoutes);