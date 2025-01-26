const connectToDatabase = require('../config/db');

exports.addPracownik = async (req, res) => {
  const { nazwa, numer_konta, email, telefon, adres } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `INSERT INTO SYSTEM.PRACOWNIK (nazwa, numer_konta, email, telefon, adres)
       VALUES (:nazwa, :numer_konta, :email, :telefon, :adres)`,
      [nazwa, numer_konta, email, telefon, adres],
      { autoCommit: true }
    );

    res.status(201).send('Pracownik dodany do bazy');
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Błąd podczas dodawania danych do bazy');
  } finally {
    await connection.close();
  }
};

exports.addDziecko = async (req, res) => {
  const { nazwa, pracownik_id } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `INSERT INTO SYSTEM.DZIECKO (nazwa, pracownik_id)
       VALUES (:nazwa, :pracownik_id)`,
      [nazwa, pracownik_id],
      { autoCommit: true }
    );

    res.status(201).send('Dziecko dodane do bazy');
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Błąd podczas dodawania danych do bazy');
  } finally {
    await connection.close();
  }
};

exports.addPozyczka = async (req, res) => {
  const { rodzaj, wysokosc, pracownik_id } = req.body;

  // Walidacja pola 'rodzaj'
  if (rodzaj !== 0 && rodzaj !== 1) {
    return res.status(400).send('Niepoprawny rodzaj pożyczki. Dozwolone wartości to 0 (konsumpcyjna) lub 1(na zakup mieszkania).');
  }

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `INSERT INTO SYSTEM.POZYCZKA (rodzaj, wysokosc, pracownik_id)
       VALUES (:rodzaj, :wysokosc, :pracownik_id)`,
      [rodzaj, wysokosc, pracownik_id],
      { autoCommit: true }
    );

    res.status(201).send('Pożyczka dodana do bazy');
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Błąd podczas dodawania danych do bazy');
  } finally {
    await connection.close();
  }
};

exports.addRataPozyczki = async (req, res) => {
  const { wysokosc, oplacona, termin_platnosci, pozyczka_id } = req.body;

  if (oplacona !== 0 && oplacona !== 1) {
    return res.status(400).send('Niepoprawny oplacona rata pożyczki. Dozwolone wartości to 0 (nieoplacona) lub 1 (oplacona).');
  }

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `INSERT INTO SYSTEM.RATA_POZYCZKI (wysokosc, oplacona, termin_platnosci, pozyczka_id)
       VALUES (:wysokosc, :oplacona, :termin_platnosci, :pozyczka_id)`,
      [wysokosc, oplacona, termin_platnosci, pozyczka_id],
      { autoCommit: true }
    );

    res.status(201).send('Rata pożyczki dodana do bazy');
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Błąd podczas dodawania danych do bazy');
  } finally {
    await connection.close();
  }
};


exports.addZyrant = async (req, res) => {
  const { pozyczka_id, pracownik_id } = req.body;

  const connection = await connectToDatabase();
  try {
    // Sprawdzanie, czy rekord z pozyczka_id istnieje w tabeli POZYCZKA
    const result = await connection.execute(
      `SELECT COUNT(*) AS count FROM SYSTEM.POZYCZKA WHERE id = :pozyczka_id`,
      [pozyczka_id]
    );

    const count = result.rows[0].COUNT;
    if (count === 0) {
      return res.status(400).send('Rekord pozyczki o podanym ID nie istnieje w tabeli POZYCZKA');
    }

    // Jeśli rekord pozyczki istnieje, dodaj zyranta
    await connection.execute(
      `INSERT INTO SYSTEM.ZYRANT (pozyczka_id, pracownik_id)
       VALUES (:pozyczka_id, :pracownik_id)`,
      [pozyczka_id, pracownik_id],
      { autoCommit: true }
    );

    res.status(201).send('Zyrant dodana do bazy');
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Błąd podczas dodawania danych do bazy');
  } finally {
    await connection.close();
  }
};

