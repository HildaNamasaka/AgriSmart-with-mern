import { useState, useEffect } from 'react';
import { farmAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { KENYAN_COUNTIES, CROPS } from '../utils/constants';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    farmSize: '',
    sizeUnit: 'acres',
    county: '',
    subCounty: '',
    village: '',
    soilType: '',
    hasIrrigation: false,
    crops: []
  });
  const [selectedCrop, setSelectedCrop] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await farmAPI.getAll();
      setFarms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching farms:', error);
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

  const handleAddCrop = () => {
    if (selectedCrop && !formData.crops.some(c => c.cropName === selectedCrop)) {
      setFormData({
        ...formData,
        crops: [...formData.crops, { cropName: selectedCrop, status: 'planted' }]
      });
      setSelectedCrop('');
    }
  };

  const handleRemoveCrop = (cropName) => {
    setFormData({
      ...formData,
      crops: formData.crops.filter(c => c.cropName !== cropName)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const farmPayload = {
        ...formData,
        location: {
          county: formData.county,
          subCounty: formData.subCounty,
          village: formData.village
        }
      };

      await farmAPI.create(farmPayload);
      setShowForm(false);
      setFormData({
        description: '',
        farmSize: '',
        sizeUnit: 'acres',
        county: '',
        subCounty: '',
        village: '',
        soilType: '',
        hasIrrigation: false,
        crops: []
      });
      fetchFarms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create farm');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        await farmAPI.delete(id);
        fetchFarms();
      } catch (error) {
        console.error('Error deleting farm:', error);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Farms</h1>
          <p className="text-gray-600 mt-2">Manage your farm information</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Farm'}
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
              <Input
                label="Farm Description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="My main farm"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Farm Size"
                  type="number"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  placeholder="10"
                  required
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sizeUnit"
                    value={formData.sizeUnit}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>

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
                label="Village/Location"
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="Enter village name"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Type
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Soil Type</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loam">Loam</option>
                  <option value="Silt">Silt</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hasIrrigation"
                  checked={formData.hasIrrigation}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Has Irrigation System</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crops Grown
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Crop</option>
                  {CROPS.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                <Button type="button" onClick={handleAddCrop} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.crops.map((crop) => (
                  <span
                    key={crop.cropName}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {crop.cropName}
                    <button
                      type="button"
                      onClick={() => handleRemoveCrop(crop.cropName)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Farm
            </Button>
          </form>
        </Card>
      )}

      {farms.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            No farms registered yet. Click "Add New Farm" to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card key={farm._id}>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">{farm.description}</h3>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Size:</span> {farm.farmSize} {farm.sizeUnit}</p>
                  <p><span className="font-medium">Location:</span> {farm.location.county}</p>
                  {farm.location.village && (
                    <p><span className="font-medium">Village:</span> {farm.location.village}</p>
                  )}
                  {farm.soilType && (
                    <p><span className="font-medium">Soil:</span> {farm.soilType}</p>
                  )}
                  <p><span className="font-medium">Irrigation:</span> {farm.hasIrrigation ? 'Yes' : 'No'}</p>
                </div>

                {farm.crops && farm.crops.length > 0 && (
                  <div>
                    <p className="font-medium text-sm text-gray-700 mb-2">Crops:</p>
                    <div className="flex flex-wrap gap-1">
                      {farm.crops.map((crop, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                        >
                          {crop.cropName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="danger"
                  onClick={() => handleDelete(farm._id)}
                  className="w-full mt-4"
                >
                  Delete Farm
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}