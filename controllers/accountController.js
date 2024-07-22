const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()
var cookieParser = require('cookie-parser')

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

invCont.loggedin = async function (req,res) {
    let nav = await utilities.getNav()
    const account = accountModel.getAccountByEmail()
    res.render("./account/management",{
        title: "Account Management",
        nav,
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
invCont.accountLogin = async function (req, res) {
    let nav = await utilities.getNav()
    const { email_Address, password } = req.body
    const accountData = await accountModel.getAccountByEmail(email_Address)
    // console.log(accountData.account_firstname);
    console.log(req.cookies)
    console.log(req.signedCookies)
    if (email_Address == ' ' & !accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        email_Address,
    })
    return
}
    
    try {
    if (await bcrypt.compare(password, accountData.account_password)) {
        delete accountData.account_password
    // here is where froze again
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
        
    // here is where froze again
    if(process.env.NODE_ENV === 'development') {
       res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    // console.log("signed cookies: " + req.signedCookies);
    return res.redirect("/account/management")
    }else{
        console.log('else statement');
        req.flash("notice", "Please check your password and try again.")
        res.status(400).render("./account/login", {
        title: "Login",
        nav,
        errors: null,
        email_Address,
        password,
    })
    }
    } catch (error) {
        throw Error('Access Forbidden')
    }
}
// Account I´m using:
// zamaemi@gmail.com
// G7f@w8kL1z#2




module.exports = invCont 