exports.addZapomoga = async (req, res) => {
  const { cel, wysokosc, pracownik_id } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `INSERT INTO SYSTEM.ZAPOMOGA (cel, wysokosc, pracownik_id)
       VALUES (:cel, :wysokosc, :pracownik_id)`,
      [cel, wysokosc, pracownik_id],
      { autoCommit: true }
    );
    res.status(201).send('Zapomoga dodana do bazy');
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Błąd podczas dodawania danych do bazy');
  } finally {
    await connection.close();
  }
};


exports.addWydarzenie = async (req, res) => {
  const { nazwa_wydarzenia } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `INSERT INTO SYSTEM.WYDARZENIE (nazwa_wydarzenia)
       VALUES (:nazwa_wydarzenia)`,
      [nazwa_wydarzenia],
      { autoCommit: true }
    );
    res.status(201).send('Wydarzenie dodane do bazy');
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Błąd podczas dodawania danych do bazy');
  } finally {
    await connection.close();
  }
};

exports.addDofinansowanie = async (req, res) => {
  const { odbiorca, prog, data_wyplacenia, rodzaj, pracownik_id, dziecko_id, wydarzenie_id } = req.body;

  // Sprawdzenie, czy dziecko_id jest pusty (jeśli jest, to będzie NULL)
  const dzieckoIdParam = dziecko_id || null; // Jeśli dziecko_id jest undefined lub null, zostanie przekazane jako null

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `INSERT INTO SYSTEM.DOFINANSOWANIE (odbiorca, prog, data_wyplacenia, rodzaj, pracownik_id, dziecko_id, wydarzenie_id)
       VALUES (:odbiorca, :prog, TO_DATE(:data_wyplacenia, 'DD/MM/YYYY'), :rodzaj, :pracownik_id, :dziecko_id, :wydarzenie_id)`,
      [odbiorca, prog, data_wyplacenia, rodzaj, pracownik_id, dzieckoIdParam, wydarzenie_id],
      { autoCommit: true }
    );
    res.status(201).send('Dofinansowanie dodane do bazy');
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Błąd podczas dodawania danych do bazy');
  } finally {
    await connection.close();
  }
};


const fs = require('fs');

exports.addPracownicyFromFile = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    // Załadowanie pliku JSON
    const data = JSON.parse(fs.readFileSync('./pracownicy.json', 'utf8'));

    for (const pracownik of data) {
      const { nazwa, numer_konta, email, telefon, adres } = pracownik;

      await connection.execute(
        `INSERT INTO SYSTEM.PRACOWNIK (nazwa, numer_konta, email, telefon, adres)
         VALUES (:nazwa, :numer_konta, :email, :telefon, :adres)`,
        [nazwa, numer_konta, email, telefon, adres],
        { autoCommit: true }
      );
    }

    res.status(201).send('Dane z pliku JSON zostały dodane do bazy');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Błąd podczas dodawania danych z pliku');
  } finally {
    await connection.close();
  }
};

exports.addDzieciFromFile = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    // Załadowanie pliku JSON
    const data = JSON.parse(fs.readFileSync('./dzieci.json', 'utf8'));

    for (const dziecko of data) {
      const { nazwa, pracownik_id } = dziecko;

      await connection.execute(
        `INSERT INTO SYSTEM.DZIECKO (nazwa, pracownik_id)
         VALUES (:nazwa, :pracownik_id)`,
        [nazwa, pracownik_id],
        { autoCommit: true }
      );
    }

    res.status(201).send('Dane z pliku JSON dzieci zostały dodane do bazy');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Błąd podczas dodawania danych z pliku');
  } finally {
    await connection.close();
  }
};

