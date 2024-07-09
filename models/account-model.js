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


module.exports = {registerAccount, checkExistingEmail, NewClass, NewCar};




