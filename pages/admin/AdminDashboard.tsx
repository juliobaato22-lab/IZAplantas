import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingBag, AlertTriangle, Package } from 'lucide-react';
import { getOrders, getProducts, getFinance } from '../../services/storageService';
import { Order, Product } from '../../types';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    lowStock: 0,
    products: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const orders = getOrders();
    const products = getProducts();
    
    // Calculate Stats
    const totalRevenue = orders.reduce((acc: number, order: Order) => acc + order.total, 0);
    const lowStockCount = products.filter((p: Product) => p.stock <= p.minStock).length;

    setStats({
      revenue: totalRevenue,
      orders: orders.length,
      lowStock: lowStockCount,
      products: products.length
    });

    // Prepare Chart Data (Sales by Date)
    const salesByDate: Record<string, number> = {};
    orders.forEach((order: Order) => {
      const date = new Date(order.date).toLocaleDateString('pt-BR');
      salesByDate[date] = (salesByDate[date] || 0) + order.total;
    });

    const data = Object.keys(salesByDate).map(date => ({
      name: date,
      vendas: salesByDate[date]
    })).slice(-7); // Last 7 days

    setChartData(data);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subText }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {subText && <p className="text-xs text-gray-400">{subText}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Total" 
          value={`R$ ${stats.revenue.toFixed(2)}`} 
          icon={DollarSign} 
          color="bg-green-600"
        />
        <StatCard 
          title="Vendas Realizadas" 
          value={stats.orders} 
          icon={ShoppingBag} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Estoque Baixo" 
          value={stats.lowStock} 
          icon={AlertTriangle} 
          color="bg-red-500"
          subText="Produtos precisando de reposição"
        />
        <StatCard 
          title="Total Produtos" 
          value={stats.products} 
          icon={Package} 
          color="bg-orange-400"
        />
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Vendas Recentes</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
              <Tooltip 
                cursor={{fill: '#f5f1e8'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="vendas" fill="#2E6F3E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;