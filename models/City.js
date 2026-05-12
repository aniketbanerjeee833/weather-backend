import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  temperature: Number,
  feelsLike: Number,
  humidity: Number,
  pressure: Number,
  windSpeed: Number,
  weatherMain: String,
  weatherDescription: String,
  clouds: Number,
  timestamp: { type: Date, default: Date.now }
});

const aaqiSchema = new mongoose.Schema({
  aqi: Number, // 1-5 scale
  pm25: Number,
  pm10: Number,
  o3: Number,
  no2: Number,
  so2: Number,
  co: Number,
  timestamp: { type: Date, default: Date.now }
});

const populationSchema = new mongoose.Schema({
  populationCount: Number,
  populationDensity: Number,
  lastUpdated: { type: Date, default: Date.now }
});

const currencySchema = new mongoose.Schema({
  currency: String,
  code: String,
  exchangeRateToUSD: Number,
  exchangeRateToINR: Number,
  timestamp: { type: Date, default: Date.now }
});

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
      unique: true
    },
    country: String,
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    timezone: String,
    population: populationSchema,
    weather: [weatherSchema],
    aqi: [aaqiSchema],
    currency: currencySchema,
    lastFetched: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for querying by city name
citySchema.index({ cityName: 1 });
citySchema.index({ 'weather.timestamp': -1 });
citySchema.index({ 'aqi.timestamp': -1 });

const City = mongoose.model('City', citySchema);

export default City;
