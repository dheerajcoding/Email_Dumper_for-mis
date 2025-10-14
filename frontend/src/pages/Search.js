import React, { useState } from 'react';
import { customerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a Proposal No');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCustomer(null);
      
      const response = await customerAPI.getCustomer(searchQuery.trim());
      setCustomer(response.data.data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Customer not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Search Customer</h1>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Proposal No..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Searching customer..." />}

      {/* Customer Details */}
      {customer && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showHistory ? '📋 Hide History' : '📜 View History'} ({customer.history?.length || 0})
            </button>
          </div>

          {/* Current Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-500 text-sm font-medium">Proposal No</p>
              <p className="text-xl font-bold text-primary-600">{customer.proposalNo}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Customer Name</p>
              <p className="text-xl font-semibold">{customer.customerName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Date</p>
              <p className="text-lg font-semibold">{customer.date}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500 text-sm font-medium">Remarks</p>
              <p className="text-lg">{customer.remarks || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Last Updated</p>
              <p className="text-lg">{new Date(customer.lastUpdated).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Updates</p>
              <p className="text-lg font-bold text-blue-600">{customer.history?.length || 0}</p>
            </div>
          </div>

          {/* Version History */}
          {showHistory && customer.history && customer.history.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Version History</h3>
              <div className="space-y-4">
                {customer.history.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-primary-600">
                        Version {customer.history.length - index}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Customer Name:</p>
                        <p className="font-medium">{entry.changes.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status:</p>
                        <p className="font-medium">{entry.changes.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date:</p>
                        <p className="font-medium">{entry.changes.date}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-500">Remarks:</p>
                        <p className="font-medium">{entry.changes.remarks || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showHistory && (!customer.history || customer.history.length === 0) && (
            <div className="border-t pt-6">
              <p className="text-center text-gray-500">No version history available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
