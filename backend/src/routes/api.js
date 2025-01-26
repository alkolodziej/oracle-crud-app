const express = require('express');
const { addPracownik } = require('../controllers/dataController');
const { addDziecko } = require('../controllers/dataController');
const { addPozyczka } = require('../controllers/dataController');
const { addRataPozyczki } = require('../controllers/dataController');
const { addZyrant} = require('../controllers/dataController');
const { addZapomoga} = require('../controllers/dataController');
const { addWydarzenie} = require('../controllers/dataController');
const { addDofinansowanie} = require('../controllers/dataController');

const { addPracownicyFromFile } = require('../controllers/dataController');
const { addDzieciFromFile} = require('../controllers/dataController');
const { addPozyczkiFromFile } = require('../controllers/dataController');
const { addRatPozyczkiFromFile } = require('../controllers/dataController');
const { addZyranciFromFile } = require('../controllers/dataController');
const { addZapomogiFromFile } = require('../controllers/dataController');
const { addWydarzeniaFromFile } = require('../controllers/dataController');
const { addDofinansowaniaFromFile } = require('../controllers/dataController');

const router = express.Router();

router.post('/pracownik', addPracownik);
router.post('/dziecko', addDziecko);
router.post('/pozyczka', addPozyczka);
router.post('/ratapozyczki', addRataPozyczki);
router.post('/zyrant', addZyrant);
router.post('/zapomoga', addZapomoga);
router.post('/wydarzenie', addWydarzenie);
router.post('/dofinansowanie', addDofinansowanie);

router.post('/pracownicy', addPracownicyFromFile);
router.post('/dzieci', addDzieciFromFile);
router.post('/pozyczki', addPozyczkiFromFile);
router.post('/ratypozyczki', addRatPozyczkiFromFile);
router.post('/zyranci', addZyranciFromFile);
router.post('/zapomogi', addZapomogiFromFile);
router.post('/wydarzenia', addWydarzeniaFromFile);
router.post('/dofinansowania', addDofinansowaniaFromFile);

module.exports = router;