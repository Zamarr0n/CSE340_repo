const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const invCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
invCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login",{
    title: "Login",
    nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
invCont.buildRegister = async function (req,res,next){
    let nav = await utilities.getNav()
    res.render("./account/register",{
        title: "Register",
        nav,
        errors: null,
    })
}




/* ****************************************
*  Process Registration
* *************************************** */
invCont.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { f_name, l_name, email_Address, password } = req.body

    // Hash the password before storing
let hashedPassword;
try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(password, 10)
} catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("./account/register", {
    title: "Registration",
    nav,
    errors: null,
    })
}

    const regResult = await accountModel.registerAccount(
        f_name, 
        l_name, 
        email_Address,
        hashedPassword
    )

    if (regResult) {
    req.flash("notice",`Congratulations, you\'re registered ${f_name}. Please log in.`)
    res.status(201).render("./account/login", {
        title: "Login",
        nav,
    })
    } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./account/register", {
        title: "Registration",
        nav,
    })
    }
}



// valid email is required and cannot already exist in the database
// body("account_email")
//   .trim()
//   .isEmail()
//   .normalizeEmail() // refer to validator.js docs
//   .withMessage("A valid email is required.")
//   .custom(async (account_email) => {
//     const emailExists = await accountModel.checkExistingEmail(account_email)
//     if (emailExists){
//     throw new Error("Email exists. Please log in or use different email")
//     }
// }),

invCont.loggedin = async function (req,res) {
    let nav = await utilities.getNav()
    res.render("./account/accountmanagement",{
        title: "You're logged in",
        nav,
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
invCont.accountLogin = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
    })
    return
    }
    try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    if(process.env.NODE_ENV === 'development') {
       res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    return res.redirect("/account/")
    }
    } catch (error) {
    return new Error('Access Forbidden')
    }
}


module.exports = invCont 


