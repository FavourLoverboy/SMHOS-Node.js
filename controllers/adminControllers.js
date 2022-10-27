require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
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
module.exports.view_church = async (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM churches WHERE id = ?';
    const churches = await db.promise().query(sql, id);

    let sql2 = 'SELECT * FROM homecells WHERE church_id = ? ORDER BY date DESC LIMIT 5';
    const homecells = await db.promise().query(sql2, id);

    let sql3 = 'SELECT * FROM members WHERE church_id = ? ORDER BY date DESC LIMIT 5';
    const members = await db.promise().query(sql3, id);

    let sql4 = "SELECT members.id, members.last_name, members.first_name, members.email, tbl_leaders.date FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND status = '1'";
    const church_leaders = await db.promise().query(sql4, id);

    var count_member = members[0].length;
    var count_homecell = homecells[0].length;

    res.render(`${pages}/${admin}/view_church`, {
        title: `Members | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        members: members[0],
        homecells: homecells[0],
        churches: churches[0][0],
        count_member: count_member,
        count_homecell: count_homecell,
        church_leaders: church_leaders[0]
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
module.exports.add_church_leader = async (req, res) => {
    let id = req.params.id;

    let sql = "SELECT members.id, members.last_name, members.first_name, members.email, tbl_leaders.date FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND status = '1'";
    const church_leaders = await db.promise().query(sql, id);

    let sql3 = "SELECT * FROM members WHERE email != '' AND church_id = ? ORDER BY last_name";
    const members = await db.promise().query(sql3, id);
    
    res.render(`${pages}/${admin}/add_church_leader`, {
        title: `Assign Church Leader | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        members: members[0],
        member_church_id: id,
        errEmail: req.flash('errEmail'),
        errReason: req.flash('errReason'),
        errmsg: req.flash('errmsg'),
        sucmsg: req.flash('sucmsg'),
        sucdel: req.flash('sucdel'),
        church_leaders: church_leaders[0]
    });
}
module.exports.remove_church_leader_post = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            if(error.msg === 'Reason can\'t be empty'){
                req.flash('errReason', error.msg);
            }
        });

        let id = req.params.id;

        let sql = "SELECT members.id, members.last_name, members.first_name, members.email, tbl_leaders.date FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND status = '1'";
        const church_leaders = await db.promise().query(sql, id);

        let sql3 = "SELECT * FROM members WHERE email != '' AND church_id = ? ORDER BY last_name";
        const members = await db.promise().query(sql3, id);
        
        res.render(`${pages}/${admin}/add_church_leader`, {
            title: `Assign Church Leader | ${title}`, 
            layout: './layout/mainLayout',
            user: req.user,
            page: admin,
            members: members[0],
            member_church_id: id,
            errEmail: req.flash('errEmail'),
            errReason: req.flash('errReason'),
            errmsg: req.flash('errmsg'),
            sucmsg: req.flash('sucmsg'),
            sucdel: req.flash('sucdel'),
            church_leaders: church_leaders[0]
        });
        return;
    }

    try{
        var { leader_id, church_id, church_leader_email, reason } = req.body;
        
        let sql = `UPDATE tbl_leaders SET reason = ?, status = '0' WHERE user_id = ${leader_id} AND lead_id = ${church_id} AND type = 'C'`;
        const members = await db.promise().query(sql, reason);
        
        let sql2 = `DELETE FROM tbl_login WHERE email = '${church_leader_email}' AND church_id = ${church_id} AND level = 'C'`;
        const remove = await db.promise().query(sql2);

        req.flash('sucdel', 'church leader remove successfully');
        res.redirect(`/${admin}/add_church_leader/${church_id}`);
    } catch(e) {
        console.log(e);
    }
}
module.exports.add_church_leader_post = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            if(error.msg === 'Email can\'t be empty'){
                req.flash('errEmail', error.msg);
            }
        });

        let id = req.body.church_id;

        let sql = "SELECT members.id, members.last_name, members.first_name, members.email, tbl_leaders.date FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND status = '1'";
        const church_leaders = await db.promise().query(sql, id);

        let sql3 = "SELECT * FROM members WHERE email != '' AND church_id = ? ORDER BY last_name";
        const members = await db.promise().query(sql3, id);

        res.render(`${pages}/${admin}/add_church_leader`, {
            title: `Assign Church Leader | ${title}`, 
            layout: './layout/mainLayout',
            user: req.user,
            page: admin,
            members: members[0],
            errEmail: req.flash('errEmail'),
            errReason: req.flash('errReason'),
            errmsg: req.flash('errmsg'),
            sucmsg: req.flash('sucmsg'),
            sucdel: req.flash('sucdel'),
            church_leaders: church_leaders[0]
        });
        return;
    }
    try{
        var { church_id, email } = req.body;
        
        let sql3 = `SELECT * FROM members WHERE email = ? AND church_id = ${church_id}`;
        const members = await db.promise().query(sql3, email);
        
        const details = members[0][0];

        const values = {
            user_id: details.id,
            lead_id: details.church_id,
            type: 'C',
            reason: '',
            status: '1',
        }
        let sql4 = `SELECT * FROM tbl_leaders WHERE user_id = ${details.id} AND lead_id = ${details.church_id} AND type = 'C' AND status = '1'`;
        const check = await db.promise().query(sql4);
        if(check[0][0]){
            req.flash('errmsg', 'member has already been selected');
            res.redirect(`/${admin}/add_church_leader/${church_id}`);
        }else{
            let sql = 'INSERT INTO tbl_leaders SET ?';
            const result = await db.promise().query(sql, values);

            const tbl_login_values = {
                email: details.email,
                password: details.password,
                church_id: details.church_id,
                homecell_id: '0',
                level: 'C',
                status: '1',
            }
            let t_login = 'INSERT INTO tbl_login SET ?';
            const t_login_result = await db.promise().query(t_login, tbl_login_values);

            req.flash('sucmsg', 'member has been selected');
            res.redirect(`/${admin}/add_church_leader/${church_id}`);
        }
    } catch(e) {
        console.log(e);
    }
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
    let sql = 'SELECT * FROM homecells ORDER BY name';
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
module.exports.view_homecell = async (req, res) => {
    let id = req.params.id;

    let sql = 'SELECT * FROM homecells WHERE id = ?';
    const homecells = await db.promise().query(sql, id);

    let sql2 = 'SELECT * FROM members WHERE homecell_id = ? ORDER BY date DESC LIMIT 5';
    const members = await db.promise().query(sql2, id);

    let sql3 = "SELECT members.id, members.last_name, members.first_name, members.email, tbl_leaders.date FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND status = '1'";
    const homecell_leaders = await db.promise().query(sql3, id);

    var count_member = members[0].length;

    res.render(`${pages}/${admin}/view_homecell`, {
        title: `Homecell | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        members: members[0],
        homecells: homecells[0][0],
        count_member: count_member,
        homecell_leaders: homecell_leaders[0]
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
module.exports.add_homecell_leader = async (req, res) => {
    let id = req.params.id;

    let sql = "SELECT members.id, members.last_name, members.first_name, members.email, tbl_leaders.date FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND status = '1'";
    const homecell_leaders = await db.promise().query(sql, id);

    let sql3 = "SELECT * FROM members WHERE email != '' AND homecell_id = ? ORDER BY last_name";
    const members = await db.promise().query(sql3, id);
    
    res.render(`${pages}/${admin}/add_homecell_leader`, {
        title: `Assign Homecell Leader | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        members: members[0],
        member_homecell_id: id,
        errEmail: req.flash('errEmail'),
        errReason: req.flash('errReason'),
        errmsg: req.flash('errmsg'),
        sucmsg: req.flash('sucmsg'),
        sucdel: req.flash('sucdel'),
        homecell_leaders: homecell_leaders[0]
    });
}

