// dependencies
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')
const utilities = require('../utilities/index')

router.get("/management",utilities.checkLogin, utilities.handleErrors(accountController.loggedin));
// utilities.checkLogin,
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);

router.post("/register", regValidate.registationRules(), regValidate.checkRegData, accountController.registerAccount)

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    accountController.accountLogin
)


module.exports = router;
