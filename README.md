# Simple Tracker

A production-ready geolocation capture application using Express + PostgreSQL + vanilla JS.

## Features

- Unique tracking URL flow via `GET /l/:token`
- Browser geolocation capture with high-accuracy options
- REST API to persist latitude, longitude, accuracy, timestamp, IP, and user agent
- Admin dashboard:
  - table view with token filter
  - map view with markers (Leaflet)
  - CSV export
- PostgreSQL connection pooling, structured controllers/routes/models
- SQL migration script

## Tech Stack

- Backend: Node.js + Express
- Frontend: HTML/CSS/Vanilla JS
- Database: PostgreSQL
- Map: Leaflet.js

## Project Structure

```text
project/
 ├── server/
 │    ├── app.js
 │    ├── routes/
 │    ├── controllers/
 │    ├── models/
 │    └── db.js
 ├── public/
 │    ├── index.html
 │    ├── success.html
 │    ├── js/
 │    └── css/
 ├── dashboard/
 │    ├── dashboard.html
 │    └── map.html
 └── package.json
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL connection string.

3. Run migration:

```bash
npm run migrate
```

4. Start app:

```bash
npm start
```

App runs on `http://localhost:3000` by default.

## Main Endpoints

- `GET /l/:token` → tracking capture page
- `POST /api/location` → store geolocation record
- `GET /api/location` → list all logs (supports `?token=` filter)
- `GET /api/location/:token` → list logs for one token
- `GET /api/location/export/csv` → export logs as CSV (supports `?token=`)

## Usage Flow

1. Generate/share a link such as `http://localhost:3000/l/abc123token`.
2. User opens link and grants location permission.
3. Coordinates are posted to backend and saved.
4. User sees success page with a map and marker.
5. Admin opens:
   - `http://localhost:3000/dashboard/dashboard.html` (table + CSV export)
   - `http://localhost:3000/dashboard/map.html` (map markers)

## Linux Deployment Notes

- Run with a process manager (PM2/systemd).
- Set `NODE_ENV=production`.
- Place behind Nginx and set `TRUST_PROXY=true` in `.env` for real client IP capture.
- Use HTTPS in production; geolocation permissions require a secure context (or localhost).