exports.addPozyczkiFromFile = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    // Załadowanie pliku JSON
    const data = JSON.parse(fs.readFileSync('./pozyczki.json', 'utf8'));

    for (const pozyczka of data) {
      const { rodzaj, wysokosc, pracownik_id } = pozyczka;

      // Walidacja pola 'rodzaj'
      if (rodzaj !== 0 && rodzaj !== 1) {
        return res.status(400).send('Niepoprawny rodzaj pożyczki. Dozwolone wartości to 0 (konsumpcyjna) lub 1(na zakup mieszkania).');
      }

      await connection.execute(
        `INSERT INTO SYSTEM.POZYCZKA (rodzaj, wysokosc, pracownik_id)
         VALUES (:rodzaj, :wysokosc, :pracownik_id)`,
        [rodzaj, wysokosc, pracownik_id],
        { autoCommit: true }
      );
    }

    res.status(201).send('Dane z pliku JSON pożyczek zostały dodane do bazy');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Błąd podczas dodawania danych z pliku');
  } finally {
    await connection.close();
  }
};

exports.addRatPozyczkiFromFile = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    // Załadowanie pliku JSON
    const data = JSON.parse(fs.readFileSync('./rata_pozyczki.json', 'utf8'));

    for (const rata of data) {
      const { wysokosc, oplacona, termin_platnosci, pozyczka_id } = rata;

      if (oplacona !== 0 && oplacona !== 1) {
        return res.status(400).send('Niepoprawny oplacona rata pożyczki. Dozwolone wartości to 0 (nieoplacona) lub 1 (oplacona).');
      }

      await connection.execute(
        `INSERT INTO SYSTEM.RATA_POZYCZKI (wysokosc, oplacona, termin_platnosci, pozyczka_id)
         VALUES (:wysokosc, :oplacona, :termin_platnosci, :pozyczka_id)`,
        [wysokosc, oplacona, termin_platnosci, pozyczka_id],
        { autoCommit: true }
      );
    }

    res.status(201).send('Dane z pliku JSON rat pożyczek zostały dodane do bazy');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Błąd podczas dodawania danych z pliku');
  } finally {
    await connection.close();
  }
};

exports.addZyranciFromFile = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    // Załadowanie pliku JSON
    const data = JSON.parse(fs.readFileSync('./zyranci.json', 'utf8'));

    for (const zyrant of data) {
      const { pozyczka_id, pracownik_id } = zyrant;

      await connection.execute(
        `INSERT INTO SYSTEM.ZYRANT (pozyczka_id, pracownik_id)
         VALUES (:pozyczka_id, :pracownik_id)`,
        [pozyczka_id, pracownik_id],
        { autoCommit: true }
      );
    }

    res.status(201).send('Dane z pliku JSON zyrantów zostały dodane do bazy');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Błąd podczas dodawania danych z pliku');
  } finally {
    await connection.close();
  }
};

exports.addZapomogiFromFile = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    // Załadowanie pliku JSON
    const data = JSON.parse(fs.readFileSync('./zapomogi.json', 'utf8'));

    for (const zapomoga of data) {
      const { cel, wysokosc, pracownik_id } = zapomoga;

      await connection.execute(
        `INSERT INTO SYSTEM.ZAPOMOGA (cel, wysokosc, pracownik_id)
         VALUES (:cel, :wysokosc, :pracownik_id)`,
        [cel, wysokosc, pracownik_id],
        { autoCommit: true }
      );
    }

    res.status(201).send('Dane z pliku JSON zapomóg zostały dodane do bazy');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Błąd podczas dodawania danych z pliku');
  } finally {
    await connection.close();
  }
};

exports.addWydarzeniaFromFile = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    // Załadowanie pliku JSON
    const data = JSON.parse(fs.readFileSync('./wydarzenia.json', 'utf8'));

    for (const wydarzenie of data) {
      const { nazwa_wydarzenia } = wydarzenie;

      await connection.execute(
        `INSERT INTO SYSTEM.WYDARZENIE (nazwa_wydarzenia)
         VALUES (:nazwa_wydarzenia)`,
        [nazwa_wydarzenia],
        { autoCommit: true }
      );
    }

    res.status(201).send('Dane z pliku JSON wydarzeń zostały dodane do bazy');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Błąd podczas dodawania danych z pliku');
  } finally {
    await connection.close();
  }
};

