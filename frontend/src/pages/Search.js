import React, { useState } from 'react';
import { customerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCustomers([]);
      setSelectedCustomer(null);
      setSearchPerformed(true);
      
      // Use the /api/customers endpoint with search filter
      const response = await customerAPI.getAllCustomers(1, 50, { search: searchQuery.trim() });
      setCustomers(response.data.data.customers);
      
      if (response.data.data.customers.length === 0) {
        setError('No customers found matching your search');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
  };

  const closeDetails = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Search Customers</h1>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Proposal Number, Name, Status, Product, Branch, or any field
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search term (e.g., QE0663, Deepak, DRAFT, Activ One)..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Searching...' : '🔍 Search'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Searching customers..." />}

      {/* Search Results */}
      {!loading && searchPerformed && customers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Search Results ({customers.length} found)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Proposal Number</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Proposer Name</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Policy Status</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Product Name</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Branch Code</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-primary-600">
                      {customer.proposalNumber}
                    </td>
                    <td className="p-3 text-sm">{customer.proposerName}</td>
                    <td className="p-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.policyStatus === 'ISSUED' || customer.policyStatus === 'POLICY'
                            ? 'bg-green-100 text-green-800'
                            : customer.policyStatus === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {customer.policyStatus}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{customer.productName}</td>
                    <td className="p-3 text-sm">{customer.branchCode}</td>
                    <td className="p-3 text-sm">
                      <button
                        onClick={() => viewCustomerDetails(customer)}
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
              <button
                onClick={closeDetails}
                className="text-3xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Primary Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Primary Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Proposal Number</p>
                    <p className="text-lg font-bold text-primary-600">{selectedCustomer.proposalNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Proposer Code</p>
                    <p className="text-lg font-semibold">{selectedCustomer.proposerCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Proposer Name</p>
                    <p className="text-lg font-semibold">{selectedCustomer.proposerName}</p>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Business Type</p>
                    <p className="font-semibold">{selectedCustomer.businessType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Source Code</p>
                    <p className="font-semibold">{selectedCustomer.sourceCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Created Date</p>
                    <p className="font-semibold">{selectedCustomer.createdDate}</p>
                  </div>
                </div>
              </div>

              {/* Policy Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Policy Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Policy Status</p>
                    <p className="font-semibold">{selectedCustomer.policyStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sub Status</p>
                    <p className="font-semibold">{selectedCustomer.subStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Policy Issue Date</p>
                    <p className="font-semibold">{selectedCustomer.policyIssueDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Policy Expiry Date</p>
                    <p className="font-semibold">{selectedCustomer.policyExpiryDate || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-sm font-medium">Discrepancy Remark</p>
                    <p className="font-semibold">{selectedCustomer.discrepancyRemark || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Product & Branch */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Product & Branch</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Product Name</p>
                    <p className="font-semibold">{selectedCustomer.productName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Branch Code</p>
                    <p className="font-semibold">{selectedCustomer.branchCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Channel</p>
                    <p className="font-semibold">{selectedCustomer.channel}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Cover Type</p>
                    <p className="font-semibold">{selectedCustomer.coverType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sum Insured</p>
                    <p className="font-semibold">{selectedCustomer.applicableSumInsured}</p>
                  </div>
                </div>
              </div>

              {/* Intermediary Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Intermediary Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Intermediary Code</p>
                    <p className="font-semibold">{selectedCustomer.intermediaryCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Intermediary Name</p>
                    <p className="font-semibold">{selectedCustomer.intermediaryName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Classification</p>
                    <p className="font-semibold">{selectedCustomer.intermediaryClassification}</p>
                  </div>
                </div>
              </div>

              {/* Sales & Team */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Sales & Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sales Manager Code</p>
                    <p className="font-semibold">{selectedCustomer.salesManagerCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sales Manager Name</p>
                    <p className="font-semibold">{selectedCustomer.salesManagerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Latest Team Name</p>
                    <p className="font-semibold">{selectedCustomer.latestTeamName}</p>
                  </div>
                </div>
              </div>

              {/* Premium Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Premium Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Premium Mode</p>
                    <p className="font-semibold">{selectedCustomer.premiumMode}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Net Premium</p>
                    <p className="font-semibold text-green-600">₹ {selectedCustomer.netPremium}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Gross Premium</p>
                    <p className="font-semibold text-green-600">₹ {selectedCustomer.grossPremium}</p>
                  </div>
                </div>
              </div>

              {/* Ageing Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Ageing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Intimation Ageing</p>
                    <p className="font-semibold">{selectedCustomer.intimationAgeing} - {selectedCustomer.intimationSubAgeing}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sub Status Ageing</p>
                    <p className="font-semibold">{selectedCustomer.subStatusAgeing} - {selectedCustomer.subStatusSubAgeing}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Latest Sub Status Date</p>
                    <p className="font-semibold">{selectedCustomer.latestSubStatusDate}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Lead ID</p>
                    <p className="font-semibold">{selectedCustomer.leadId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Nationality</p>
                    <p className="font-semibold">{selectedCustomer.nationality}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">GST Exemption</p>
                    <p className="font-semibold">{selectedCustomer.gstExemption}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Employee Discount</p>
                    <p className="font-semibold">{selectedCustomer.employeeDiscount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">GO GREEN</p>
                    <p className="font-semibold">{selectedCustomer.goGreen}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Last Updated</p>
                    <p className="font-semibold">{new Date(selectedCustomer.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