module.exports.remove_homecell_leader_post = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            if(error.msg === 'Reason can\'t be empty'){
                req.flash('errReason', error.msg);
            }
        });

        let id = req.params.id;

        let sql = "SELECT members.id, members.last_name, members.first_name, members.email, tbl_leaders.date FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND status = '1'";
        const homecell_leaders = await db.promise().query(sql, id);

        let sql3 = "SELECT * FROM members WHERE email != '' AND homecell_id = ? ORDER BY last_name";
        const members = await db.promise().query(sql3, id);
        
        res.render(`${pages}/${admin}/add_homecell_leader`, {
            title: `Assign Homecell Leader | ${title}`, 
            layout: './layout/mainLayout',
            user: req.user,
            page: admin,
            members: members[0],
            member_homecell_id: id,
            errEmail: req.flash('errEmail'),
            errReason: req.flash('errReason'),
            errmsg: req.flash('errmsg'),
            sucmsg: req.flash('sucmsg'),
            sucdel: req.flash('sucdel'),
            homecell_leaders: homecell_leaders[0]
        });
        return;
    }

    try{
        var { leader_id, homecell_id, homecell_leader_email, reason } = req.body;
        
        let sql = `UPDATE tbl_leaders SET reason = ?, status = '0' WHERE user_id = ${leader_id} AND lead_id = ${homecell_id} AND type = 'H'`;
        const members = await db.promise().query(sql, reason);
        
        let sql2 = `DELETE FROM tbl_login WHERE email = '${homecell_leader_email}' AND homecell_id = ${homecell_id} AND level = 'L'`;
        const remove = await db.promise().query(sql2);

        req.flash('sucdel', 'homecell leader remove successfully');
        res.redirect(`/${admin}/add_homecell_leader/${homecell_id}`);
    } catch(e) {
        console.log(e);
    }
}

