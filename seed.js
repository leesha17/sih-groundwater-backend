import { db, client } from './connection.js';
import { stations } from './src/models/schema.js';

async function seed() {
  console.log('🌱 Seeding Cuddalore groundwater stations...');

  try {
    await db.insert(stations).values([
      {
        stationId: 'ST_CUD_001',
        stationName: 'Cuddalore Central Obs',
        agency: 'CGWB',
        state: 'Tamil Nadu',
        district: 'Cuddalore',
        block: 'Kurinjipadi',
        latitude: '11.748000',
        longitude: '79.771000',
      },
      {
        stationId: 'ST_CUD_002',
        stationName: 'Chidambaram North',
        agency: 'State Groundwater Board',
        state: 'Tamil Nadu',
        district: 'Cuddalore',
        block: 'Chidambaram',
        latitude: '11.399000',
        longitude: '79.693000',
      },
      {
        stationId: 'ST_CUD_003',
        stationName: 'Panruti Town Station',
        agency: 'CGWB',
        state: 'Tamil Nadu',
        district: 'Cuddalore',
        block: 'Panruti',
        latitude: '11.770000',
        longitude: '79.550000',
      },
    ]);

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.end();
  }
}

seed();