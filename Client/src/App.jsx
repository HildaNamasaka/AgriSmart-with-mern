import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Activities from './pages/Activities';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import MarketPrices from './pages/MarketPrices';
import Marketplace from './pages/Marketplace';
import Weather from './pages/Weather';
import { ThemeProvider } from './context/ThemeContext';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/farms" element={
            <PrivateRoute>
              <Layout><Farms /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/activities" element={
            <PrivateRoute>
              <Layout><Activities /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/expenses" element={
            <PrivateRoute>
              <Layout><Expenses /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/income" element={
            <PrivateRoute>
              <Layout><Income /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/prices" element={
            <PrivateRoute>
              <Layout><MarketPrices /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/marketplace" element={
            <PrivateRoute>
              <Layout><Marketplace /></Layout>
            </PrivateRoute>
          } />
          <Route path="/weather" element={
            <PrivateRoute>
              <Layout><Weather /></Layout>
            </PrivateRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;