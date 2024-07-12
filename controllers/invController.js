const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const newItemsModel = require('../models/account-model');

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
const classification_id = req.params.classificationId
const data = await invModel.getInventoryByClassificationId(classification_id)
const grid = await utilities.buildClassificationGrid(data)
let nav = await utilities.getNav()
let className = "Unknown";
if (data && data.length) {
className = data[0].classification_name
}
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



invCont.newClass = async function (req, res) {
    let nav = await utilities.getNav()
    const { newClassification} = req.body

    // Calling the function made in the model of this new classification view.
    const regResult = await newItemsModel.NewClass(newClassification);
    if (regResult) {
        req.flash("notice",`Congratulations, the new Classification was added successfully`)
        res.status(201).render("./inventory/newClass", {
            title: "Add New Classification",
            nav,
        })
        } else {
        req.flash("notice", "Sorry, The new Classification fail.")
        res.status(501).render("./inventory/newClass", {
            title: "Add New Classification",
            nav,
        })
        }

}



invCont.NewCar = async function (req, res){
    let nav = await utilities.getNav()
    const {
        make,
        Model,
        Description,
        Image,
        Thumbnail,
        Price,
        Year, 
        Miles,
        Color,
        classification
    } = req.body

    const results = await newItemsModel.NewCar(
        make,
        Model,
        Description,
        Image,
        Thumbnail,
        Price,
        Year, 
        Miles,
        Color, 
        classification
    )
    if (results) {
        req.flash("notice",`Congratulations, The process went successfully :) `)
        res.status(201).render("./inventory/newCar", {
            title: "Add a New Car ",
            nav,
        })
        } else {
        req.flash("notice", "Sorry, there was a problem adding the new car :( .")
        res.status(501).render("./inventory/newCar", {
            title: "Add a New Car",
            nav,
        })
        }
}

module.exports = invCont