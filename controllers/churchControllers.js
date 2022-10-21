require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const pages = process.env.PAGES;
const churchRoute = process.env.CHURCH;
const title = process.env.TITLE;

// church
module.exports.church_dashboard = (req, res) => {
    res.render(`${pages}/${churchRoute}/dashboard`, {
        title: `Dashboard | ${title}`,
        layout: './layout/mainLayout',
        user: req.user,
        page: churchRoute
    });
}

// homecell
module.exports.homecell = async (req, res) => {
    let sql = 'SELECT * FROM homecells WHERE church_id = ? ORDER BY name';
    let church_id = req.user.church_id;
    const result = await db.promise().query(sql, church_id);
    res.render(`${pages}/${churchRoute}/homecells`, {
        title: `Homecells | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: churchRoute,
        success: req.flash('success'),
        homecells: result[0]
    });
}
module.exports.view_homecell = async (req, res) => {
    let id = req.params.id;

    let sql = 'SELECT * FROM homecells WHERE id = ?';
    const homecells = await db.promise().query(sql, id);

    let sql2 = 'SELECT * FROM members WHERE homecell_id = ? ORDER BY date DESC LIMIT 5';
    const members = await db.promise().query(sql2, id);

    var count_member = members[0].length;

    res.render(`${pages}/${churchRoute}/view_homecell`, {
        title: `Homecell | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: churchRoute,
        members: members[0],
        homecells: homecells[0][0],
        count_member: count_member,
    });
}
module.exports.add_homecell = async (req, res) => {
    let sql = 'SELECT name FROM churches WHERE id = ? ORDER BY name';
    let church_id = req.user.church_id;
    const result = await db.promise().query(sql, church_id);
    res.render(`${pages}/${churchRoute}/add_homecell`, {
        title: `Add Homecell | ${title}`,
        layout: './layout/mainLayout',
        user: req.user,
        page: churchRoute,
        name: req.body.name,
        address: req.body.address,
        church: req.body.church,
        errName: req.flash('errName'),
        errAddress: req.flash('errAddress'),
        churches: result[0][0]
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
            }
        });
        let sql = 'SELECT name FROM churches WHERE id = ? ORDER BY name';
        let church_id = req.user.church_id;
        const result = await db.promise().query(sql, church_id);
        
        res.render(`${pages}/${churchRoute}/add_homecell`, {
            title: `Add Homecell | ${title}`,
            layout: './layout/mainLayout',
            user: req.user,
            page: churchRoute,
            name: req.body.name,
            address: req.body.address,
            church: req.body.church,
            errName: req.flash('errName'),
            errAddress: req.flash('errAddress'),
            churches: result[0][0]
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
        res.redirect(`/${churchRoute}/homecell`);
    } catch(e) {
        console.log(e);
    }
}

module.exports.church_profile = (req, res) => {
    res.render(`${pages}/${churchRoute}/profile`, {
        title: 'Profile Page',
        layout: './layout/mainLayout',
        user: req.user,
        page: churchRoute
    });
}
