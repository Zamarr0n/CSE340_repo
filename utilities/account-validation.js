const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")



const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
    body("f_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
    body("l_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

     // valid email is required and cannot already exist in the database
    body("email_Address")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
    throw new Error("Email exists. Please log in or use different email")
        }
    }),
      // password is required and must be strong password
    body("password")
        .trim()
        .notEmpty()
        .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

validate.loginRules = () => {
    return [
         // valid email is required and cannot already exist in the database
    body("email_Address")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
            console.log("Access");
        }
    }),
       // password is required and must be strong password
    body("password")
        .trim()
        .notEmpty()
        .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
    })
    return
    }
    next()
}

validate.checkLoginData = async (req, res, next) => {
    const { email_Address } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        errors,
        title: "Logged",
        nav,
        email_Address,
    })
    return
    }
    next()
}

module.exports = validate








