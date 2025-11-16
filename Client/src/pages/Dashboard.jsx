import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { activityAPI, expenseAPI, incomeAPI, farmAPI } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityTable from '../components/dashboard/ActivityTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { getGreeting, calculateTotal } from '../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    farms: 0,
    activities: 0,
    totalExpenses: 0,
    totalIncome: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [farmsRes, activitiesRes, expensesRes, incomeRes] = await Promise.all([
        farmAPI.getAll(),
        activityAPI.getAll(),
        expenseAPI.getAll(),
        incomeAPI.getAll()
      ]);

      const expenses = expensesRes.data.data || [];
      const income = incomeRes.data.data || [];

      setStats({
        farms: farmsRes.data.count || 0,
        activities: activitiesRes.data.count || 0,
        totalExpenses: calculateTotal(expenses, 'amount'),
        totalIncome: calculateTotal(income, 'totalAmount')
      });

      setRecentActivities(activitiesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const profit = stats.totalIncome - stats.totalExpenses;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {getGreeting()}, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2">Welcome to your farm dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Farms"
          value={stats.farms}
          icon="🌾"
          color="green"
        />
        <StatsCard
          title="Activities Logged"
          value={stats.activities}
          icon="📝"
          color="blue"
        />
        <StatsCard
          title="Total Expenses"
          value={`KES ${stats.totalExpenses.toLocaleString()}`}
          icon="💸"
          color="red"
        />
        <StatsCard
          title="Total Income"
          value={`KES ${stats.totalIncome.toLocaleString()}`}
          icon="💰"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ActivityTable activities={recentActivities} />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Profit Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Income:</span>
                <span className="font-semibold text-green-600">
                  KES {stats.totalIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses:</span>
                <span className="font-semibold text-red-600">
                  KES {stats.totalExpenses.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-800 font-bold">Net Profit:</span>
                <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  KES {profit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/farms">
                <Button variant="outline" className="w-full">
                  Add New Farm
                </Button>
              </Link>
              <Link to="/activities">
                <Button variant="outline" className="w-full">
                  Log Activity
                </Button>
              </Link>
              <Link to="/expenses">
                <Button variant="outline" className="w-full">
                  Record Expense
                </Button>
              </Link>
              <Link to="/income">
                <Button variant="outline" className="w-full">
                  Record Income
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}