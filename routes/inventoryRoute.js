// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");


// Send the user to the links view page
router.get("/",invController.buildmanagement);


router.get("/delete/:inv_id", invController.deleteView);


router.post("/deleteItem", invController.deleteItem);
// router.post("/", invController.managementList);

// get inventory
router.get("/getInventory/:classification_id",  utilities.handleErrors(invController.getInventoryJSON))


// Route to edit Items:
router.get('/edit/:inv_id',invController.editInventoryView)
// match the link of the update form.
router.post("/update/", invController.updateInventory)

// Send the user to the new classification view page
router.get("/NewClassification", invController.buildNewClassification);
// Obtaining the user inputs from the form "Post"
router.post("/NewClassification", invController.newClass);

// Send the user to the new vehicle view page 
router.get("/NewVehicle", invController.buildNewCar);
// Obtaining the user inputs from the form "Post"
router.post("/NewVehicle", invController.NewCar)



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get the id and their data.
// Week03:
router.get("/detail/:carId", invController.getDetails)



module.exports = router;