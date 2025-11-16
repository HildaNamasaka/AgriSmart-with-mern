import { useState, useEffect } from 'react';
import { expenseAPI, farmAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { formatDate, calculateTotal } from '../utils/helpers';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    farm: '',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    receiptNumber: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesRes, farmsRes] = await Promise.all([
        expenseAPI.getAll(),
        farmAPI.getAll()
      ]);
      setExpenses(expensesRes.data.data || []);
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
      await expenseAPI.create(formData);
      setShowForm(false);
      setFormData({
        farm: '',
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        receiptNumber: '',
        notes: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting expense:', error);
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

  const totalExpenses = calculateTotal(expenses, 'amount');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-600 mt-2">Track your farm expenses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Expense'}
        </Button>
      </div>

      <div className="mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <p className="text-4xl font-bold text-red-600 mt-2">
              KES {totalExpenses.toLocaleString()}
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
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Category</option>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What did you purchase?"
                required
              />

              <Input
                label="Amount (KES)"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                required
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

              <Input
                label="Receipt Number (Optional)"
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleChange}
                placeholder="Receipt/Transaction ID"
              />
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
              Record Expense
            </Button>
          </form>
        </Card>
      )}

      {expenses.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            No expenses recorded yet. Click "Add Expense" to get started.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{expense.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600">
                      KES {expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{expense.paymentMethod}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}