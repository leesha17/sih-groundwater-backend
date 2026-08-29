import { db } from '../../connection.js';
import { stations, groundwaterObservations, waterQualityObservations } from '../models/schema.js';
import { eq, sql, and, gte, lte } from 'drizzle-orm';

export const getStations = async (req, res) => {
  try {
    const { district } = req.query;
    let query = db.select().from(stations);
    
    if (district) {
      query = query.where(eq(stations.district, String(district)));
    }
    const result = await query;
    return res.status(200).json({ status: "success", data: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getStationHistory = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { startDate, endDate } = req.query;

    const filters = [eq(groundwaterObservations.stationId, stationId)];
    if (startDate) filters.push(gte(groundwaterObservations.timestamp, new Date(startDate)));
    if (endDate) filters.push(lte(groundwaterObservations.timestamp, new Date(endDate)));

    const history = await db.select()
      .from(groundwaterObservations)
      .where(and(...filters));

    return res.status(200).json({ stationId, history });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// MapLibre ready GeoJSON output!
export const getGISStations = async (req, res) => {
  try {
    const data = await db.select().from(stations);
    
    const geoJson = {
      type: "FeatureCollection",
      features: data.map(st => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [st.longitude, st.latitude]
        },
        properties: {
          stationId: st.stationId,
          name: st.stationName,
          district: st.district
        }
      }))
    };
    return res.status(200).json(geoJson);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};