exports.addDofinansowaniaFromFile = async (req, res) => {
  const connection = await connectToDatabase();
  try {
    // Załadowanie pliku JSON
    const data = JSON.parse(fs.readFileSync('./dofinansowanie.json', 'utf8'));

    for (const dofinansowanie of data) {
      const { odbiorca, prog, data_wyplacenia, rodzaj, pracownik_id, dziecko_id, wydarzenie_id } = dofinansowanie;

      const dzieckoIdParam = dziecko_id || null; // Jeśli dziecko_id jest undefined lub null, przekazujemy null

      await connection.execute(
        `INSERT INTO SYSTEM.DOFINANSOWANIE (odbiorca, prog, data_wyplacenia, rodzaj, pracownik_id, dziecko_id, wydarzenie_id)
         VALUES (:odbiorca, :prog, TO_DATE(:data_wyplacenia, 'DD/MM/YYYY'), :rodzaj, :pracownik_id, :dziecko_id, :wydarzenie_id)`,
        [odbiorca, prog, data_wyplacenia, rodzaj, pracownik_id, dzieckoIdParam, wydarzenie_id],
        { autoCommit: true }
      );
    }

    res.status(201).send('Dane z pliku JSON dofinansowań zostały dodane do bazy');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Błąd podczas dodawania danych z pliku');
  } finally {
    await connection.close();
  }
};


exports.deletePracownik = async (req, res) => {
  const { pracownik_id } = req.params;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN pracownik_pkg.delete_pracownik(:pracownik_id); END;`,
      [pracownik_id],
      { autoCommit: true }
    );

    res.status(200).send('Pracownik został usunięty z bazy');
  } catch (error) {
    console.error('Error deleting data:', error.message);
    res.status(500).send('Błąd podczas usuwania danych z bazy');
  } finally {
    await connection.close();
  }
};

exports.deleteDziecko = async (req, res) => {
  const { dziecko_id } = req.params;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN dziecko_pkg.delete_dziecko(:dziecko_id); END;`,
      [dziecko_id],
      { autoCommit: true }
    );

    res.status(200).send('Dziecko zostało usunięte z bazy');
  } catch (error) {
    console.error('Error deleting data:', error.message);
    res.status(500).send('Błąd podczas usuwania danych z bazy');
  } finally {
    await connection.close();
  }
};

exports.deletePozyczka = async (req, res) => {
  const { pozyczka_id } = req.params;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN pozyczka_pkg.delete_pozyczka(:pozyczka_id); END;`,
      [pozyczka_id],
      { autoCommit: true }
    );

    res.status(200).send('Pożyczka została usunięta z bazy');
  } catch (error) {
    console.error('Error deleting data:', error.message);
    res.status(500).send('Błąd podczas usuwania danych z bazy');
  } finally {
    await connection.close();
  }
};

exports.deleteRataPozyczki = async (req, res) => {
  const { rata_id } = req.params;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN rata_pozyczki_pkg.delete_rata_pozyczki(:rata_id); END;`,
      [rata_id],
      { autoCommit: true }
    );

    res.status(200).send('Rata pożyczki została usunięta z bazy');
  } catch (error) {
    console.error('Error deleting data:', error.message);
    res.status(500).send('Błąd podczas usuwania danych z bazy');
  } finally {
    await connection.close();
  }
};

exports.deleteZyrant = async (req, res) => {
  const { zyrant_id } = req.params;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN dofinansowanie_pkg.delete_dofinansowanie(:zyrant_id); END;`,
      [zyrant_id],
      { autoCommit: true }
    );

    res.status(200).send('Zyrant został usunięty z bazy');
  } catch (error) {
    console.error('Error deleting data:', error.message);
    res.status(500).send('Błąd podczas usuwania danych z bazy');
  } finally {
    await connection.close();
  }
};

exports.deleteZapomoga = async (req, res) => {
  const { zapomoga_id } = req.params;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN dofinansowanie_pkg.delete_dofinansowanie(:zapomoga_id); END;`,
      [zapomoga_id],
      { autoCommit: true }
    );

    res.status(200).send('Zapomoga została usunięta z bazy');
  } catch (error) {
    console.error('Error deleting data:', error.message);
    res.status(500).send('Błąd podczas usuwania danych z bazy');
  } finally {
    await connection.close();
  }
};

