// dependencies
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');



router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);

router.post('/register', accountController.registerAccount);

// Process the login attempt
router.post("/login",(req, res) => {res.status(200).send('login process')});

module.exports = router;
