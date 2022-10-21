const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/churchControllers');
const controllingUserAccess = require('../middleware/controllingUserAccess');
const checkLogin = require('../middleware/checkLogin');
const check = require('../middleware/check');

const router = Router();

const church = process.env.CHURCH;

// church
router.get(`/${church}/dashboard`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.church_dashboard));

// homecell
router.get(`/${church}/homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.homecell));

router.get(`/${church}/add_homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.add_homecell));
router.post(`/${church}/add_homecell`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, [
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
    body('address')
        .trim()
        .notEmpty().withMessage('Address can\'t be empty')
        .bail()
        .toLowerCase()
], (authController.add_homecell_post));
router.get(`/${church}/view_homecell/:id`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.view_homecell));

router.get(`/${church}/profile`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.church_profile));

module.exports = router;