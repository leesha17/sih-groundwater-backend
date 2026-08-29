import { Router } from 'express';
import { getStations, getStationHistory, getGISStations } from '../controllers/groundwaterController.js';

const router = Router();

router.get('/stations', getStations);
router.get('/stations/:stationId/history', getStationHistory);
router.get('/gis/stations', getGISStations);

export default router;