exports.deleteWydarzenie = async (req, res) => {
  const { wydarzenie_id } = req.params;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN wydarzenie_pkg.delete_wydarzenie(:wydarzenie_id); END;`,
      [wydarzenie_id],
      { autoCommit: true }
    );

    res.status(200).send('Wydarzenie zostało usunięte z bazy');
  } catch (error) {
    console.error('Error deleting data:', error.message);
    res.status(500).send('Błąd podczas usuwania danych z bazy');
  } finally {
    await connection.close();
  }
};

exports.deleteDofinansowanie = async (req, res) => {
  const { dofinansowanie_id } = req.params;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN dofinansowanie_pkg.delete_dofinansowanie(:dofinansowanie_id); END;`,
      [dofinansowanie_id],
      { autoCommit: true }
    );

    res.status(200).send('Dofinansowanie zostało usunięte z bazy');
  } catch (error) {
    console.error('Error deleting data:', error.message);
    res.status(500).send('Błąd podczas usuwania danych z bazy');
  } finally {
    await connection.close();
  }
};

exports.updatePozyczka = async (req, res) => {
  const { pozyczka_id, rodzaj, wysokosc, pracownik_id } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN
        pozyczka_pkg.update_pozyczka(
          :pozyczka_id,
          :rodzaj,
          :wysokosc,
          :pracownik_id
        );
      END;`,
      {
        pozyczka_id: pozyczka_id,
        rodzaj: rodzaj,
        wysokosc: wysokosc,
        pracownik_id: pracownik_id
      },
      { autoCommit: true }
    );

    res.status(200).send('Pożyczka została zaktualizowana w bazie');
  } catch (error) {
    console.error('Error updating pozyczka:', error.message);
    res.status(500).send('Błąd podczas aktualizacji pożyczki');
  } finally {
    await connection.close();
  }
};

exports.updatePracownik = async (req, res) => {
  const { pracownik_id, nazwa, numer_konta, email, telefon, adres } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN
        pracownik_pkg.update_pracownik(
          :pracownik_id,
          :nazwa,
          :numer_konta,
          :email,
          :telefon,
          :adres
        );
      END;`,
      {
        pracownik_id: pracownik_id,
        nazwa: nazwa,
        numer_konta: numer_konta,
        email: email,
        telefon: telefon,
        adres: adres
      },
      { autoCommit: true }
    );

    res.status(200).send('Pracownik został zaktualizowany w bazie');
  } catch (error) {
    console.error('Error updating pracownik:', error.message);
    res.status(500).send('Błąd podczas aktualizacji danych pracownika');
  } finally {
    await connection.close();
  }
};

exports.updateRataPozyczki = async (req, res) => {
  const { rata_pozyczki_id, wysokosc, oplacona, termin_platnosci, pozyczka_id } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN
        rata_pozyczki_pkg.update_rata_pozyczki(
          :rata_pozyczki_id,
          :wysokosc,
          :oplacona,
          :termin_platnosci,
          :pozyczka_id
        );
      END;`,
      {
        rata_pozyczki_id: rata_pozyczki_id,
        wysokosc: wysokosc,
        oplacona: oplacona,
        termin_platnosci: termin_platnosci,
        pozyczka_id: pozyczka_id
      },
      { autoCommit: true }
    );

    res.status(200).send('Rata pożyczki została zaktualizowana w bazie');
  } catch (error) {
    console.error('Error updating rata_pozyczki:', error.message);
    res.status(500).send('Błąd podczas aktualizacji raty pożyczki');
  } finally {
    await connection.close();
  }
};

exports.updateZapomoga = async (req, res) => {
  const { zapomoga_id, cel, wysokosc, pracownik_id } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN
        zapomoga_pkg.update_zapomoga(
          :zapomoga_id,
          :cel,
          :wysokosc,
          :pracownik_id
        );
      END;`,
      {
        zapomoga_id: zapomoga_id,
        cel: cel,
        wysokosc: wysokosc,
        pracownik_id: pracownik_id
      },
      { autoCommit: true }
    );

    res.status(200).send('Zapomoga została zaktualizowana w bazie');
  } catch (error) {
    console.error('Error updating zapomoga:', error.message);
    res.status(500).send('Błąd podczas aktualizacji zapomogi');
  } finally {
    await connection.close();
  }
};

