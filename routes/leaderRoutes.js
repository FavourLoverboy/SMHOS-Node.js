const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/leaderControllers');
const controllingUserAccess = require('../middleware/controllingUserAccess');
const checkLogin = require('../middleware/checkLogin');
const check = require('../middleware/check');

const router = Router();

const leader = process.env.LEADER;

// leader
router.get(`/${leader}/dashboard`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.leader_dashboard));

// members
router.get(`/${leader}/member`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.member));
router.get(`/${leader}/add_member`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.add_member));
router.post(`/${leader}/add_member`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, [
    body('lname')
        .trim()
        .notEmpty().withMessage('Last Name can\'t be empty')
        .bail()
        .toLowerCase(),
    body('fname')
        .trim()
        .notEmpty().withMessage('First Name can\'t be empty')
        .bail()
        .toLowerCase(),
    body('other')
        .trim()
        .toLowerCase(),
    body('email')
        .trim()
        .toLowerCase()
        .custom(async (email) => {
            const value = await check.findByMemberEmail(email);
            if(value){
                throw new Error('Email already exits');
            }
        }),
    body('number')
        .trim(),
    body('lga')
        .trim()
        .notEmpty().withMessage('LGA can\'t be empty')
        .bail()
        .toLowerCase(),
    body('state')
        .trim()
        .notEmpty().withMessage('State can\'t be empty')
        .bail()
        .toLowerCase(),
    body('country')
        .trim()
        .notEmpty().withMessage('Country can\'t be empty')
        .bail()
        .toLowerCase(),
    body('continent')
        .trim()
        .notEmpty().withMessage('Continent can\'t be empty')
        .bail()
        .toLowerCase(),
    body('sex')
        .trim()
        .notEmpty().withMessage('Sex can\'t be empty')
        .bail()
        .toLowerCase(),
    body('marital_status')
        .trim()
        .notEmpty().withMessage('Marital Status can\'t be empty')
        .bail()
        .toLowerCase(),
    body('dob')
        .notEmpty().withMessage('DOB can\'t be empty')
        .bail(),
    body('address')
        .trim()
        .notEmpty().withMessage('Address can\'t be empty')
        .bail()
        .toLowerCase(),
    body('homecell')
        .trim()
        .toLowerCase(),
    body('church')
        .trim()
        .toLowerCase()
], (authController.add_member_post));


router.get(`/${leader}/profile`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.leader_profile));

module.exports = router;