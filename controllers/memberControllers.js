require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const pages = process.env.PAGES;
const member = process.env.MEMBER;
const title = process.env.TITLE;

// member
module.exports.member_dashboard = (req, res) => {
    res.render(`${pages}/${member}/Dashboard`, {
        title: `Dashboard | ${title}`,
        layout: './layout/mainLayout',
        user: req.user,
        page: member
    });
}

module.exports.member_profile = async (req, res) => {
    
    let id = req.user.id;
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
        console.log(leader[0][0]);
    }
    if(church_id != 0){
        let sql3 = 'SELECT name FROM churches WHERE id = ?';
        var result3 = await db.promise().query(sql3, church_id);
        result3 = result3[0][0];
    }

    res.render(`${pages}/${member}/profile`, {
        title: 'Profile Page',
        layout: './layout/mainLayout',
        user: req.user,
        page: member,
        members: result[0][0],
        homecell: result2,
        church: result3,
        homecell_leader: homecell_leader
    });
}
