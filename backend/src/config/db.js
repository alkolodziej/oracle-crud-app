const oracledb = require('oracledb');
require('dotenv').config();

async function connectToDatabase() {
  try {
    return await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      outFormat: oracledb.OUT_FORMAT_OBJECT // Automatyczne mapowanie CLOB na string

    });
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

exports.getLastId = async (tableName) => {
  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(`SELECT MAX(id) AS last_id FROM SYSTEM.${tableName}`);
    return result.rows[0]?.LAST_ID || 0;
  } catch (error) {
    console.error('Error fetching last ID:', error.message);
    throw error;
  } finally {
    await connection.close();
  }
};

module.exports = connectToDatabase;
