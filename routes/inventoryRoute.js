// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get the id and their data.
// Week03:
router.get("/detail/:carId", invController.getDetails)

module.exports = router;