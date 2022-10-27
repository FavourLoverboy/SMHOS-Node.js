require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const pages = process.env.PAGES;
const leader = process.env.LEADER;
const title = process.env.TITLE;

// leader
module.exports.leader_dashboard = (req, res) => {
    res.render(`${pages}/${leader}/Dashboard`, {
        title: `Dashboard | ${title}`,
        layout: './layout/mainLayout',
        user: req.user,
        page: leader
    });
}

// member
module.exports.member = async (req, res) => {
    let sql = 'SELECT * FROM members WHERE homecell_id = ? ORDER BY last_name';
    let homecell_id = req.user.homecell_id;
    const result = await db.promise().query(sql, homecell_id);
    res.render(`${pages}/${leader}/members`, {
        title: `Members | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: leader,
        success: req.flash('success'),
        members: result[0]
    });
}
module.exports.view_member = async (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM members WHERE id = ?';
    const result = await db.promise().query(sql, id);

    let homecell_id = result[0][0].homecell_id;
    let church_id = result[0][0].church_id;
    var result2 = '';
    var result3 = '';
    var homecell_leader = '';

    if(homecell_id != 0){
        let sql2 = 'SELECT name FROM homecells WHERE id = ?';
        var result2 = await db.promise().query(sql2, homecell_id);
        result2 = result2[0][0];

        let sql4 = "SELECT members.last_name, members.first_name FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND tbl_leaders.type = 'H' AND tbl_leaders.status = '1' LIMIT 1";
        const leader = await db.promise().query(sql4, homecell_id);
        homecell_leader = leader[0][0];
    }
    if(church_id != 0){
        let sql3 = 'SELECT name FROM churches WHERE id = ?';
        var result3 = await db.promise().query(sql3, church_id);
        result3 = result3[0][0];
    }


    res.render(`${pages}/${leader}/view`, {
        title: `Members | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: leader,
        members: result[0][0],
        homecell: result2,
        church: result3,
        homecell_leader: homecell_leader
    });
}
module.exports.add_member = async (req, res) => {
    let sql = 'SELECT name FROM homecells WHERE id = ? ORDER BY name';
    let homecell_id = req.user.homecell_id;
    const homecells = await db.promise().query(sql, homecell_id);

    let sql2 = 'SELECT name FROM churches';
    const churches = await db.promise().query(sql2);

    res.render(`${pages}/${leader}/add_member`, {
        title: `Add Homecell | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: leader,
        lname: req.body.lname,
        fname: req.body.fname,
        other: req.body.other,
        email: req.body.email,
        number: req.body.number,
        lga: req.body.lga,
        state: req.body.state,
        country: req.body.country,
        continent: req.body.continent,
        baptise: req.body.baptise,
        sex: req.body.sex,
        marital_status: req.body.marital_status,
        dob: req.body.dob,
        address: req.body.address,
        homecell: req.body.homecell,
        church: req.body.church,
        errLastName: req.flash('errLastName'),
        errFirstName: req.flash('errFirstName'),
        errEmail: req.flash('errEmail'),
        errLGA: req.flash('errLGA'),
        errState: req.flash('errState'),
        errCountry: req.flash('errCountry'),
        errContinent: req.flash('errContinent'),
        errSex: req.flash('errSex'),
        errMarital: req.flash('errMarital'),
        errDOB: req.flash('errDOB'),
        errAddress: req.flash('errAddress'),
        homecells: homecells[0][0],
        churches: churches[0][0]
    });
}
module.exports.add_member_post = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            if(error.msg === 'Last Name can\'t be empty'){
                req.flash('errLastName', error.msg);
            }else if(error.msg === 'First Name can\'t be empty'){
                req.flash('errFirstName', error.msg);
            }else if(error.msg === 'Email already exits'){
                req.flash('errEmail', error.msg);
            }
            else if(error.msg === 'LGA can\'t be empty'){
                req.flash('errLGA', error.msg);
            }
            else if(error.msg === 'State can\'t be empty'){
                req.flash('errState', error.msg);
            }
            else if(error.msg === 'Country can\'t be empty'){
                req.flash('errCountry', error.msg);
            }
            else if(error.msg === 'Continent can\'t be empty'){
                req.flash('errContinent', error.msg);
            }
            else if(error.msg === 'Sex can\'t be empty'){
                req.flash('errSex', error.msg);
            }
            else if(error.msg === 'Marital Status can\'t be empty'){
                req.flash('errMarital', error.msg);
            }
            else if(error.msg === 'DOB can\'t be empty'){
                req.flash('errDOB', error.msg);
            }
            else if(error.msg === 'Address can\'t be empty'){
                req.flash('errAddress', error.msg);
            }
        });

        let sql = 'SELECT name FROM homecells WHERE id = ? ORDER BY name';
        let homecell_id = req.user.homecell_id;
        const homecells = await db.promise().query(sql, homecell_id);

        let sql2 = 'SELECT name FROM churches';
        const churches = await db.promise().query(sql2);

        res.render(`${pages}/${leader}/add_member`, {
            title: `Add Homecell | ${title}`, 
            layout: './layout/mainLayout',
            user: req.user,
            page: leader,
            lname: req.body.lname,
            fname: req.body.fname,
            other: req.body.other,
            email: req.body.email,
            number: req.body.number,
            lga: req.body.lga,
            state: req.body.state,
            country: req.body.country,
            continent: req.body.continent,
            baptise: req.body.baptise,
            sex: req.body.sex,
            marital_status: req.body.marital_status,
            dob: req.body.dob,
            address: req.body.address,
            homecell: req.body.homecell,
            church: req.body.church,
            errLastName: req.flash('errLastName'),
            errFirstName: req.flash('errFirstName'),
            errEmail: req.flash('errEmail'),
            errLGA: req.flash('errLGA'),
            errState: req.flash('errState'),
            errCountry: req.flash('errCountry'),
            errContinent: req.flash('errContinent'),
            errSex: req.flash('errSex'),
            errMarital: req.flash('errMarital'),
            errDOB: req.flash('errDOB'),
            errAddress: req.flash('errAddress'),
            homecells: homecells[0][0],
            churches: churches[0][0]
        });
        return;
    }
    
    try{
        var { lname, fname, other, email, number, lga, state, country, continent, sex, marital_status, dob, baptise, address, homecell, church } = req.body;
        const hashed = await bcrypt.hash('123', 10);
        if(homecell){
            var sql = 'SELECT id FROM homecells WHERE name = ?';
            var result = await db.promise().query(sql, homecell);
            var home = result[0][0].id;
        }else{
            var home = '';
        }

        if(church){
            var sql = 'SELECT id FROM churches WHERE name = ?';
            var result = await db.promise().query(sql, church);
            var church = result[0][0].id;
        }else{
            var church = '';
        }
        
        var values = {
            last_name: lname,
            first_name: fname,
            other_name: other,
            email: email,
            number: number,
            address: address,
            baptise: baptise,
            sex: sex,
            dob: dob,
            marital_status: marital_status,
            lga: lga,
            state: state,
            country: country,
            continent: continent,
            username: `${lname}.${fname}`,
            password: hashed,
            profile: '/assets/profile.png',
            login: '0',
            homecell_id: home,
            church_id: church
        }
        var sql = 'INSERT INTO members SET ?';
        var result = await db.promise().query(sql, values);
        req.flash('success', 'Member have been Added');
        res.redirect(`/${leader}/member`);
    } catch(e) {
        console.log(e);
    }
}

module.exports.leader_profile = (req, res) => {
    res.render(`${pages}/${leader}/profile`, {
        title: 'Profile Page',
        layout: './layout/mainLayout',
        user: req.user,
        page: leader
    });
}
