require('dotenv').config();

const pages = process.env.PAGES;
const church = process.env.CHURCH;
const title = process.env.TITLE;

// church
module.exports.church_dashboard = (req, res) => {
    res.render(`${pages}/${church}/dashboard`, {
        title: `Dashboard | ${title}`,
        layout: './layout/mainLayout',
        user: req.user,
        page: church
    });
}

module.exports.church_profile = (req, res) => {
    res.render(`${pages}/${church}/profile`, {
        title: 'Profile Page',
        layout: './layout/mainLayout',
        user: req.user,
        page: church
    });
}
