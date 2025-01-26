const oracledb = require('oracledb');
require('dotenv').config();

async function connectToDatabase() {
  try {
    return await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

module.exports = connectToDatabase;
