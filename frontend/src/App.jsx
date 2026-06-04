import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import Rewards from './pages/Rewards';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHistory from './pages/UserHistory';
import AdminCategories from './pages/AdminCategories';
import AdminClaims from './pages/AdminClaims';
import AdminRewards from './pages/AdminRewards';
import AdminBanks from './pages/AdminBanks';
import AdminTransactions from './pages/AdminTransactions';
import AdminUsers from './pages/AdminUsers';

// Placeholder Pages
const Placeholder = ({ title }) => (
  <div className="animate-fade-in">
    <header className="page-header">
      <h1 className="page-title">{title}</h1>
    </header>
    <div className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Modul {title} sedang dalam pengembangan.</p>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          user ? <Navigate to="/" replace /> : <Register />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }>
          <Route index element={
            user?.role === 'WARGA' ? <UserDashboard /> : <Dashboard />
          } />
          <Route path="rewards" element={<Rewards />} />
          <Route path="user/history" element={<UserHistory />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="admin/claims" element={<AdminClaims />} />
          <Route path="admin/rewards" element={<AdminRewards />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="banks" element={<AdminBanks />} />
          <Route path="categories" element={<Navigate to="/admin/categories" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
