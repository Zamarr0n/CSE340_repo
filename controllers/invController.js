const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const newItemsModel = require('../models/account-model');
const inv_model = require('../models/inventory-model')
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

invCont.buildmanagement = async function (req,res) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render('./inventory/management' ,{
            title: 'Vehicle Management',
            nav,
            classificationSelect,
        })
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
    console.log(classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    console.log(invData)
    if (invData[0].inv_id) {
        console.log('inside if statement')
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
    console.log(inv_id)
    let nav = await utilities.getNav()
    // query details
    const itemData = await invModel.queryDetails(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        make: itemData[0].inv_make,
        Model: itemData[0].inv_model,
        Description: itemData[0].inv_description,
        Year: itemData[0].inv_year,
        Image: itemData[0].inv_image,
        Thumbnail: itemData[0].inv_thumbnail,
        Price: itemData[0].inv_price,
        Miles: itemData[0].inv_miles,
        Color: itemData[0].inv_color,
        classification: itemData[0].classification_id,
        inv_id: itemData[0].inv_id
    })
}

/* ***************************
 *  Checking the new Data 
 * ************************** */
invCont.checkUpdateData = async function (req, res){
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
        classification,
        inv_id
    } = req.body
    console.log(req.body);
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
        classification,
        inv_id
    )
    if (results) {
        req.flash("notice",`Congratulations, The process went successfully :) `)
        res.status(201).render("./inventory/edit-inventory", {
            title: " The process went successfully :) ",
            nav,
        })
        } else {
        req.flash("notice", "Sorry, there was a problem editing the new car :( .")
        res.status(501).render("./inventory/edit-inventory", {
            title: "there was a problem editing the new car :(",
            nav,
        })
        }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
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
    console.log("updateInventory:")
    console.log(req.body);
    const updateResult = await invModel.updateInventory(
        inv_id,
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
    if (updateResult) {
        const itemName = updateResult.make + " " + updateResult.Model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification)
        const itemName = `${make} ${Model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        message,
        inv_id,
        make,
        Model,
        Year,
        Description,
        Image,
        Thumbnail,
        Price,
        Miles,
        Color,
        classification
        })
    }
}


invCont.deleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.queryDetails(inv_id)
    console.log('itemdata:')
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        make: itemData[0].inv_make,
        Model: itemData[0].inv_model,
        Price: itemData[0].inv_price,
        Year: itemData[0].inv_year,
        inv_id: itemData[0].inv_id
    })
}


invCont.deleteItem = async (req,res,next) => {
    const inv_id = parseInt(req.body.inv_id);
    console.log(inv_id);
    let nav = await utilities.getNav()
    const deleteResult = await invModel.deleteInventoryItem(inv_id);
    console.log(deleteResult);
    if(deleteResult){
        req.flash("notice", "The deletion was successful");
        res.redirect('/inv/');
    } else {
        req.flash("notice","Sorry the delete fail");
        res.redirect("/inv/delete/inv_id")
    }
}




module.exports = invCont