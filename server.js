import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import citiesRouter from './routes/cities.js';
import fetchAndUpdateAllCities from './services/dataFetcher.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Database connection
await connectDB();

// Routes
app.use('/api/cities', citiesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Manual trigger to fetch data
app.post('/api/fetch-data', async (req, res) => {
  try {
    const success = await fetchAndUpdateAllCities();
    if (success) {
      res.json({ message: 'Data fetched and updated successfully' });
    } else {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scheduled task to fetch data every 30 minutes
// Schedule: 0 */30 * * * * (every 30 minutes)
cron.schedule('0 */30 * * * *', () => {
  console.log('⏰ Running scheduled data fetch...');
  fetchAndUpdateAllCities();
});

// Also fetch data on server start
console.log('🚀 Starting server, fetching initial data...');
await fetchAndUpdateAllCities();

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Cities API: http://localhost:${PORT}/api/cities`);
});
