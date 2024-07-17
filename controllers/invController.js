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
    const classificationSelect = await utilities.buildClassificationList()
    res.render('./inventory/management' ,{
        title: 'Vehicle Management',
        nav,
        classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}





module.exports = invCont