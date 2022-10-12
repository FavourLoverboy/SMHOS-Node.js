require('dotenv').config();
const { validationResult } = require('express-validator');
const db = require('../config/db');

const pages = process.env.PAGES;
const admin = process.env.ADMIN;
const title = process.env.TITLE;

// dashboard
module.exports.admin_dashboard = (req, res) => {
    res.render(`${pages}/${admin}/Dashboard`, {
        title: `Dashboard | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin
    });
}
// church
module.exports.church = async (req, res) => {
    let sql = 'SELECT * FROM churches ORDER BY name';
    const result = await db.promise().query(sql);
    res.render(`${pages}/${admin}/churches`, {
        title: `Churches | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        success: req.flash('success'),
        churches: result[0]
    });
}
module.exports.add_church = (req, res) => {
    res.render(`${pages}/${admin}/add_church`, {
        title: `Add Church | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        continent: req.body.continent,
        country: req.body.country,
        state: req.body.state,
        lga: req.body.lga,
        name: req.body.name,
        errContinent: req.flash('errContinent'),
        errCountry: req.flash('errCountry'),
        errState: req.flash('errState'),
        errLga: req.flash('errLga'),
        errName: req.flash('errName')
    });
}
module.exports.add_church_post = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            if(error.msg === 'Continent can\'t be empty'){
                req.flash('errContinent', error.msg);
            }else if(error.msg === 'Country can\'t be empty'){
                req.flash('errCountry', error.msg);
            }else if(error.msg === 'State can\'t be empty'){
                req.flash('errState', error.msg);
            }else if(error.msg === 'LGA can\'t be empty'){
                req.flash('errLga', error.msg);
            }else if(error.msg === 'Name can\'t be empty' || error.msg === 'This church already exits'){
                req.flash('errName', error.msg);
            }
        });
        res.render(`${pages}/${admin}/add_church`, {
            title: `Add Church | ${title}`, 
            layout: './layout/mainLayout',
            user: req.user,
            page: admin,
            continent: req.body.continent,
            country: req.body.country,
            state: req.body.state,
            lga: req.body.lga,
            name: req.body.name,
            errContinent: req.flash('errContinent'),
            errCountry: req.flash('errCountry'),
            errState: req.flash('errState'),
            errLga: req.flash('errLga'),
            errName: req.flash('errName')
        });
        return;
    }
    try{
        var { continent, country, state, lga, name } = req.body;
        const values = {
            name: name,
            lga: lga,
            state: state,
            country: country,
            continent: continent,
            // date: date("y-m-d h:i:s")
        }
        let sql = 'INSERT INTO churches SET ?';
        const result = await db.promise().query(sql, values);
        req.flash('success', 'Church have been Created');
        res.redirect(`/${admin}/church`);
    } catch(e) {
        console.log(e);
    }
}

// homecell
module.exports.homecell = async (req, res) => {
    let sql = 'SELECT churches.name, homecells.name, homecells.date FROM churches INNER JOIN homecells ON churches.id = homecells.church_id ORDER BY homecells.name';
    const result = await db.promise().query(sql);
    res.render(`${pages}/${admin}/homecells`, {
        title: `Homecells | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        success: req.flash('success'),
        homecells: result[0]
    });
}
module.exports.add_homecell = async (req, res) => {
    let sql = 'SELECT name FROM churches ORDER BY name';
    const result = await db.promise().query(sql);
    res.render(`${pages}/${admin}/add_homecell`, {
        title: `Add Homecell | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        name: req.body.name,
        address: req.body.address,
        church: req.body.church,
        errName: req.flash('errName'),
        errAddress: req.flash('errAddress'),
        errChurch: req.flash('errChurch'),
        churches: result[0]
    });
}
module.exports.add_homecell_post = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            if(error.msg === 'Name can\'t be empty' || error.msg === 'Homecell already exits'){
                req.flash('errName', error.msg);
            }else if(error.msg === 'Address can\'t be empty'){
                req.flash('errAddress', error.msg);
            }else if(error.msg === 'Church can\'t be empty'){
                req.flash('errChurch', error.msg);
            }
        });
        let sql = 'SELECT name FROM churches ORDER BY name';
        const result = await db.promise().query(sql);
        res.render(`${pages}/${admin}/add_homecell`, {
            title: `Add Homecell | ${title}`, 
            layout: './layout/mainLayout',
            user: req.user,
            page: admin,
            name: req.body.name,
            address: req.body.address,
            church: req.body.church,
            errName: req.flash('errName'),
            errAddress: req.flash('errAddress'),
            errChurch: req.flash('errChurch'),
            churches: result[0]
        });
        return;
    }
    
    try{
        var { name, church, address } = req.body;
        var sql = 'SELECT id FROM churches WHERE name = ?';
        var result = await db.promise().query(sql, church);
        var values = {
            church_id: result[0][0].id,
            name: name,
            address: address,
        }
        var sql = 'INSERT INTO homecells SET ?';
        var result = await db.promise().query(sql, values);
        req.flash('success', 'Homecell have been Created');
        res.redirect(`/${admin}/homecell`);
    } catch(e) {
        console.log(e);
    }
}
















module.exports.admin_profile = (req, res) => {
    res.render(`${pages}/${admin}/profile`, {
        title: 'Profile Page',
        layout: './layout/mainLayout',
        user: req.user,
        page: admin
    });
}