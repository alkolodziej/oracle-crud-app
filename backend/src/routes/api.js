const express = require('express');
const { 
  addPracownik, 
  updatePracownik, 
  deletePracownik 
} = require('../controllers/dataController');
const { 
  addDziecko, 
  updateDziecko, 
  deleteDziecko 
} = require('../controllers/dataController');
const { 
  addPozyczka, 
  updatePozyczka, 
  deletePozyczka 
} = require('../controllers/dataController');
const { 
  addRataPozyczki, 
  updateRataPozyczki, 
  deleteRataPozyczki 
} = require('../controllers/dataController');
const { 
  addZyrant, 
  updateZyrant, 
  deleteZyrant 
} = require('../controllers/dataController');
const { 
  addZapomoga, 
  updateZapomoga, 
  deleteZapomoga 
} = require('../controllers/dataController');
const { 
  addWydarzenie, 
  updateWydarzenie, 
  deleteWydarzenie 
} = require('../controllers/dataController');
const { 
  addDofinansowanie, 
  updateDofinansowanie, 
  deleteDofinansowanie 
} = require('../controllers/dataController');

const { 
  addPracownicyFromFile, 
  addDzieciFromFile, 
  addPozyczkiFromFile, 
  addRatPozyczkiFromFile, 
  addZyranciFromFile, 
  addZapomogiFromFile, 
  addWydarzeniaFromFile, 
  addDofinansowaniaFromFile 
} = require('../controllers/dataController');

const router = express.Router();

// Add new records
router.post('/addpracownik', addPracownik);
router.post('/adddziecko', addDziecko);
router.post('/addpozyczka', addPozyczka);
router.post('/addratapozyczki', addRataPozyczki);
router.post('/addzyrant', addZyrant);
router.post('/addzapomoga', addZapomoga);
router.post('/addwydarzenie', addWydarzenie);
router.post('/adddofinansowanie', addDofinansowanie);

// Add multiple records from file
router.post('/addpracownicy', addPracownicyFromFile);
router.post('/adddzieci', addDzieciFromFile);
router.post('/addpozyczki', addPozyczkiFromFile);
router.post('/addratypozyczki', addRatPozyczkiFromFile);
router.post('/addzyranci', addZyranciFromFile);
router.post('/addzapomogi', addZapomogiFromFile);
router.post('/addwydarzenia', addWydarzeniaFromFile);
router.post('/adddofinansowania', addDofinansowaniaFromFile);

// Update records
router.put('/updatepracownik/:id', updatePracownik);  // Added update endpoint
router.put('/updatedziecko/:id', updateDziecko);     // Added update endpoint
router.put('/updatepozyczka/:id', updatePozyczka);   // Added update endpoint
router.put('/updateratapozyczki/:id', updateRataPozyczki);  // Added update endpoint
router.put('/updatezyrant/:id', updateZyrant);  // Added update endpoint
router.put('/updatezapomoga/:id', updateZapomoga);  // Added update endpoint
router.put('/updatewydarzenie/:id', updateWydarzenie);  // Added update endpoint
router.put('/updatedofinansowanie/:id', updateDofinansowanie);  // Added update endpoint

// Delete records
router.delete('/deletepracownik/:id', deletePracownik);
router.delete('/deletedziecko/:id', deleteDziecko);
router.delete('/deletepozyczka/:id', deletePozyczka);
router.delete('/deleteratapozyczki/:id', deleteRataPozyczki);
router.delete('/deletezyrant/:id', deleteZyrant);
router.delete('/deletezapomoga/:id', deleteZapomoga);
router.delete('/deletewydarzenie/:id', deleteWydarzenie);
router.delete('/deletedofinansowanie/:id', deleteDofinansowanie);

module.exports = router;