exports.updateWydarzenie = async (req, res) => {
  const { wydarzenie_id, nazwa_wydarzenia } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN
        wydarzenie_pkg.update_wydarzenie(
          :wydarzenie_id,
          :nazwa_wydarzenia
        );
      END;`,
      {
        wydarzenie_id: wydarzenie_id,
        nazwa_wydarzenia: nazwa_wydarzenia
      },
      { autoCommit: true }
    );

    res.status(200).send('Wydarzenie zostało zaktualizowane w bazie');
  } catch (error) {
    console.error('Error updating wydarzenie:', error.message);
    res.status(500).send('Błąd podczas aktualizacji wydarzenia');
  } finally {
    await connection.close();
  }
};

exports.updateZyrant = async (req, res) => {
  const { pozyczka_id, pracownik_id } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN
        zyrant_pkg.update_zyrant(
          :pozyczka_id,
          :pracownik_id
        );
      END;`,
      {
        pozyczka_id: pozyczka_id,
        pracownik_id: pracownik_id
      },
      { autoCommit: true }
    );

    res.status(200).send('Żyrant został zaktualizowany w bazie');
  } catch (error) {
    console.error('Error updating zyrant:', error.message);
    res.status(500).send('Błąd podczas aktualizacji żyranta');
  } finally {
    await connection.close();
  }
};

exports.updateDziecko = async (req, res) => {
  const { dziecko_id, nazwa, pracownik_id } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN
        dziecko_pkg.update_dziecko(
          :dziecko_id,
          :nazwa,
          :pracownik_id
        );
      END;`,
      {
        dziecko_id: dziecko_id,
        nazwa: nazwa,
        pracownik_id: pracownik_id
      },
      { autoCommit: true }
    );

    res.status(200).send('Dziecko zostało zaktualizowane w bazie');
  } catch (error) {
    console.error('Error updating dziecko:', error.message);
    res.status(500).send('Błąd podczas aktualizacji danych dziecka');
  } finally {
    await connection.close();
  }
};

exports.updateDofinansowanie = async (req, res) => {
  const { dofinansowanie_id, odbiorca, prog, data_wyplacenia, rodzaj, pracownik_id, dziecko_id, wydarzenie_id } = req.body;

  const connection = await connectToDatabase();
  try {
    const result = await connection.execute(
      `BEGIN
        dofinansowanie_pkg.update_dofinansowanie(
          :dofinansowanie_id,
          :odbiorca,
          :prog,
          :data_wyplacenia,
          :rodzaj,
          :pracownik_id,
          :dziecko_id,
          :wydarzenie_id
        );
      END;`,
      {
        dofinansowanie_id: dofinansowanie_id,
        odbiorca: odbiorca,
        prog: prog,
        data_wyplacenia: data_wyplacenia,
        rodzaj: rodzaj,
        pracownik_id: pracownik_id,
        dziecko_id: dziecko_id,
        wydarzenie_id: wydarzenie_id
      },
      { autoCommit: true }
    );

    res.status(200).send('Dofinansowanie zostało zaktualizowane w bazie');
  } catch (error) {
    console.error('Error updating dofinansowanie:', error.message);
    res.status(500).send('Błąd podczas aktualizacji dofinansowania');
  } finally {
    await connection.close();
  }
};

