const { Pool } = require('pg');

const pool = new Pool();
module.exports = {
  query: async (text, params) => {
    try {
     return (await pool.query(text, params)).rows;
    } catch (err) {
      console.error('Error executing query', err.stack);
      return null;
    }
  }
};