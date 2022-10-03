const { Router } = require('express');
const authController = require('../controllers/adminControllers');
const checkLogin = require('./checkLogin');

const router = Router();

const admin = process.env.ADMIN;

// admin
router.get(`/${admin}/dashboard`, checkLogin.checkAuthenticated, (authController.admin_dashboard));

module.exports = router;