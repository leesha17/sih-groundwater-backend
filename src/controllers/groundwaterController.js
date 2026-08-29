import { db } from '../../connection.js';
import {
  stations,
  groundwaterObservations,
  waterQualityObservations,
  alerts,
} from '../models/schema.js';
import { eq, desc } from 'drizzle-orm';

// 1. GET /api/groundwater/gis/stations?district=Cuddalore
export const getGISStations = async (req, res) => {
  try {
    const { district } = req.query;

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

    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((st) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            st.longitude ? parseFloat(st.longitude) : 0,
            st.latitude ? parseFloat(st.latitude) : 0,
          ],
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

// 2. GET /api/groundwater/trends?stationId=ST_CUD_001
export const getGroundwaterTrends = async (req, res) => {
  try {
    const { stationId } = req.query;

    if (!stationId) {
      return res.status(400).json({ error: 'Query parameter stationId is required (e.g. ?stationId=ST_CUD_001)' });
    }

    const targetStationId = String(stationId);

    // Queries groundWaterObservations using 'timestamp' & 'groundwaterLevel' from schema.js
    const history = await db
      .select({
        id: groundwaterObservations.id,
        timestamp: groundwaterObservations.timestamp,
        groundwaterLevel: groundwaterObservations.groundwaterLevel,
        unit: groundwaterObservations.unit,
        qualityFlag: groundwaterObservations.qualityFlag,
      })
      .from(groundwaterObservations)
      .where(eq(groundwaterObservations.stationId, targetStationId))
      .orderBy(groundwaterObservations.timestamp);

    if (!history || history.length === 0) {
      return res.status(404).json({ message: `No observations found for stationId: ${targetStationId}` });
    }

    const levels = history
      .map((h) => (h && h.groundwaterLevel !== null && h.groundwaterLevel !== undefined ? parseFloat(h.groundwaterLevel) : NaN))
      .filter((val) => !isNaN(val));

    if (levels.length === 0) {
      return res.status(400).json({ error: 'No valid numeric water levels found for this station' });
    }

    const sum = levels.reduce((acc, curr) => acc + curr, 0);
    const average = (sum / levels.length).toFixed(2);
    const minLevel = Math.min.apply(null, levels).toFixed(2);
    const maxLevel = Math.max.apply(null, levels).toFixed(2);
    const overallDecline = (levels[levels.length - 1] - levels[0]).toFixed(2);

    return res.status(200).json({
      stationId: targetStationId,
      summary: {
        avgWaterLevel: parseFloat(average),
        minWaterLevel: parseFloat(minLevel),
        maxWaterLevel: parseFloat(maxLevel),
        totalDeclineMeters: parseFloat(overallDecline),
        totalObservations: levels.length,
      },
      history,
    });
  } catch (err) {
    console.error('❌ Trends Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// 3. GET /api/groundwater/quality?stationId=ST_CUD_001
export const getWaterQuality = async (req, res) => {
  try {
    const { stationId } = req.query;

    let query = db
      .select({
        id: waterQualityObservations.id,
        stationId: waterQualityObservations.stationId,
        timestamp: waterQualityObservations.timestamp,
        ph: waterQualityObservations.ph,
        ec: waterQualityObservations.ec,
        tds: waterQualityObservations.tds,
        chloride: waterQualityObservations.chloride,
      })
      .from(waterQualityObservations)
      .orderBy(desc(waterQualityObservations.timestamp));

    if (stationId) {
      query = query.where(eq(waterQualityObservations.stationId, String(stationId)));
    }

    const records = await query;
    return res.status(200).json({ count: records.length, data: records });
  } catch (err) {
    console.error('❌ Quality Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// 4. GET /api/groundwater/alerts
export const getAlerts = async (req, res) => {
  try {
    const activeAlerts = await db
      .select({
        alertId: alerts.id,
        stationId: alerts.stationId,
        district: alerts.district,
        type: alerts.type,
        severity: alerts.severity,
        message: alerts.message,
        status: alerts.status,
        createdAt: alerts.createdAt,
      })
      .from(alerts)
      .where(eq(alerts.status, 'OPEN'))
      .orderBy(desc(alerts.createdAt));

    return res.status(200).json({ count: activeAlerts.length, alerts: activeAlerts });
  } catch (err) {
    console.error('❌ Alerts Error:', err);
    return res.status(500).json({ error: err.message });
  }
};