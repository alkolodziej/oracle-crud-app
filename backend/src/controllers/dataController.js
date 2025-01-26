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

