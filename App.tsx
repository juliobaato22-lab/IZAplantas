import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoreLayout from './components/StoreLayout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/store/Home';
import Shop from './pages/store/Shop';
import Cart from './pages/store/Cart';
import Contact from './pages/store/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import { initStorage } from './services/storageService';

// Fallback for not implemented pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-gray-500">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p>Módulo em desenvolvimento.</p>
  </div>
);

function App() {
  useEffect(() => {
    initStorage();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Store Routes */}
        <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
        <Route path="/shop" element={<StoreLayout><Shop /></StoreLayout>} />
        <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
        <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/sales" element={<AdminLayout><Placeholder title="Vendas & PDV" /></AdminLayout>} />
        <Route path="/admin/finance" element={<AdminLayout><Placeholder title="Financeiro" /></AdminLayout>} />
        
        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;