const { Router } = require('express');
const authController = require('../controllers/authControllers');

const router = Router();

// login
router.get('/', (authController.login_get));
router.get('/login', (authController.login_get));

module.exports = router;