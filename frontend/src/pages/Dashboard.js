import React, { useState, useEffect } from 'react';
import { customerAPI, syncAPI } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setMessage({ type: 'error', text: 'Failed to fetch dashboard statistics' });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      setMessage({ type: 'info', text: 'Syncing emails... This may take a moment.' });
      
      const response = await syncAPI.triggerSync();
      const result = response.data.data;
      
      setMessage({
        type: 'success',
        text: `Sync completed! Processed ${result.emailsProcessed} emails, Created ${result.created}, Updated ${result.updated}`
      });
      
      // Refresh stats
      fetchDashboardStats();
    } catch (error) {
      console.error('Error during sync:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Sync failed. Please check your Gmail configuration.'
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'green',
      'Pending': 'yellow',
      'Completed': 'blue',
      'Cancelled': 'red',
    };
    return colors[status] || 'primary';
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleManualSync}
          disabled={syncing}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            syncing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
        >
          {syncing ? '🔄 Syncing...' : '🔄 Sync Now'}
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : message.type === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xl font-bold">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon="👥"
          color="primary"
        />
        
        {stats?.statusCounts?.map((item) => (
          <StatCard
            key={item._id}
            title={item._id || 'Unknown'}
            value={item.count}
            icon={item._id === 'Active' ? '✅' : item._id === 'Pending' ? '⏳' : item._id === 'Completed' ? '🎉' : '❌'}
            color={getStatusColor(item._id)}
          />
        ))}
      </div>

      {/* Last Sync Info */}
      {stats?.lastSync && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Last Sync</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Time</p>
              <p className="font-semibold">
                {new Date(stats.lastSync.syncTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Emails Processed</p>
              <p className="font-semibold">{stats.lastSync.emailsProcessed}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Records Created</p>
              <p className="font-semibold text-green-600">{stats.lastSync.recordsCreated}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Records Updated</p>
              <p className="font-semibold text-blue-600">{stats.lastSync.recordsUpdated}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Customers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-700">Proposal No</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentCustomers?.length > 0 ? (
                stats.recentCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-primary-600">
                      {customer.proposalNo}
                    </td>
                    <td className="p-3 text-sm">{customer.customerName}</td>
                    <td className="p-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : customer.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : customer.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{customer.date}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(customer.lastUpdated).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No customers found. Upload an Excel file or sync with Gmail to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
