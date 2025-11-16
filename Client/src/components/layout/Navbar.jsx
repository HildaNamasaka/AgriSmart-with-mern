import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-2xl font-bold">
            AgriSmart Kenya
          </Link>

          {user && (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="hover:text-green-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/farms" className="hover:text-green-200 transition-colors">
                  Farms
                </Link>
                <Link to="/activities" className="hover:text-green-200 transition-colors">
                  Activities
                </Link>
                <Link to="/expenses" className="hover:text-green-200 transition-colors">
                  Expenses
                </Link>
                <Link to="/income" className="hover:text-green-200 transition-colors">
                  Income
                </Link>
                <Link to="/prices" className="hover:text-green-200 transition-colors">
                  Market Prices
                </Link>
                <Link to="/marketplace" className="hover:text-green-200 transition-colors">
                  Marketplace
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}