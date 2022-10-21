const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/adminControllers');
const controllingUserAccess = require('../middleware/controllingUserAccess');
const checkLogin = require('../middleware/checkLogin');
const check = require('../middleware/check');

const router = Router();

const admin = process.env.ADMIN;

// admin
router.get(`/${admin}/dashboard`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.admin_dashboard));

// church
router.get(`/${admin}/church`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.church));

router.get(`/${admin}/add_church`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.add_church));
router.post(`/${admin}/add_church`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, [
    body('continent')
        .trim()
        .notEmpty().withMessage('Continent can\'t be empty')
        .bail()
        .toLowerCase(),
    body('country')
        .trim()
        .notEmpty().withMessage('Country can\'t be empty')
        .bail()
        .toLowerCase(),
    body('state')
        .trim()
        .notEmpty().withMessage('State can\'t be empty')
        .bail()
        .toLowerCase(),
    body('lga')
        .trim()
        .notEmpty().withMessage('LGA can\'t be empty')
        .bail()
        .toLowerCase(),
    body('name')
        .trim()
        .notEmpty().withMessage('Name can\'t be empty')
        .bail()
        .toLowerCase()
        .custom(async (name) => {
            const value = await check.findByChurchName(name);
            if(value){
                throw new Error('This church already exits');
            }
        })
], (authController.add_church_post));
router.get(`/${admin}/view_church/:id`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.view_church));

// homecell
router.get(`/${admin}/homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.homecell));

router.get(`/${admin}/add_homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.add_homecell));
router.post(`/${admin}/add_homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, [
    body('name')
        .trim()
        .notEmpty().withMessage('Name can\'t be empty')
        .bail()
        .toLowerCase()
        .custom(async (name) => {
            const value = await check.findByHomeCellName(name);
            if(value){
                throw new Error('Homecell already exits');
            }
        }),
    body('church')
        .trim()
        .notEmpty().withMessage('Church can\'t be empty')
        .bail()
        .toLowerCase(),
    body('address')
        .trim()
        .notEmpty().withMessage('Address can\'t be empty')
        .bail()
        .toLowerCase()
], (authController.add_homecell_post));

router.get(`/${admin}/profile`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.admin_profile));

// members
router.get(`/${admin}/member`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.member));
router.get(`/${admin}/add_member`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.add_member));
router.post(`/${admin}/add_member`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, [
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
router.get(`/${admin}/view/:id`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.view_member));

module.exports = router;