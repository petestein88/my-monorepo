import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routers/index.router';
import { CronJob } from 'cron';
import cronController from './controllers/cron.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://sacred.systems', 'https://www.sacred.systems']
    : '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cron job for streak updates (runs daily at midnight UTC)
const job = new CronJob(
  '0 0 * * *',
  async () => {
    console.log('Running daily streak update cron job');
    await cronController.updateUserStreakCount();
  },
  null,
  false,
  'UTC'
);

app.listen(PORT, () => {
  console.log(`Sacred API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  job.start();
  console.log('Cron job started for daily streak updates');
});

export default app;
