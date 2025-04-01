import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import POSPage from './pages/POSPage';
// Kita akan menambahkan halaman lain nanti
// import DashboardPage from './pages/DashboardPage';
// import OrdersPage from './pages/OrdersPage';
// import ServicesPage from './pages/ServicesPage';
// import CustomersPage from './pages/CustomersPage';
// import ReportsPage from './pages/ReportsPage';
// import SettingsPage from './pages/SettingsPage';
// import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  // Untuk demo, kita asumsikan user sudah login
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    // Implementasi halaman login nanti
    return <div>Login Page</div>;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/pos" replace />} />
        <Route path="/pos" element={<POSPage />} />
        {/* Uncomment saat halaman lain sudah diimplementasikan 
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        */}
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;