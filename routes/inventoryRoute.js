// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");

// Send the user to the links view page
router.get("/",invController.buildmanagement);

router.post("/", invController.managementList);
// get inventory
router.get("/getInventory/:classification_id", invController.getInventoryJSON)
// Route to edit Items:
// router.get('/edit/:inventoryid',invController.editItem)

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