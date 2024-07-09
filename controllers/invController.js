const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
const classification_id = req.params.classificationId
const data = await invModel.getInventoryByClassificationId(classification_id)
const grid = await utilities.buildClassificationGrid(data)
let nav = await utilities.getNav()
const className = data[0].classification_name
res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
})
}


// **********************************
// Week03:
// Getting data function 
// **********************************

invCont.getDetails = async function (req, res, next) {
    const car_id = req.params.carId
const data = await invModel.queryDetails(car_id)
const grid = await utilities.buildDetails(data)
let nav = await utilities.getNav()
    res.render("./detail/details",{
        title: null,
        nav,
        grid,
    })
}

invCont.buildmanagement = async function(req,res){
    const nav = await utilities.getNav()
    res.render('./inventory/management' ,{
        title: 'Vehicle Management',
        nav,
    })
}

invCont.buildNewClassification = async function (req,res) {
    const nav = await utilities.getNav()
    res.render('./inventory/newClass' , {
        title: 'Add New Classification',
        nav
    })
}
invCont.buildNewCar = async function (req,res) {
    const nav = await utilities.getNav()
    res.render('./inventory/newCar' ,{
        title: 'Add New Car',
        nav
    })
}

module.exports = invCont