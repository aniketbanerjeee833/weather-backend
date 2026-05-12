import City from '../models/City.js';
import { fetchWeatherForCities } from './weatherService.js';
import { fetchAQIForCities } from './aqiService.js';
// import { fetchPopulationForCities } from './populationService.js';
import { fetchCurrencyForCities } from './currencyService.js';
import { GLOBAL_CITIES } from '../data/cities.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Fetch and update data for all cities
 */
export const fetchAndUpdateAllCities = async () => {
  console.log('🔄 Starting data fetch for all cities...');

  try {
    // Fetch data from all services in parallel
    const [weatherData, aqiData, populationData, currencyData] = await Promise.all([
      fetchWeatherForCities(GLOBAL_CITIES),
      fetchAQIForCities(GLOBAL_CITIES),
      // fetchPopulationForCities(GLOBAL_CITIES, process.env.RAPIDAPI_KEY),
      fetchCurrencyForCities(GLOBAL_CITIES)
    ]);

    // Process and update database
    for (const city of GLOBAL_CITIES) {
      try {
        const weather = weatherData.find(w => w.cityName === city.cityName)?.weather;
        const aqi = aqiData.find(a => a.cityName === city.cityName)?.aqi;
        // const population = populationData.find(p => p.cityName === city.cityName)?.population;
        const currency = currencyData.find(c => c.cityName === city.cityName)?.currency;

        // Update or create city document
        let cityDoc = await City.findOne({ cityName: city.cityName });

        if (!cityDoc) {
          // Create new city document
          cityDoc = new City({
            cityName: city.cityName,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude,
            timezone: city.timezone,
            weather: weather ? [weather] : [],
            aqi: aqi ? [aqi] : [],
            // population: population || {},
            currency: currency || {},
            lastFetched: new Date()
          });
        } else {
          // Update existing document
          if (weather) {
            cityDoc.weather.push(weather);
            // Keep only last 15 days of data
            const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
            cityDoc.weather = cityDoc.weather.filter(w => new Date(w.timestamp) > fifteenDaysAgo);
          }

          if (aqi) {
            cityDoc.aqi.push(aqi);
            // Keep only last 15 days of data
            const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
            cityDoc.aqi = cityDoc.aqi.filter(a => new Date(a.timestamp) > fifteenDaysAgo);
          }

          // if (population) {
          //   cityDoc.population = population;
          // }

          if (currency) {
            cityDoc.currency = currency;
          }

          cityDoc.lastFetched = new Date();
        }

        await cityDoc.save();
        console.log(`✅ Updated: ${city.cityName}`);
      } catch (error) {
        console.error(`❌ Error updating ${city.cityName}:`, error.message);
      }
    }

    console.log('✅ Data fetch completed');
    return true;
  } catch (error) {
    console.error('❌ Data fetch error:', error);
    return false;
  }
};

export default fetchAndUpdateAllCities;
