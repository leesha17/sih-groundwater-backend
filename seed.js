import { db, client } from './connection.js';
import {
  stations,
  groundwaterObservations,
  waterQualityObservations,
  alerts,
} from './src/models/schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Seed Stations
    await db.insert(stations).values([
      {
        stationId: 'ST_CUD_001',
        stationName: 'Cuddalore Central Obs',
        agency: 'CGWB',
        state: 'Tamil Nadu',
        district: 'Cuddalore',
        block: 'Kurinjipadi',
        latitude: 11.748,
        longitude: 79.771,
      },
      {
        stationId: 'ST_CUD_002',
        stationName: 'Chidambaram North',
        agency: 'State Groundwater Board',
        state: 'Tamil Nadu',
        district: 'Cuddalore',
        block: 'Chidambaram',
        latitude: 11.399,
        longitude: 79.693,
      },
    ]).onConflictDoNothing();

    // 2. Seed Groundwater Observations (uses stationId string: 'ST_CUD_001')
    await db.insert(groundwaterObservations).values([
      { stationId: 'ST_CUD_001', timestamp: new Date('2026-01-15'), groundwaterLevel: 5.20 },
      { stationId: 'ST_CUD_001', timestamp: new Date('2026-02-15'), groundwaterLevel: 5.45 },
      { stationId: 'ST_CUD_001', timestamp: new Date('2026-03-15'), groundwaterLevel: 5.80 },
      { stationId: 'ST_CUD_001', timestamp: new Date('2026-04-15'), groundwaterLevel: 6.10 },
      { stationId: 'ST_CUD_001', timestamp: new Date('2026-05-15'), groundwaterLevel: 6.60 },
    ]);

    // 3. Seed Water Quality Observations
    await db.insert(waterQualityObservations).values([
      {
        stationId: 'ST_CUD_001',
        timestamp: new Date('2026-05-01'),
        ph: 7.20,
        ec: 1150.00,
        tds: 736.00,
        chloride: 220.00,
      },
    ]);

    // 4. Seed Alerts
    await db.insert(alerts).values([
      {
        stationId: 'ST_CUD_001',
        district: 'Cuddalore',
        type: 'CRITICAL_DECLINE',
        severity: 'HIGH',
        message: 'Water level dropped by 1.4m over 5 months.',
        status: 'OPEN',
      },
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.end();
  }
}

seed();