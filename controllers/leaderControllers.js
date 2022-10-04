require('dotenv').config();

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

module.exports.leader_profile = (req, res) => {
    res.render(`${pages}/${leader}/profile`, {
        title: 'Profile Page',
        layout: './layout/mainLayout',
        user: req.user,
        page: leader
    });
}
