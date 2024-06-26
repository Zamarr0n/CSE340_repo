const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name ")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
    const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
    )
    return data.rows
    } catch (error) {
    console.error("getclassificationsbyid error " + error)
    }
}

// **********************************
// Week03:
// querying all the details of the vehicle:
// **********************************
async function queryDetails(classification_id) {
  try{
    const details = await pool.query(
      `SELECT inv_make, inv_model,inv_description, 
      inv_year, inv_color, inv_miles, inv_thumbnail, inv_price
      FROM public.inventory 
      WHERE inv_id = $1`,
      [classification_id]
    )
    console.log(details.rows);
    return details.rows;
  } catch (error) {
    console.log("getDetails error " + error)
    
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, queryDetails};

