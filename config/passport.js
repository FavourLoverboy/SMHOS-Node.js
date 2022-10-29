const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../config/db');


function initialize(passport){
    const authenticateUser = async (email, password, done) =>{
        
        try{
            const sql = 'SELECT * FROM tbl_login WHERE email = ?';
            const result = await db.promise().query(sql, email);
            if(result[0][0] == undefined){
                const sql1 = 'SELECT * FROM members WHERE email = ?';
                const result1 = await db.promise().query(sql1, email);
                if(result1[0][0] == undefined){
                    done(null, false, {
                        message: "No user with that email"
                    });
                }else{
                    if(await bcrypt.compare(password, result1[0][0].password)){
                        done(null, result1[0][0]);
                    }else{
                        done(null, false, {
                            message: 'Password incorrect'
                        });
                    } 
                }
            }else{
                if(await bcrypt.compare(password, result[0][0].password)){
                    done(null, result[0][0]);
                }else{
                    done(null, false, {
                        message: 'Password incorrect'
                    });
                }
            }
        }catch (e){
            done(null, false);
        }
    }

    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.email));
    passport.deserializeUser(async (email, done) => {
        try{
            const sql5 = 'SELECT * FROM tbl_login WHERE email = ?';
            const nextStep = await db.promise().query(sql5, email);
            if(nextStep[0][0] == undefined){
                const sql11 = 'SELECT * FROM members WHERE email = ?';
                const result12 = await db.promise().query(sql11, email);
                if(result12[0][0]){
                    done(null, result12[0][0]);
                }
            }else{
                done(null, nextStep[0][0]);
            }
        }catch (err){
            done(err, null);
        }
    })
}

module.exports = initialize;