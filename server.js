/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const expressLayouts = require("express-ejs-layouts")
const app = express()
const static = require("./routes/static")



/* ***********************
 * Routes
 *************************/
app.use(static)
app.set("view engine", "ejs")
// this two lines of code are writer 
//to build up the webpage with the layout already done before
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
// Index Route
app.get("/", function(req,res){
  res.render("index", {title:"server"})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
