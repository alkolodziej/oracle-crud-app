const express = require("express");

const {
  addPracownik,
  updatePracownik,
  deletePracownik,
  getTableData,
  getTables,
} = require("../controllers/dataController");
const {
  addDziecko,
  updateDziecko,
  deleteDziecko,
} = require("../controllers/dataController");
const {
  addPozyczka,
  updatePozyczka,
  deletePozyczka,
} = require("../controllers/dataController");
const {
  addRataPozyczki,
  updateRataPozyczki,
  deleteRataPozyczki,
} = require("../controllers/dataController");
const {
  addZyrant,
  updateZyrant,
  deleteZyrant,
} = require("../controllers/dataController");
const {
  addZapomoga,
  updateZapomoga,
  deleteZapomoga,
} = require("../controllers/dataController");
const {
  addWydarzenie,
  updateWydarzenie,
  deleteWydarzenie,
} = require("../controllers/dataController");
const {
  addDofinansowanie,
  updateDofinansowanie,
  deleteDofinansowanie,
} = require("../controllers/dataController");

const {
  addPracownicyFromFile,
  addDzieciFromFile,
  addPozyczkiFromFile,
  addRatPozyczkiFromFile,
  
  addZyranciFromFile,
  addZapomogiFromFile,
  addWydarzeniaFromFile,
  addDofinansowaniaFromFile,

  uploadFile,
} = require("../controllers/dataController");

const router = express.Router();

// Add new records
router.post("/addpracownik", addPracownik);
router.post("/adddziecko", addDziecko);
router.post("/addpozyczka", addPozyczka);
router.post("/addrata_pozyczki", addRataPozyczki);
router.post("/addzyrant", addZyrant);
router.post("/addzapomoga", addZapomoga);
router.post("/addwydarzenie", addWydarzenie);
router.post("/adddofinansowanie", addDofinansowanie);

// Add multiple records from file
router.post('/addpracownikfromfile', uploadFile, addPracownicyFromFile);
router.post("/adddzieckofromfile", uploadFile, addDzieciFromFile);
router.post("/addpozyczkafromfile", uploadFile, addPozyczkiFromFile);
router.post("/addrata_pozyczkifromfile" , uploadFile, addRatPozyczkiFromFile); // 
router.post("/addzyrantfromfile", uploadFile, addZyranciFromFile);
router.post("/addzapomogafromfile", uploadFile, addZapomogiFromFile);
router.post("/addwydarzeniefromfile", uploadFile, addWydarzeniaFromFile);
router.post("/adddofinansowaniefromfile", uploadFile, addDofinansowaniaFromFile); //

// Update records
router.post("/updatepracownik/:id", updatePracownik); // Added update endpoint
router.post("/updatedziecko/:id", updateDziecko); // Added update endpoint
router.post("/updatepozyczka/:id", updatePozyczka); // Added update endpoint
router.post("/updaterata_pozyczki/:id", updateRataPozyczki); // Added update endpoint
router.post("/updatezyrant/:id", updateZyrant); // Added update endpoint
router.post("/updatezapomoga/:id", updateZapomoga); // Added update endpoint
router.post("/updatewydarzenie/:id", updateWydarzenie); // Added update endpoint
router.post("/updatedofinansowanie/:id", updateDofinansowanie); // Added update endpoint

// Delete records
router.post("/deletepracownik/:id", deletePracownik);
router.post("/deletedziecko/:id", deleteDziecko);
router.post("/deletepozyczka/:id", deletePozyczka);
router.post("/deleterata_pozyczki/:id", deleteRataPozyczki);
router.post("/deletezyrant/:id", deleteZyrant);
router.post("/deletezapomoga/:id", deleteZapomoga);
router.post("/deletewydarzenie/:id", deleteWydarzenie);
router.post("/deletedofinansowanie/:id", deleteDofinansowanie);

router.get("/tables/:tableName", getTableData);
router.get("/tables", getTables);

module.exports = router;