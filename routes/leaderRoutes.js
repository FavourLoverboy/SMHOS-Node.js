const { Router } = require('express');
const authController = require('../controllers/leaderControllers');
const controllingUserAccess = require('../middleware/controllingUserAccess');
const checkLogin = require('../middleware/checkLogin');

const router = Router();

const leader = process.env.LEADER;

// leader
router.get(`/${leader}/dashboard`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.leader_dashboard));

router.get(`/${leader}/profile`, checkLogin.checkAuthenticated, controllingUserAccess.userAccess, (authController.leader_profile));

module.exports = router;