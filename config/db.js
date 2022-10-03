require('dotenv').config();
const mysql2 = require('mysql2');

//create connection
const db = mysql2.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database: process.env.DATABASE
});

// connect
db.connect((err) => {
    if(err){
        throw err;
    }else{
        console.log('Database Connected');
    }
});

module.exports = db;