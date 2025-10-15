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

      {/* All Customer Data - Excel Format */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 All Customer Data (Excel Format - All Fields + Duplicate Tracking)</h2>
        <p className="text-sm text-gray-600 mb-4">
          ℹ️ Showing all records including duplicates. If a lead was updated 5 times, you'll see 5 rows with version numbers.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-800 text-white border-b-2 border-gray-300">
              <tr>
                {/* Duplicate Tracking Columns */}
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap sticky left-0 bg-gray-800 z-10">Version</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Duplicate?</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Imported At</th>
                {/* Column 1-10 */}
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Proposal Number</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Proposer Code</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Proposer Name</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Business Type</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Source Code</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Created Date</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Policy Status</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Sub Status</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Policy Issue Date</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Policy Expiry Date</th>
                {/* Column 11-20 */}
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Discrepancy Remark</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Product Name</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Branch Code</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Channel</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Lead ID</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">GST Exemption</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">GO GREEN</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Policy No</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Number of Members</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Policy Certificate No</th>
                {/* Column 21-30 */}
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Intermediary Code</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Intermediary Name</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Intermediary Classification</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Sales Manager Code</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Sales Manager Name</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Latest Team Name</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Premium Mode</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Net Premium</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Gross Premium</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Applicable Sum Insured</th>
                {/* Column 31-40 */}
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Cover Type</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Intimation Ageing</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Intimation Sub Ageing</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Sub Status Ageing</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Sub Status Sub Ageing</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Latest Sub Status Date</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Nationality</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Employee Discount</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 whitespace-nowrap">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentCustomers?.length > 0 ? (
                stats.recentCustomers.map((customer, idx) => (
                  <tr key={customer._id} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                    {/* Duplicate Tracking Columns */}
                    <td className="border border-gray-300 p-2 font-bold text-blue-600 sticky left-0 bg-inherit z-10">
                      {customer.updateCount || 1}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {customer.isDuplicate ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">🔄 Duplicate</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">✨ New</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-xs">
                      {customer.importedAt ? new Date(customer.importedAt).toLocaleString() : '-'}
                    </td>
                    {/* Excel Data Columns */}
                    <td className="border border-gray-300 p-2 font-medium text-primary-600">{customer.proposalNumber}</td>
                    <td className="border border-gray-300 p-2">{customer.proposerCode}</td>
                    <td className="border border-gray-300 p-2 font-medium">{customer.proposerName}</td>
                    <td className="border border-gray-300 p-2">{customer.businessType}</td>
                    <td className="border border-gray-300 p-2">{customer.sourceCode}</td>
                    <td className="border border-gray-300 p-2">{customer.createdDate}</td>
                    <td className="border border-gray-300 p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        customer.policyStatus === 'ISSUED' || customer.policyStatus === 'POLICY'
                          ? 'bg-green-100 text-green-800'
                          : customer.policyStatus === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {customer.policyStatus}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">{customer.subStatus}</td>
                    <td className="border border-gray-300 p-2">{customer.policyIssueDate || '-'}</td>
                    <td className="border border-gray-300 p-2">{customer.policyExpiryDate || '-'}</td>
                    <td className="border border-gray-300 p-2">{customer.discrepancyRemark || '-'}</td>
                    <td className="border border-gray-300 p-2">{customer.productName}</td>
                    <td className="border border-gray-300 p-2">{customer.branchCode}</td>
                    <td className="border border-gray-300 p-2">{customer.channel}</td>
                    <td className="border border-gray-300 p-2">{customer.leadId}</td>
                    <td className="border border-gray-300 p-2">{customer.gstExemption}</td>
                    <td className="border border-gray-300 p-2">{customer.goGreen}</td>
                    <td className="border border-gray-300 p-2">{customer.policyNo || '-'}</td>
                    <td className="border border-gray-300 p-2">{customer.numberOfMembers || '-'}</td>
                    <td className="border border-gray-300 p-2">{customer.policyCertificateNo || '-'}</td>
                    <td className="border border-gray-300 p-2">{customer.intermediaryCode}</td>
                    <td className="border border-gray-300 p-2">{customer.intermediaryName}</td>
                    <td className="border border-gray-300 p-2">{customer.intermediaryClassification}</td>
                    <td className="border border-gray-300 p-2">{customer.salesManagerCode}</td>
                    <td className="border border-gray-300 p-2">{customer.salesManagerName}</td>
                    <td className="border border-gray-300 p-2">{customer.latestTeamName}</td>
                    <td className="border border-gray-300 p-2">{customer.premiumMode}</td>
                    <td className="border border-gray-300 p-2 text-right font-medium text-green-600">₹{customer.netPremium}</td>
                    <td className="border border-gray-300 p-2 text-right font-medium text-green-600">₹{customer.grossPremium}</td>
                    <td className="border border-gray-300 p-2 text-right">₹{customer.applicableSumInsured}</td>
                    <td className="border border-gray-300 p-2">{customer.coverType}</td>
                    <td className="border border-gray-300 p-2">{customer.intimationAgeing}</td>
                    <td className="border border-gray-300 p-2">{customer.intimationSubAgeing}</td>
                    <td className="border border-gray-300 p-2">{customer.subStatusAgeing}</td>
                    <td className="border border-gray-300 p-2">{customer.subStatusSubAgeing}</td>
                    <td className="border border-gray-300 p-2">{customer.latestSubStatusDate}</td>
                    <td className="border border-gray-300 p-2">{customer.nationality}</td>
                    <td className="border border-gray-300 p-2">{customer.employeeDiscount}</td>
                    <td className="border border-gray-300 p-2">{new Date(customer.lastUpdated).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="39" className="p-8 text-center text-gray-500 border border-gray-300">
                    No customers found. Upload an Excel file or sync with Gmail to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          💡 <strong>Tip:</strong> Scroll horizontally to see all 39 Excel columns. This table shows all data exactly as it appears in your Excel files.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
