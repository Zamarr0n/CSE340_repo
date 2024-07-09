const pool = require("../database");


async function NewClass(new_classification){
    try {
      const sql = "INSERT INTO public.classification (new_classification) VALUES ($1) RETURNING *"
    return await pool.query(sql, [new_classification])
    } catch (error) {
    return error.message
    }
}

module.exports = {NewClass};











