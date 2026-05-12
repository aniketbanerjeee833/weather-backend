import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const OPENWEATHERMAP_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetch weather data for a city using coordinates
 */
export const fetchWeatherData = async (latitude, longitude, cityName) => {
  try {
    const response = await axios.get(OPENWEATHERMAP_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;

    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      weatherMain: data.weather[0].main,
      weatherDescription: data.weather[0].description,
      clouds: data.clouds.all,
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error.message);
    throw error;
  }
};

/**
 * Fetch weather for multiple cities
 */
export const fetchWeatherForCities = async (cities) => {
  const weatherData = [];

  for (const city of cities) {
    try {
      const weather = await fetchWeatherData(city.latitude, city.longitude, city.cityName);
      weatherData.push({
        cityName: city.cityName,
        weather
      });
    } catch (error) {
      console.error(`Failed to fetch weather for ${city.cityName}`);
    }
  }

  return weatherData;
};
