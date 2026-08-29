# Groundwater Monitoring & GIS Analytics Backend

A Node.js and Express backend service providing RESTful APIs for groundwater level analytics, water quality monitoring, and GIS spatial mapping. Built with PostgreSQL, PostGIS, and Drizzle ORM.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** PostgreSQL with PostGIS extension
* **ORM:** Drizzle ORM
* **Execution/Dev Tooling:** `tsx` (TypeScript / ES Module execution)

---

## 🚀 Features

* **GIS Station Mapping:** Serves spatial station data formatted as standard GeoJSON `FeatureCollection` objects for MapLibre GL / Leaflet integration.
* **Groundwater Trends & Analytics:** Calculates historical water level series alongside summary statistics (average level, minimum, maximum, and total decline rates).
* **Water Quality Monitoring:** Provides sparse observation metrics including pH, Electrical Conductivity (EC), Total Dissolved Solids (TDS), and chloride levels.
* **Alert System:** Tracks active groundwater alerts, severity levels, and regional warning thresholds.

---

## 📂 Project Structure

```text
.
├── src/
│   ├── controllers/
│   │   └── groundwaterController.js  # API request handlers & DB logic
│   ├── models/
│   │   └── schema.js                 # Drizzle ORM PostgreSQL schema
│   └── routes/
│       └── groundwaterRoutes.js      # Express API routes
├── connection.js                      # PostgreSQL & Drizzle DB connection
├── seed.js                            # Seed script for initial test data
├── app.js                             # Express application setup & server entry
├── package.json
└── README.md
