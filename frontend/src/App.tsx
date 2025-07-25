import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import CustomerDashboard from './pages/CustomerDashboard';
import MakerDashboard from './pages/MakerDashboard';

function App() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={!token ? <AuthPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={
          token ? (userRole === 'Customer' ? <CustomerDashboard /> : <MakerDashboard />) : <Navigate to="/auth" />
        } />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;