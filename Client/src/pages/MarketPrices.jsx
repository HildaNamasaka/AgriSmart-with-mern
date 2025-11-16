import { useState, useEffect } from 'react';
import { priceAPI } from '../services/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { KENYAN_COUNTIES, CROPS } from '../utils/constants';

export default function MarketPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    crop: '',
    county: ''
  });

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await priceAPI.getAll();
      setPrices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredPrices = prices.filter(price => {
    if (filters.crop && price.crop !== filters.crop) return false;
    if (filters.county && price.county !== filters.county) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Market Prices</h1>
        <p className="text-gray-600 mt-2">Current crop prices across Kenyan markets</p>
      </div>

      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Crop
            </label>
            <select
              name="crop"
              value={filters.crop}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Crops</option>
              {CROPS.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by County
            </label>
            <select
              name="county"
              value={filters.county}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Counties</option>
              {KENYAN_COUNTIES.map((county) => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ crop: '', county: '' })}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </Card>

      {filteredPrices.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            {prices.length === 0 
              ? 'No price data available yet.' 
              : 'No prices match your filters. Try different criteria.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrices.map((price) => (
            <Card key={price._id}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800">{price.crop}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {price.unit}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">County:</span>
                    <span className="font-medium text-gray-800">{price.county}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Market:</span>
                    <span className="font-medium text-gray-800">{price.market}</span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Min Price:</span>
                      <span className="font-medium">KES {price.minPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Max Price:</span>
                      <span className="font-medium">KES {price.maxPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-800">Average:</span>
                      <span className="text-green-600">KES {price.averagePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Updated: {new Date(price.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Showing {filteredPrices.length} of {prices.length} price entries
            </p>
            <p className="text-sm text-gray-500">
              Price data is updated regularly from various markets across Kenya
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}