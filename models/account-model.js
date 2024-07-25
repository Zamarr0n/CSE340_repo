const { user } = require("pg/lib/defaults");
const pool = require("../database");


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
    return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
    } catch (error) {
    return error.message
    }
}

// Function to add a new class to the navbar.

async function NewClass(new_classification){
    try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [ new_classification ])
    } catch (error) {
    return error.message
    }
}

// FUNCTION TO ADD NEW CAR TO THE NEW CLASSIFICATION
async function NewCar( Make, Model, Description, Image,Thumbnail, Price, Year, Miles, Color, Classification ){
    try{
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query( sql, [ Make, Model, Year, Description, Image, Thumbnail, Price, Miles, Color,Classification])
    } catch(err){
        return err.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
    try {
        const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1'
    const result = await pool.query(sql ,[account_email])
    return result.rows[0]
    } catch (error) {
        throw new Error("No matching email found")
    }
}

async function getAccountById (account_id) {
    try {
        const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1'
    const result = await pool.query(sql ,[account_id])
    return result.rows[0]
    } catch (error) {
        throw new Error("No matching userId found")
    }
}

async function UpdateUser(f_name, l_name, email_Address, Id) {
    try{
        const sql = 'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *'
        return await pool.query(sql, [f_name, l_name, email_Address, Id])
    } catch (err){
        return err.message
    }
}
async function Update_Password(password, user_id) {
    try{
        const sql = 'UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *'
        return await pool.query(sql, [password, user_id])
    } catch(err){
        err.message
    }
}

module.exports = {registerAccount, checkExistingEmail, NewClass, NewCar, getAccountByEmail, getAccountById, UpdateUser, Update_Password};




