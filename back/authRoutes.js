const express = require('express');
const router = express.Router();
const { validateRegistration, validateLogin } = require('./middleware/validation');
const authController = require('./authController');

router.post('/registrar', validateRegistration, authController.registrar);
router.post('/login', validateLogin, authController.login);

module.exports = router;