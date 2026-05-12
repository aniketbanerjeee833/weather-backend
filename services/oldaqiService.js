import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAQ_URL = 'https://api.openaq.org/v3';

/**
 * Convert pollutant levels to AQI (1-5 scale)
 * 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
 */
const convertToAQI = (pollutants) => {
  // Simplified AQI calculation - in production use proper EPA/WHO guidelines
  const pm25 = pollutants.pm25 || 0;
  const pm10 = pollutants.pm10 || 0;
  
  if (pm25 < 12 || pm10 < 54) return 1; // Good
  if (pm25 < 35.4 || pm10 < 154) return 2; // Fair
  if (pm25 < 55.4 || pm10 < 254) return 3; // Moderate
  if (pm25 < 150.4 || pm10 < 354) return 4; // Poor
  return 5; // Very Poor
};

/**
 * Fetch AQI data for a city using coordinates
 */
export const fetchAQIData = async (latitude, longitude, cityName) => {
  try {
    const response = await axios.get(`${OPENAQ_URL}/latest`, {
      params: {
        coordinates: `${latitude},${longitude}`,
        radius: 100000,
        limit: 1 // Get the closest station
      }
    });

    // OpenAQ nesting is deep: response.data.results[0].measurements
    const result = response.data.results?.[0];

    if (!result || !result.measurements) {
      console.warn(`No measurements found for ${cityName}`);
      return null;
    }

    const pollutants = {};
    result.measurements.forEach(m => {
      // OpenAQ often uses 'pm25' or 'pm10'
      pollutants[m.parameter] = m.value;
    });

    // Check if we actually got any data
    if (Object.keys(pollutants).length === 0) return null;

    return {
      aqi: convertToAQI(pollutants),
      pm25: pollutants.pm25 || pollutants['pm2.5'] || null,
      pm10: pollutants.pm10 || null,
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`Error fetching AQI for ${cityName}:`, error.response?.data || error.message);
    return null;
  }
};
// export const fetchAQIData = async (latitude, longitude, cityName) => {
//   try {
//     const response = await axios.get(`${OPENAQ_URL}/latest`, {
//       params: {
//         coordinates: `${latitude},${longitude}`,
//         radius: 100000 // 100km radius
//       }
//     });

//     if (!response.data.results || response.data.results.length === 0) {
//       console.warn(`No AQI data found for ${cityName}`);
//       return null;
//     }

//     const data = response.data.results[0];
//     const pollutants = {};

//     // Extract pollutant data
//     if (data.measurements) {
//       data.measurements.forEach(measurement => {
//         pollutants[measurement.parameter] = measurement.value;
//       });
//     }

//     return {
//       aqi: convertToAQI(pollutants),
//       pm25: pollutants.pm25 || null,
//       pm10: pollutants.pm10 || null,
//       o3: pollutants.o3 || null,
//       no2: pollutants.no2 || null,
//       so2: pollutants.so2 || null,
//       co: pollutants.co || null,
//       timestamp: new Date()
//     };
//   } catch (error) {
//     console.error(`Error fetching AQI for ${cityName}:`, error.message);
//     return null;
//   }
// };
// export const fetchAQIData = async (
//   latitude,
//   longitude,
//   cityName
// ) => {
//   try {
//     const API_KEY =
//       process.env.OPENWEATHERMAP_API_KEY;

//     const url =
//       `https://api.openweathermap.org/data/2.5/air_pollution` +
//       `?lat=${latitude}` +
//       `&lon=${longitude}` +
//       `&appid=${API_KEY}`;

//     const response = await axios.get(url);

//     const pollution =
//       response.data.list[0];

//     return {
//       aqi: pollution.main.aqi,

//       pm25:
//         pollution.components.pm2_5,

//       pm10:
//         pollution.components.pm10,

//       no2:
//         pollution.components.no2,

//       o3:
//         pollution.components.o3,

//       co:
//         pollution.components.co,

//       so2:
//         pollution.components.so2,

//       timestamp: new Date(),
//     };
//   } catch (error) {
//     console.error(
//       `AQI fetch failed for ${cityName}:`,
//       error.response?.data ||
//       error.message
//     );

//     return null;
//   }
// };
/**
 * Fetch AQI for multiple cities
 */
export const fetchAQIForCities = async (cities) => {
  const aqiData = [];

  for (const city of cities) {
    try {
      const aqi = await fetchAQIData(city.latitude, city.longitude, city.cityName);
      if (aqi) {
        aqiData.push({
          cityName: city.cityName,
          aqi
        });
      }
    } catch (error) {
      console.error(`Failed to fetch AQI for ${city.cityName}`);
    }
  }

  return aqiData;
};
