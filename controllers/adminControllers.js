require('dotenv').config();

const pages = process.env.PAGES;
const admin = process.env.ADMIN;
const title = process.env.TITLE;

// admin
module.exports.admin_dashboard = (req, res) => {
    res.render(`${pages}/${admin}/Dashboard`, {
        title: `Dashboard | ${title}`, 
        layout: './layout/mainLayout',
        user: req.user,
        page: admin
    });
}