const { Router } = require('express');
const authController = require('../controllers/memberControllers');
const checkLogin = require('./checkLogin');

const router = Router();

const member = process.env.MEMBER;

// member
router.get(`/${member}/dashboard`, checkLogin.checkAuthenticated, (authController.member_dashboard));

module.exports = router;