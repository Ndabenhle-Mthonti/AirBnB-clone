# AGENTS.md

## Cursor Cloud specific instructions

This is a MERN-stack Airbnb clone with two services:

- `backend/` — Express 5 + Mongoose API (entry `server.js`), served on port `4000`.
- `frontend/` — Create React App (React 19), dev server on port `3000`, proxies `/api/*` to `http://localhost:4000` (see `frontend/package.json` `"proxy"`).

### Database (MongoDB)

- The backend requires MongoDB. `mongodb-org` 8.0 is installed locally; the update script does not start it.
- There is no systemd in this VM, so start `mongod` manually (foreground process, use a tmux session):
  `mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017`
- `backend/.env` is git-ignored and points Mongoose at the local instance: `MONGO_URI=mongodb://127.0.0.1:27017/airbnb`. The update script recreates it if missing.
- `server.js` calls `dns.setServers(['8.8.8.8','1.1.1.1'])` (a workaround for Atlas SRV lookups). This is harmless with the local `mongodb://` URI.
- The server exits immediately if `MONGO_URI` is missing or Mongo is unreachable, so start `mongod` before the backend.

### Running the services

Start `mongod` first, then (each is a long-running process, run in its own tmux session):

- Backend dev (auto-reload via nodemon): `npm run dev` in `backend/` — verify with `curl http://localhost:4000/api/health` (expect `{"status":"ok","database":"connected"}`).
- Frontend dev: `npm start` in `frontend/` (use `BROWSER=none` to avoid launching a browser).

### Lint / test / build

- No backend lint or test scripts exist (`backend` `test` is a placeholder that exits 1).
- Frontend lint runs as part of `react-scripts` (CRA `eslintConfig`); `npm run build` in `frontend/` also surfaces lint errors.
- Frontend tests: `CI=true npm test` in `frontend/` (there are currently no test files, so this is a no-op pass).

### Hello-world flow

Creating a listing via the `/add` multi-step form (or `POST /api/airbnbs`) writes to MongoDB and the new card appears on the home page. The form sends a hardcoded placeholder `host` ObjectId (`507f1f77bcf86cd799439011`), so no auth/user is required to create a listing.
