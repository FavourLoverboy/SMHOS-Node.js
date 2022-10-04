const { Router } = require('express');
const authController = require('../controllers/authControllers');
const checkLogin = require('../middleware/checkLogin');
const { body } = require('express-validator');

const router = Router();

// Check user level
router.get('/check', checkLogin.checkAuthenticated, (authController.check));

// login
router.get('/', checkLogin.checkNotAuthenticated, (authController.login_get));
router.get('/login', checkLogin.checkNotAuthenticated, (authController.login_get));
router.post('/', [
    body('email')
    .trim()
    .isEmail().withMessage('Must be a valid email')
    .bail()
    .normalizeEmail()
    .toLowerCase(),
    body('password')
    .trim()
    .notEmpty().withMessage('password can not be empty')
    .bail()
    .isLength({ min: 2, max: 5 }).withMessage('Password must be more than 2 characters')
], (authController.login_post));


module.exports = router;