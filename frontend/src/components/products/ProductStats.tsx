import React from 'react';
import { ProductStats as StatsType } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProductStatsProps {
  stats: StatsType | null;
  loading?: boolean;
}

const ProductStats: React.FC<ProductStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
            <div className="animate-pulse">
              <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-secondary-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary-500">No statistics available</p>
      </div>
    );
  }

  const statusData = [
    { name: 'Active', value: stats.active, color: '#22c55e' },
    { name: 'Expired', value: stats.expired, color: '#ef4444' },
    { name: 'Claimed', value: stats.claimed, color: '#f59e0b' },
    { name: 'Cancelled', value: stats.cancelled, color: '#64748b' },
  ];

  const chartData = [
    { name: 'Active', value: stats.active },
    { name: 'Expired', value: stats.expired },
    { name: 'Claimed', value: stats.claimed },
    { name: 'Cancelled', value: stats.cancelled },
  ];

  const statCards = [
    {
      title: 'Total Products',
      value: stats.total,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      icon: '📦',
    },
    {
      title: 'Active Warranties',
      value: stats.active,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      icon: '✅',
    },
    {
      title: 'Expired',
      value: stats.expired,
      color: 'text-error-600',
      bgColor: 'bg-error-50',
      icon: '❌',
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      icon: '⚠️',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} p-6 rounded-lg border`}>
            <div className="flex items-center">
              <div className="text-2xl mr-3">{card.icon}</div>
              <div>
                <p className="text-sm font-medium text-secondary-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Product Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductStats;
