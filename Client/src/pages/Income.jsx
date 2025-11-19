import { useState, useEffect } from 'react';
import { incomeAPI, farmAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CROPS } from '../utils/constants';
import { formatDate, calculateTotal } from '../utils/helpers';

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    farm: '',
    crop: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    buyer: '',
    buyerPhone: '',
    market: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incomesRes, farmsRes] = await Promise.all([
        incomeAPI.getAll(),
        farmAPI.getAll()
      ]);
      setIncomes(incomesRes.data.data || []);
      setFarms(farmsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const totalAmount = parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit);
      await incomeAPI.create({ ...formData, totalAmount });
      
      setShowForm(false);
      setFormData({
        farm: '',
        crop: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        buyer: '',
        buyerPhone: '',
        market: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        paymentStatus: 'Paid',
        notes: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record income');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await incomeAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting income:', error);
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

  const totalIncome = calculateTotal(incomes, 'totalAmount');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Income</h1>
          <p className="text-gray-600 mt-2">Track your farm sales and revenue</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Income'}
        </Button>
      </div>

      <div className="mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Income</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              KES {totalIncome.toLocaleString()}
            </p>
          </div>
        </Card>
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
                  Farm
                </label>
                <select
                  name="farm"
                  value={formData.farm}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Farm (Optional)</option>
                  {farms.map((farm) => (
                    <option key={farm._id} value={farm._id}>{farm.description}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop/Product <span className="text-red-500">*</span>
                </label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Crop</option>
                  {CROPS.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Quantity Sold"
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
                  <option value="kg">Kilograms (kg)</option>
                  <option value="bags">Bags</option>
                  <option value="crates">Crates</option>
                  <option value="bunches">Bunches</option>
                  <option value="pieces">Pieces</option>
                  <option value="liters">Liters</option>
                </select>
              </div>

              <Input
                label="Price per Unit (KES)"
                type="number"
                name="pricePerUnit"
                value={formData.pricePerUnit}
                onChange={handleChange}
                placeholder="50"
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <input
                  type="text"
                  value={formData.quantity && formData.pricePerUnit 
                    ? `KES ${(parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit)).toLocaleString()}`
                    : 'KES 0'}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <Input
                label="Buyer Name"
                type="text"
                name="buyer"
                value={formData.buyer}
                onChange={handleChange}
                placeholder="Buyer name"
              />

              <Input
                label="Buyer Phone"
                type="tel"
                name="buyerPhone"
                value={formData.buyerPhone}
                onChange={handleChange}
                placeholder="0712345678"
              />

              <Input
                label="Market/Location"
                type="text"
                name="market"
                value={formData.market}
                onChange={handleChange}
                placeholder="Market name"
              />

              <Input
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="M-PESA">M-PESA</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                placeholder="Additional notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <Button type="submit" className="w-full">
              Record Income
            </Button>
          </form>
        </Card>
      )}

      {incomes.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            No income recorded yet. Click "Add Income" to get started.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Crop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Price/Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incomes.map((income) => (
                    <tr key={income._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(income.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{income.crop}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {income.quantity} {income.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        KES {income.pricePerUnit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600 whitespace-nowrap">
                        KES {income.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{income.buyer || '-'}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs ${
                          income.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          income.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {income.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(income._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}