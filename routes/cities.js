import express from 'express';
import City from '../models/City.js';
import { GLOBAL_CITIES } from '../data/cities.js';

const router = express.Router();

/**
 * GET /api/cities
 * Get all cities with latest data
 */
router.get('/', async (req, res) => {
  try {
    const cities = await City.find({}).select('-weather -aqi').limit(10);

    if (cities.length === 0) {
      // Return city metadata if no data in DB yet
      return res.json(
        GLOBAL_CITIES.map(city => ({
          cityName: city.cityName,
          country: city.country,
          latitude: city.latitude,
          longitude: city.longitude,
          weather: null,
          aqi: null,
          // population: null,
          currency: null
        }))
      );
    }

    const citiesWithLatestData = cities.map(city => {
      const latestWeather = city.weather?.[city.weather.length - 1] || null;
      const latestAqi = city.aqi?.[city.aqi.length - 1] || null;

      return {
        cityName: city.cityName,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        weather: latestWeather,
        aqi: latestAqi,
        // population: city.population,
        currency: city.currency,
        lastFetched: city.lastFetched
      };
    });

    res.json(citiesWithLatestData);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

/**
 * GET /api/cities/:cityName
 * Get detailed data for a specific city
 */
router.get('/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const city = await City.findOne({ cityName: new RegExp(cityName, 'i') });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({
      cityName: city.cityName,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
      weather: city.weather,
      aqi: city.aqi,
      population: city.population,
      currency: city.currency,
      lastFetched: city.lastFetched,
      createdAt: city.createdAt,
      updatedAt: city.updatedAt
    });
  } catch (error) {
    console.error('Error fetching city details:', error);
    res.status(500).json({ error: 'Failed to fetch city details' });
  }
});

/**
 * GET /api/cities/:cityName/weather
 * Get weather history for a city
 */
router.get('/:cityName/weather', async (req, res) => {
  try {
    const { cityName } = req.params;
    const city = await City.findOne({ cityName: new RegExp(cityName, 'i') });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Sort weather by timestamp in descending order (latest first)
    const sortedWeather = [...city.weather].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json({
      cityName: city.cityName,
      weather: sortedWeather
    });
  } catch (error) {
    console.error('Error fetching weather history:', error);
    res.status(500).json({ error: 'Failed to fetch weather history' });
  }
});

/**
 * GET /api/cities/:cityName/aqi
 * Get AQI history for a city
 */
router.get('/:cityName/aqi', async (req, res) => {
  try {
    const { cityName } = req.params;
    const city = await City.findOne({ cityName: new RegExp(cityName, 'i') });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Sort AQI by timestamp in descending order (latest first)
    const sortedAqi = [...city.aqi].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json({
      cityName: city.cityName,
      aqi: sortedAqi
    });
  } catch (error) {
    console.error('Error fetching AQI history:', error);
    res.status(500).json({ error: 'Failed to fetch AQI history' });
  }
});

/**
 * GET /api/cities/:cityName/latest
 * Get latest metrics for a city
 */
router.get('/:cityName/latest', async (req, res) => {
  try {
    const { cityName } = req.params;
    const city = await City.findOne({ cityName: new RegExp(cityName, 'i') });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    const latestWeather = city.weather?.[city.weather.length - 1] || null;
    const latestAqi = city.aqi?.[city.aqi.length - 1] || null;

    res.json({
      cityName: city.cityName,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
      weather: latestWeather,
      aqi: latestAqi,
      population: city.population,
      currency: city.currency,
      lastFetched: city.lastFetched
    });
  } catch (error) {
    console.error('Error fetching latest metrics:', error);
    res.status(500).json({ error: 'Failed to fetch latest metrics' });
  }
});

export default router;