module.exports.add_homecell_leader_post = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            if(error.msg === 'Email can\'t be empty'){
                req.flash('errEmail', error.msg);
            }
        });

        let id = req.body.homecell_id;

        let sql = "SELECT members.id, members.last_name, members.first_name, members.email, tbl_leaders.date FROM members INNER JOIN tbl_leaders ON members.id = tbl_leaders.user_id WHERE tbl_leaders.lead_id = ? AND status = '1'";
        const homecell_leaders = await db.promise().query(sql, id);

        let sql3 = "SELECT * FROM members WHERE email != '' AND homecell_id = ? ORDER BY last_name";
        const members = await db.promise().query(sql3, id);

        res.render(`${pages}/${admin}/add_homecell_leader`, {
            title: `Assign Homecell Leader | ${title}`, 
            layout: './layout/mainLayout',
            user: req.user,
            page: admin,
            members: members[0],
            member_homecell_id: id,
            errEmail: req.flash('errEmail'),
            errReason: req.flash('errReason'),
            errmsg: req.flash('errmsg'),
            sucmsg: req.flash('sucmsg'),
            sucdel: req.flash('sucdel'),
            homecell_leaders: homecell_leaders[0]
        });
        return;
    }
    try{
        var { homecell_id, email } = req.body;
        
        let sql3 = `SELECT * FROM members WHERE email = ? AND homecell_id = ${homecell_id}`;
        const members = await db.promise().query(sql3, email);
        
        const details = members[0][0];

        const values = {
            user_id: details.id,
            lead_id: details.homecell_id,
            type: 'H',
            reason: '',
            status: '1',
        }
        let sql4 = `SELECT * FROM tbl_leaders WHERE user_id = ${details.id} AND lead_id = ${details.homecell_id} AND type = 'H' AND status = '1'`;
        const check = await db.promise().query(sql4);
        if(check[0][0]){
            req.flash('errmsg', 'member has already been selected');
            res.redirect(`/${admin}/add_homecell_leader/${homecell_id}`);
        }else{
            let sql = 'INSERT INTO tbl_leaders SET ?';
            const result = await db.promise().query(sql, values);

            const tbl_login_values = {
                email: details.email,
                password: details.password,
                church_id: 0,
                homecell_id: details.homecell_id,
                level: 'L',
                status: '1',
            }
            let t_login = 'INSERT INTO tbl_login SET ?';
            const t_login_result = await db.promise().query(t_login, tbl_login_values);

            req.flash('sucmsg', 'member has been selected');
            res.redirect(`/${admin}/add_homecell_leader/${homecell_id}`);
        }
    } catch(e) {
        console.log(e);
    }
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

// member
module.exports.member = async (req, res) => {
    let sql = 'SELECT * FROM members ORDER BY last_name';
    const result = await db.promise().query(sql);
    res.render(`${pages}/${admin}/members`, {
        title: `Members | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        success: req.flash('success'),
        members: result[0]
    });
}
module.exports.add_member = async (req, res) => {
    let sql = 'SELECT name FROM homecells ORDER BY name';
    const homecells = await db.promise().query(sql);

    let sql2 = 'SELECT name FROM homecells ORDER BY name';
    const churches = await db.promise().query(sql2);

    res.render(`${pages}/${admin}/add_member`, {
        title: `Add Homecell | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
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
        homecells: homecells[0],
        churches: churches[0]
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

        let sql = 'SELECT name FROM homecells ORDER BY name';
        const homecells = await db.promise().query(sql);

        let sql2 = 'SELECT name FROM homecells ORDER BY name';
        const churches = await db.promise().query(sql2);
        res.render(`${pages}/${admin}/add_member`, {
            title: `Add Homecell | ${title}`, 
            layout: './layout/mainLayout',
            user: req.user,
            page: admin,
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
            homecells: homecells[0],
            churches: churches[0]
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
        res.redirect(`/${admin}/member`);
    } catch(e) {
        console.log(e);
    }
}
module.exports.view_member = async (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM members WHERE id = ?';
    const result = await db.promise().query(sql, id);

    let homecell_id = result[0][0].homecell_id;
    let church_id = result[0][0].church_id;
    var result2 = '';
    var result3 = '';

    if(homecell_id != 0){
        let sql2 = 'SELECT name FROM homecells WHERE id = ?';
        var result2 = await db.promise().query(sql2, homecell_id);
        result2 = result2[0][0];
    }
    if(church_id != 0){
        let sql3 = 'SELECT name FROM churches WHERE id = ?';
        var result3 = await db.promise().query(sql3, church_id);
        result3 = result3[0][0];
    }


    res.render(`${pages}/${admin}/view`, {
        title: `Members | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin,
        members: result[0][0],
        homecell: result2,
        church: result3
    });
}














module.exports.admin_profile = (req, res) => {
    res.render(`${pages}/${admin}/profile`, {
        title: 'Profile Page',
        layout: './layout/mainLayout',
        user: req.user,
        page: admin
    });
}