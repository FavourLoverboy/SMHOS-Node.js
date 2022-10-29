const { Router } = require('express');
const authController = require('../controllers/memberControllers');
const controllingUserAccess = require('../middleware/controllingUserAccess');
const checkLogin = require('../middleware/checkLogin');

const router = Router();

const member = process.env.MEMBER;

// member
router.get(`/${member}/dashboard`, checkLogin.checkAuthenticated, (authController.member_dashboard));

router.get(`/${member}/profile`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.member_profile));

module.exports = router;