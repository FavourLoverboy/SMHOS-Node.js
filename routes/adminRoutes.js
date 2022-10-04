const { Router } = require('express');
const authController = require('../controllers/adminControllers');
const controllingUserAccess = require('../middleware/controllingUserAccess');
const checkLogin = require('../middleware/checkLogin');

const router = Router();

const admin = process.env.ADMIN;

// admin
router.get(`/${admin}/dashboard`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.admin_dashboard));

router.get(`/${admin}/profile`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.admin_profile));

module.exports = router;