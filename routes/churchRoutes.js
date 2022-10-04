const { Router } = require('express');
const authController = require('../controllers/churchControllers');
const controllingUserAccess = require('../middleware/controllingUserAccess');
const checkLogin = require('../middleware/checkLogin');

const router = Router();

const church = process.env.CHURCH;

// church
router.get(`/${church}/dashboard`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.church_dashboard));

router.get(`/${church}/profile`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.church_profile));

module.exports = router;