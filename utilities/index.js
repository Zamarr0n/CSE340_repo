const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* 
************************
* Constructs the nav HTML unordered list
************************** 

*/
Util.getNav = async function (req, res, next) {
let data = await invModel.getClassifications()
let list = "<ul>"
list += '<li><a href="/" title="Home page">Home</a></li>'
data.rows.forEach((row) => {
    list += "<li>"
    list +=
    '<a href="/inv/type/' +
    row.classification_id +
    '" title="See our inventory of ' +
    row.classification_name +
    ' vehicles">' +
    row.classification_name +
    "</a>"
    list += "</li>"
})
list += "</ul>"
return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
    grid = '<ul id="inv-display" class="inv-cards">'
    data.forEach(vehicle => { 
        grid += `<div class="inv-align">`
        grid += '<li>'
        grid +=`<div class="img-div">`
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img class="car-img" src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += `</div>`
        // grid += '<div class="namePrice">'
        grid += '<hr class = "rule" />'
        grid += '<h2 class="text-center">'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span class ="price">$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
        // grid += `</div>`
    })
    grid += '</ul>'
    } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

// **********************************
// WEEK 3:
// Displaying the data of the car for the user (View).
// **********************************

Util.buildDetails = async function(data){
    // const datajson = JSON.parse(data);
    // --------------------------------------
    let grid
    if(data.length > 0){
    grid += '<div class="flex-div">'
    data.forEach(vehicle => { 
        grid += `<div class="image-div">`
        grid += `<h1 class="detail-title"> ${vehicle.inv_year}   ${vehicle.inv_make}  ${vehicle.inv_model} </h1>`
        grid += `<div class="">`
        grid += `<img class="detail-img" src = ${vehicle.inv_thumbnail} alt= ${vehicle.inv_make}+ ' ' + ${vehicle.inv_model} >`
        grid += `</div>`
        grid += `</div>`
        grid += `<div class="description-div">`
        grid += `<h3 class="detail-subtitle description-text"> ${vehicle.inv_model} ${vehicle.inv_make} Details </h3>`
        grid += `<div class="gray">`
        grid += `<b class="description-text"> Price: $${vehicle.inv_price}</b>`
        grid+= `</div>`
        grid+= `<div class="description">`
        grid += `<p class="description-text">  Description:   ${vehicle.inv_description} </p>`
        grid+= `</div>`
        grid += `<div class="gray">`
        grid += `<p class=" description-text"> Color: ${vehicle.inv_color} </p>`
        grid+= `</div>`
        grid += `<div class="gray">`
        grid += `<p class="description-text"> Miles:  ${vehicle.inv_miles} </p>`
        grid+= `</div>`
        grid += `</div>`
    })
    grid += '</div>'
    }else{ 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
    jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
    if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
    })
    } else {
    next()
    }
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}


Util.buildClassificationList = async () => {
    const data = await invModel.getClassifications();
    let grid
    grid += '<select id="classificationList">'
    grid += '<option value="none" > -- Select a classification -- </option>'
    data.rows.forEach(vehicle => {
        grid +=`<option value= ${vehicle.classification_id}> 
        ${vehicle.classification_name} 
        </option>`
    })
    grid += '</select>'
    return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



module.exports = Util