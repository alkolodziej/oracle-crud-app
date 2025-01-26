const connectToDatabase = require('../config/db');

exports.fetchData = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    const result = await connection.execute('SELECT * FROM pracownik');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send('Error fetching data');
  } finally {
    await connection.close();
  }
};
