// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const EXCHANGERATE_API_URL = 'https://api.exchangerate-api.com/v4/latest';

// /**
//  * Fetch currency exchange rates for a country currency code
//  */
// // export const fetchCurrencyRates = async (countryCode, currencyCode, cityName) => {
// //   try {
// //     const response = await axios.get(`${EXCHANGERATE_API_URL}/${currencyCode}`);

// //     const rates = response.data.rates;

// //     return {
// //       currency: countryCode,
// //       code: currencyCode,
// //       exchangeRateToUSD: 1 / response.data.rates.USD || null,
// //       exchangeRateToINR: rates.INR || null,
// //       timestamp: new Date()
// //     };
// //   } catch (error) {
// //     console.error(`Error fetching currency rates for ${cityName}:`, error.message);
// //     return {
// //       currency: countryCode,
// //       code: currencyCode,
// //       exchangeRateToUSD: null,
// //       exchangeRateToINR: null,
// //       timestamp: new Date()
// //     };
// //   }
// // };
// const BASE_URL = "https://api.frankfurter.app/latest";

// /**
//  * Fetch currency exchange rates
//  */
// export const fetchCurrencyRates = async (
//   countryCode,
//   currencyCode,
//   cityName
// ) => {
//   try {
//     // Example:
//     // https://api.frankfurter.app/latest?from=USD&to=INR

//     const response = await axios.get(
//       `${BASE_URL}?from=${currencyCode}&to=INR`
//     );

//     return {
//       currency: countryCode,
//       code: currencyCode,

//       exchangeRateToINR:
//         response.data.rates?.INR || null,

//       timestamp: new Date(),
//     };
//   } catch (error) {
//     console.error(
//       `Error fetching currency rates for ${cityName}:`,
//       error.message
//     );

//     return {
//       currency: countryCode,
//       code: currencyCode,
//       exchangeRateToINR: null,
//       timestamp: new Date(),
//     };
//   }
// };
// /**
//  * Fetch currency rates for multiple cities
//  */
// export const fetchCurrencyForCities = async (cities) => {
//   const currencyData = [];

//   for (const city of cities) {
//     try {
//       const currency = await fetchCurrencyRates(
//         city.country,
//         city.currencyCode,
//         city.cityName
//       );
//       currencyData.push({
//         cityName: city.cityName,
//         currency
//       });
//     } catch (error) {
//       console.error(`Failed to fetch currency for ${city.cityName}`);
//     }
//   }

//   return currencyData;
// };
import axios from "axios";

/**
 * Fetch currency exchange rates
 */

export const fetchCurrencyRates =
  async (
    countryCode,
    currencyCode,
    cityName
  ) => {

    try {

      // INR special case

      if (currencyCode === "INR") {

        return {

          currency:
            countryCode,

          code:
            "INR",

          exchangeRateToINR:
            1,

          timestamp:
            new Date(),
        };
      }

      const response =
        await axios.get(
          "https://api.exchangerate.host/convert",
          {
            params: {
              from:
                currencyCode,

              to:
                "INR",

              amount:
                1,
            },
          }
        );

      return {

        currency:
          countryCode,

        code:
          currencyCode,

        exchangeRateToINR:
          response.data.result,

        timestamp:
          new Date(),
      };

    } catch (error) {

      console.error(
        `Error fetching currency rates for ${cityName}:`,
        error.message
      );

      return {

        currency:
          countryCode,

        code:
          currencyCode,

        exchangeRateToINR:
          null,

        timestamp:
          new Date(),
      };
    }
};

/**
 * Fetch currency rates for multiple cities
 */

export const fetchCurrencyForCities =
  async (cities) => {

    const currencyData = [];

    for (const city of cities) {

      try {

        const currency =
          await fetchCurrencyRates(

            city.country,

            city.currencyCode,

            city.cityName
          );

        currencyData.push({

          cityName:
            city.cityName,

          currency
        });

      } catch (error) {

        console.error(
          `Failed to fetch currency for ${city.cityName}`
        );
      }
    }

    return currencyData;
};