// dependencies
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')
const utilities = require('../utilities/index')
var cookieParser = require('cookie-parser')

router.get("/management",utilities.checkLogin, utilities.handleErrors(accountController.loggedin));

// utilities.checkLogin,
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, accountController.registerAccount)

router.get("/update/:userId", accountController.Update)

router.post("/updateuser", accountController.UpdateUser)

router.post("/password", accountController.UpdatePassword);
// accountController.UpdatePassword
// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    accountController.accountLogin
)
router.post("/logout", (req,res) => {
    res.clearCookie('sessionId', { path: '/' }); 
    res.clearCookie('jwt', { path: '/' }); 
    res.sendStatus(200);
    res.render("/");
})

module.exports = router;
