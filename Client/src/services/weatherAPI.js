import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherAPI = {
  getCurrentWeather: async (county) => {
    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          q: `${county},Kenya`,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getForecast: async (county) => {
    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          q: `${county},Kenya`,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};