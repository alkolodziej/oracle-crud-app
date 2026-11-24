# Oracle CRUD App

Team prototype by Alan Kołodziej and Błażej Knap.

A React and Express application that browses Oracle tables and views and imports records from JSON files. The API also provides record update and delete operations.

## Run locally

Use Node.js 22 or later and an Oracle instance with the tables and views referenced in `backend/src/controllers/dataController.js`. The repository requires an existing schema.

Copy `backend/.env.example` to `backend/.env` and fill in `DB_USER`, `DB_PASSWORD` and `DB_CONNECTION_STRING` for a disposable local database. From the repository root, run the backend and frontend in separate terminals.

```sh
cd backend
npm ci
npm start
```

```sh
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite. The frontend expects the API on port 5000. The table viewer has unresolved edit and delete handlers. The API has no authentication and can modify Oracle records. Use sample data in an isolated environment. The JSON files in `backend/assets/` are synthetic import examples.
