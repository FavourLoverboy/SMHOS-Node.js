require('dotenv').config();

const admin = process.env.ADMIN;
const church = process.env.CHURCH;
const leader = process.env.LEADER;
const member = process.env.MEMBER;

// controlling user access to pages
module.exports.userAccess = (req, res, next) => {
    const user = req.user.level;
    const url = req.url[1];

    if(user == 'A'){
        if(url != 'a'){
            res.redirect(`/${admin}/dashboard`);
        }
        return next();
    }
    else if(user == 'C'){
        if(url != 'c'){
            res.redirect(`/${church}/dashboard`);
        }
        return next();
    }
    else if(user == 'L'){
        if(url != 'l'){
            res.redirect(`/${leader}/dashboard`);
        }
        return next();
    }
    else{
        if(url != 'm'){
            res.redirect(`/${member}/dashboard`);
        }
        return next();
    }
}