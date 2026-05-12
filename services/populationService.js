// import axios from 'axios';

// const GEODB_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

// /**
//  * Fetch city population data using GeoDB
//  * Note: GeoDB is a RapidAPI endpoint requiring API key
//  */
// export const fetchPopulationData = async (cityName, countryCode, rapidApiKey) => {
//   try {
//     // Search for city
//     const searchResponse = await axios.get(`${GEODB_API_URL}/cities`, {
//       params: {
//         namePrefix: cityName,
//         limit: 1,
//         offset: 0,
//         sort: '-population'
//       },
//       headers: {
//         'x-rapidapi-key': rapidApiKey,
//         'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
//       }
//     });

//     if (!searchResponse.data.data || searchResponse.data.data.length === 0) {
//       console.warn(`No population data found for ${cityName}`);
//       return null;
//     }

//     const cityData = searchResponse.data.data[0];

//     return {
//       populationCount: cityData.population || 0,
//       populationDensity: cityData.populationDensity || 0,
//       lastUpdated: new Date()
//     };
//   } catch (error) {
//     console.error(`Error fetching population for ${cityName}:`, error.message);
//     return null;
//   }
// };

// /**
//  * Fetch population for multiple cities
//  */
// export const fetchPopulationForCities = async (cities, rapidApiKey) => {
//   const populationData = [];

//   for (const city of cities) {
//     try {
//       const population = await fetchPopulationData(city.cityName, city.country, rapidApiKey);
//       if (population) {
//         populationData.push({
//           cityName: city.cityName,
//           population
//         });
//       }
//     } catch (error) {
//       console.error(`Failed to fetch population for ${city.cityName}`);
//     }
//   }

//   return populationData;
// };
