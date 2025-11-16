import { useState, useEffect } from 'react';
import { listingAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { KENYAN_COUNTIES, CROPS } from '../utils/constants';

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    type: 'sell',
    product: '',
    category: 'Crops',
    quantity: '',
    unit: 'kg',
    price: '',
    priceNegotiable: true,
    description: '',
    county: '',
    subCounty: '',
    specificLocation: '',
    contactPhone: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await listingAPI.getAll();
      setListings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const listingPayload = {
        ...formData,
        location: {
          county: formData.county,
          subCounty: formData.subCounty,
          specificLocation: formData.specificLocation
        }
      };

      await listingAPI.create(listingPayload);
      setShowForm(false);
      setFormData({
        type: 'sell',
        product: '',
        category: 'Crops',
        quantity: '',
        unit: 'kg',
        price: '',
        priceNegotiable: true,
        description: '',
        county: '',
        subCounty: '',
        specificLocation: '',
        contactPhone: ''
      });
      fetchListings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await listingAPI.delete(id);
        fetchListings();
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredListings = listings.filter(listing => {
    if (filter !== 'all' && listing.type !== filter) return false;
    if (searchTerm && !listing.product.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (listing.status !== 'active') return false;
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Marketplace</h1>
          <p className="text-gray-600 mt-2">Buy and sell agricultural products</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Listing'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="sell">I want to sell</option>
                  <option value="buy">I want to buy</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Crops">Crops</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Product Name"
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="e.g., Maize, Tomatoes"
                required
              />

              <Input
                label="Quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="100"
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="kg">Kilograms</option>
                  <option value="bags">Bags</option>
                  <option value="crates">Crates</option>
                  <option value="pieces">Pieces</option>
                  <option value="liters">Liters</option>
                  <option value="acres">Acres</option>
                </select>
              </div>

              <Input
                label="Price (KES)"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County <span className="text-red-500">*</span>
                </label>
                <select
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select County</option>
                  {KENYAN_COUNTIES.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Sub-County"
                type="text"
                name="subCounty"
                value={formData.subCounty}
                onChange={handleChange}
                placeholder="Enter sub-county"
              />

              <Input
                label="Specific Location"
                type="text"
                name="specificLocation"
                value={formData.specificLocation}
                onChange={handleChange}
                placeholder="Market, village, or landmark"
              />

              <Input
                label="Contact Phone"
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="0712345678"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe your product..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="priceNegotiable"
                  checked={formData.priceNegotiable}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Price is negotiable</span>
              </label>
            </div>

            <Button type="submit" className="w-full">
              Create Listing
            </Button>
          </form>
        </Card>
      )}

      <div className="mb-6">
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('sell')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'sell' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                For Sale
              </button>
              <button
                onClick={() => setFilter('buy')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'buy' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Wanted
              </button>
            </div>
          </div>
        </Card>
      </div>

      {filteredListings.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            No listings found. Be the first to create one!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing._id}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800">{listing.product}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    listing.type === 'sell' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {listing.type === 'sell' ? 'For Sale' : 'Wanted'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">{listing.description}</p>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{listing.quantity} {listing.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-green-600">
                      KES {listing.price.toLocaleString()}
                      {listing.priceNegotiable && <span className="text-xs text-gray-500 ml-1">(Negotiable)</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{listing.location.county}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{listing.contactPhone}</span>
                  </div>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Posted: {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(listing._id)}
                    className="text-sm px-3 py-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}