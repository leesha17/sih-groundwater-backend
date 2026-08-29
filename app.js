import express from 'express';
import cors from 'cors';
import groundwaterRoutes from './src/routes/groundwaterRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/groundwater', groundwaterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));