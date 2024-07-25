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
        console.log("Password matched");
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

// Function to show the data from the user inside the form inputs 
invCont.Update = async (req,res) =>{
    const userId = parseInt(req.params.userId)
    const data = await accountModel.getAccountById(userId)
    const nav = await utilities.getNav();
    console.log("data");
    console.log(data);
    console.log(data.account_id);
    res.render("./account/accountUpdate", {
        title: "Update Information",
        nav,
        f_name:data.account_firstname,
        l_name:data.account_lastname,
        email_Address:data.account_email,
        userId:data.account_id,
        userIdPassword:data.account_id
    })
}

// Function to update the user completed
invCont.UpdateUser = async (req,res) => {
    const {f_name, l_name, email_Address, userId} = req.body
    const updateUser = await accountModel.UpdateUser(f_name, l_name, email_Address, userId)
    const nav = await utilities.getNav();
    if(updateUser){
        req.flash("notice", "The data of the user has been changed successfully :)")
        res.status(201).render("./account/login",{
            title: "Dont forget your email and password!!",
            nav
        })
    }else{
        req.flash("notice", "there was a problem in the proccess :( ")
        res.status(501).render("./account/login", {
            title: "Please try again",
            nav
        })
    }
}

invCont.PasswordView = async (req,res) => {
    const userId = parseInt(req.params.userId)
    console.log("user ID: ")
    console.log(userId);
    const data = await accountModel.getAccountById(userId)
    const nav = await utilities.getNav();
    res.render("./account/login", {
        title: "Password Successfully Uploaded",
        nav,
        userIdPassword:data.account_id
    })
}

invCont.UpdatePassword = async (req,res) => {
    const {password, userIdPassword}= req.body
    console.log('userIdPassword');
    console.log(userIdPassword);
    let hashedPassword = await bcrypt.hashSync(password, 10)
    const updatePassword = await accountModel.Update_Password(hashedPassword, userIdPassword);
    const nav = await utilities.getNav();
    if(updatePassword){
        req.flash("notice", "The password of the user has been changed successfully :)")
        res.status(201).render("./account/login",{
            title: "write down your password to not forget it",
            nav
        })
    }else{
        req.flash("notice", "there was a problem in the proccess :( ")
        res.status(501).render("./account/login", {
            title: "Please try again",
            nav
        })
    }
}

invCont.accountLogout = async (req,res) => {
    res.clearCookie('sessionId'); 
    res.sendStatus(200);
    res.render("/")
}
module.exports = invCont 


