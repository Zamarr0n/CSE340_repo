// dependencies
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')


router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);

router.post(
    "/login",
    (req, res) => {
    res.status(200).send('login process')
    }
)

// Process the login attempt
router.post("/login", accountController.accountLogin);

module.exports = router;
