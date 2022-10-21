const db = require('../config/db');

const findByChurchName = async (name) => {
    let sql = 'SELECT * FROM churches WHERE name = ?';
    const result = await db.promise().query(sql, name);
    return result[0][0];
}

const findByHomeCellName = async (name) => {
    let sql = 'SELECT * FROM homecells WHERE name = ?';
    const result = await db.promise().query(sql, name);
    return result[0][0];
}
const findByMemberEmail = async (email) => {
    let sql = 'SELECT * FROM members WHERE email = ?';
    const result = await db.promise().query(sql, email);
    return result[0][0];
}

module.exports = {
    findByChurchName,
    findByHomeCellName,
    findByMemberEmail
}