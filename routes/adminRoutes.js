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
        .toUpperCase(),
    body('country')
        .trim()
        .notEmpty().withMessage('Country can\'t be empty')
        .bail()
        .toUpperCase(),
    body('state')
        .trim()
        .notEmpty().withMessage('State can\'t be empty')
        .bail()
        .toUpperCase(),
    body('lga')
        .trim()
        .notEmpty().withMessage('LGA can\'t be empty')
        .bail()
        .toUpperCase(),
    body('name')
        .trim()
        .notEmpty().withMessage('Name can\'t be empty')
        .bail()
        .toUpperCase()
        .custom(async (name) => {
            const value = await check.findByChurchName(name);
            if(value){
                throw new Error('This church already exits');
            }
        })
], (authController.add_church_post));

// homecell
router.get(`/${admin}/homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.homecell));

router.get(`/${admin}/add_homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.add_homecell));
router.post(`/${admin}/add_homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, [
    body('name')
        .trim()
        .notEmpty().withMessage('Name can\'t be empty')
        .bail()
        .toUpperCase()
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
        .toUpperCase(),
    body('address')
        .trim()
        .notEmpty().withMessage('Address can\'t be empty')
        .bail()
        .toUpperCase()
], (authController.add_homecell_post));

router.get(`/${admin}/profile`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.admin_profile));

module.exports = router;