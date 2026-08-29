import { pgTable, serial, varchar, doublePrecision, timestamp, integer, text, geometry, index } from 'drizzle-orm/pg-core';

// 1. Stations Table
export const stations = pgTable('stations', {
  id: serial('id').primaryKey(),
  stationId: varchar('station_id', { length: 50 }).notNull().unique(),
  stationName: varchar('station_name', { length: 100 }).notNull(),
  agency: varchar('agency', { length: 50 }),
  state: varchar('state', { length: 50 }),
  district: varchar('district', { length: 50 }),
  block: varchar('block', { length: 50 }),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  // PostGIS Point Geometry SRID 4326
  geom: geometry('geom', { type: 'point', mode: 'xy', srid: 4326 }), 
  createdAt: timestamp('created_at').defaultNow()
});

// 2. Groundwater Observations Table
export const groundwaterObservations = pgTable('groundwater_observations', {
  id: serial('id').primaryKey(),
  stationId: varchar('station_id', { length: 50 }).references(() => stations.stationId),
  timestamp: timestamp('timestamp').notNull(),
  groundwaterLevel: doublePrecision('groundwater_level').notNull(),
  unit: varchar('unit', { length: 10 }).default('m'),
  qualityFlag: varchar('quality_flag', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => [
  // Important index for historical queries
  index('station_time_idx').on(table.stationId, table.timestamp)
]);

// 3. Water Quality Observations (Sparse: Do not fake EC data!)
export const waterQualityObservations = pgTable('water_quality_observations', {
  id: serial('id').primaryKey(),
  stationId: varchar('station_id', { length: 50 }).references(() => stations.stationId),
  timestamp: timestamp('timestamp').notNull(),
  ph: doublePrecision('ph'),
  ec: doublePrecision('ec'), // Electrical conductivity
  tds: doublePrecision('tds'),
  chloride: doublePrecision('chloride'),
  createdAt: timestamp('created_at').defaultNow()
});

// 4. Alerts Table
export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  severity: varchar('severity', { length: 20 }).notNull(),
  stationId: varchar('station_id', { length: 50 }),
  district: varchar('district', { length: 50 }),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('OPEN'),
  createdAt: timestamp('created_at').defaultNow()
});