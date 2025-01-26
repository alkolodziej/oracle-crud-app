const express = require('express');
const { fetchData } = require('../controllers/dataController');
const router = express.Router();

router.get('/test', fetchData);

module.exports = router;
