import { Router } from 'express';
import { getGISStations } from '../controllers/groundwaterController.js';

const router = Router();

// GIS MapLibre Endpoint
router.get('/gis/stations', getGISStations);

export default router;