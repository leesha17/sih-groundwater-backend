import { db } from '../../connection.js';
import { stations } from '../models/schema.js';
import { eq } from 'drizzle-orm';

// GET /api/groundwater/gis/stations?district=Cuddalore
export const getGISStations = async (req, res) => {
  try {
    const { district } = req.query;

    // Explicitly select non-geometry columns to avoid binary parsing errors
    let query = db
      .select({
        id: stations.id,
        stationId: stations.stationId,
        stationName: stations.stationName,
        agency: stations.agency,
        state: stations.state,
        district: stations.district,
        block: stations.block,
        latitude: stations.latitude,
        longitude: stations.longitude,
        createdAt: stations.createdAt,
      })
      .from(stations);

    if (district) {
      query = query.where(eq(stations.district, String(district)));
    }

    const data = await query;

    // Format output as standard GeoJSON for MapLibre
    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((st) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(st.longitude), parseFloat(st.latitude)], // GeoJSON format: [lng, lat]
        },
        properties: {
          id: st.id,
          stationId: st.stationId,
          stationName: st.stationName,
          agency: st.agency,
          state: st.state,
          district: st.district,
          block: st.block,
        },
      })),
    };

    return res.status(200).json(geoJson);
  } catch (err) {
    console.error('❌ DB Query Error:', err);
    return res.status(500).json({ error: err.message });
  }
};