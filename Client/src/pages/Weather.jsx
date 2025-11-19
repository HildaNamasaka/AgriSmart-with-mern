import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { weatherAPI } from '../services/weatherAPI';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Weather() {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const [currentWeather, forecastData] = await Promise.all([
        weatherAPI.getCurrentWeather(user.county),
        weatherAPI.getForecast(user.county)
      ]);

      setWeather(currentWeather);
      
      // Get daily forecast (one per day at noon)
      const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);
      setForecast(dailyForecast);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 text-center py-8">{error}</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
        <p className="text-gray-600 mt-2">Current weather and forecast for {user.county}</p>
      </div>

      {weather && (
        <div className="mb-8">
          <Card title="Current Weather">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Temperature</p>
                <p className="text-4xl font-bold text-gray-800">{Math.round(weather.main.temp)}°C</p>
                <p className="text-gray-500 text-sm mt-1">Feels like {Math.round(weather.main.feels_like)}°C</p>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Humidity</p>
                <p className="text-4xl font-bold text-blue-600">{weather.main.humidity}%</p>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Wind Speed</p>
                <p className="text-4xl font-bold text-gray-800">{Math.round(weather.wind.speed * 3.6)} km/h</p>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Conditions</p>
                <p className="text-xl font-semibold text-gray-800 capitalize">{weather.weather[0].description}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">Farming Recommendations:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {weather.main.temp > 30 && <li>• High temperature - Ensure adequate irrigation</li>}
                {weather.main.humidity > 80 && <li>• High humidity - Watch for fungal diseases</li>}
                {weather.wind.speed > 10 && <li>• Strong winds - Secure tall crops and structures</li>}
                {weather.main.temp < 15 && <li>• Cool temperature - Consider frost protection for sensitive crops</li>}
              </ul>
            </div>
          </Card>
        </div>
      )}

      <Card title="5-Day Forecast">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {Math.round(day.main.temp)}°C
              </p>
              <p className="text-sm text-gray-600 capitalize mb-2">
                {day.weather[0].description}
              </p>
              <p className="text-xs text-gray-500">
                Humidity: {day.main.humidity}%
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}