import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 dark:bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-bold">
            AgriSmart Kenya
          </Link>

          {user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/dashboard" className="hover:text-green-200 dark:hover:text-green-400 transition-colors">
                  {t('nav.dashboard')}
                </Link>
                <Link to="/farms" className="hover:text-green-200 dark:hover:text-green-400 transition-colors">
                  {t('nav.farms')}
                </Link>
                <Link to="/activities" className="hover:text-green-200 dark:hover:text-green-400 transition-colors">
                  {t('nav.activities')}
                </Link>
                <Link to="/expenses" className="hover:text-green-200 dark:hover:text-green-400 transition-colors">
                  {t('nav.expenses')}
                </Link>
                <Link to="/income" className="hover:text-green-200 dark:hover:text-green-400 transition-colors">
                  {t('nav.income')}
                </Link>
                <Link to="/prices" className="hover:text-green-200 dark:hover:text-green-400 transition-colors">
                  {t('nav.prices')}
                </Link>
                <Link to="/marketplace" className="hover:text-green-200 dark:hover:text-green-400 transition-colors">
                  {t('nav.marketplace')}
                </Link>
                <Link to="/weather" className="hover:text-green-200 dark:hover:text-green-400 transition-colors">
                  Weather
                </Link>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>

                {/* User Info - Hidden on Mobile */}
                <span className="hidden md:block text-sm">{t('nav.welcome')}, {user.name}</span>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {t('nav.logout')}
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-green-700 dark:hover:bg-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-green-700 dark:border-gray-800">
            <div className="flex flex-col gap-3">
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-green-700 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {t('nav.dashboard')}
              </Link>
              <Link 
                to="/farms" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-green-700 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {t('nav.farms')}
              </Link>
              <Link 
                to="/activities" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-green-700 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {t('nav.activities')}
              </Link>
              <Link 
                to="/expenses" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-green-700 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {t('nav.expenses')}
              </Link>
              <Link 
                to="/income" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-green-700 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {t('nav.income')}
              </Link>
              <Link 
                to="/prices" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-green-700 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {t('nav.prices')}
              </Link>
              <Link 
                to="/marketplace" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-green-700 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {t('nav.marketplace')}
              </Link>
              <Link 
                to="/weather" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-green-700 dark:hover:bg-gray-800 rounded transition-colors"
              >
                Weather
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}