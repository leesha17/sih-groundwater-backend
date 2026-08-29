import express from 'express';
import {
  getGISStations,
  getGroundwaterTrends,
  getWaterQuality,
  getAlerts,
} from '../controllers/groundwaterController.js';

const router = express.Router();

router.get('/gis/stations', getGISStations);
router.get('/trends', getGroundwaterTrends);
router.get('/quality', getWaterQuality);
router.get('/alerts', getAlerts);

export default router;