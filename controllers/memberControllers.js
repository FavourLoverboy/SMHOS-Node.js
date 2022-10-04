require('dotenv').config();

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
