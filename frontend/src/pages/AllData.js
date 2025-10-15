import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AllData = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchAllCustomers();
  }, [pagination.page]);

  const fetchAllCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerAPI.getAllCustomers(pagination.page, pagination.limit);
      setCustomers(response.data.data.customers);
      setPagination(prev => ({
        ...prev,
        total: response.data.data.pagination.total,
        pages: response.data.data.pagination.pages
      }));
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportToCSV = () => {
    if (customers.length === 0) return;

    // CSV headers - all 43 fields
    const headers = [
      'Proposal Number', 'Proposer Code', 'Proposer Name', 'Business Type', 'Source Code',
      'Created Date', 'Policy Status', 'Sub Status', 'Policy Issue Date', 'Policy Expiry Date',
      'Discrepancy Remark', 'Product Name', 'Branch Code', 'Channel', 'Lead ID',
      'GST Exemption', 'GO GREEN', 'Policy No', 'Number of Members', 'Policy Certificate No',
      'Intermediary Code', 'Intermediary Name', 'Intermediary Classification',
      'Sales Manager Code', 'Sales Manager Name', 'Latest Team Name', 'Premium Mode',
      'Net Premium', 'Gross Premium', 'Applicable Sum Insured', 'Cover Type',
      'Intimation Ageing', 'Intimation Sub Ageing', 'Sub Status Ageing', 'Sub Status Sub Ageing',
      'Latest Sub Status Date', 'Nationality', 'Employee Discount', 'Last Updated'
    ];

    // CSV rows
    const rows = customers.map(c => [
      c.proposalNumber, c.proposerCode, c.proposerName, c.businessType, c.sourceCode,
      c.createdDate, c.policyStatus, c.subStatus, c.policyIssueDate || '', c.policyExpiryDate || '',
      c.discrepancyRemark || '', c.productName, c.branchCode, c.channel, c.leadId,
      c.gstExemption, c.goGreen, c.policyNo || '', c.numberOfMembers || '', c.policyCertificateNo || '',
      c.intermediaryCode, c.intermediaryName, c.intermediaryClassification,
      c.salesManagerCode, c.salesManagerName, c.latestTeamName, c.premiumMode,
      c.netPremium, c.grossPremium, c.applicableSumInsured, c.coverType,
      c.intimationAgeing, c.intimationSubAgeing, c.subStatusAgeing, c.subStatusSubAgeing,
      c.latestSubStatusDate, c.nationality, c.employeeDiscount, new Date(c.lastUpdated).toLocaleString()
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_customers_page${pagination.page}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && customers.length === 0) {
    return <LoadingSpinner message="Loading all customer data..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📊 All Customer Data (Excel Format)</h1>
            <p className="text-gray-600 mt-2">
              Showing <strong>{customers.length}</strong> records out of <strong>{pagination.total}</strong> total customers
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            📥 Export Page to CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Pagination Controls - Top */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Page <strong>{pagination.page}</strong> of <strong>{pagination.pages}</strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏮ First
            </button>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
            <button
              onClick={() => handlePageChange(pagination.pages)}
              disabled={pagination.page >= pagination.pages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last ⏭
            </button>
          </div>
        </div>
      </div>

      {/* All Customer Data Table - Excel Format */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          ℹ️ Showing ALL records including duplicates - If a lead was updated 5 times, you'll see 5 rows
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap sticky left-0 bg-gray-800 z-10">Row</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Version</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Duplicate?</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Imported At</th>
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
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Discrepancy Remark</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Product Name</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Branch Code</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Channel</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Lead ID</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">GST Exemption</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">GO GREEN</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Policy No</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Number of Members</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Policy Certificate No</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Intermediary Code</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Intermediary Name</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Intermediary Classification</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Sales Manager Code</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Sales Manager Name</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Latest Team Name</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Premium Mode</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Net Premium</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Gross Premium</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Applicable Sum Insured</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Cover Type</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Intimation Ageing</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Intimation Sub Ageing</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Sub Status Ageing</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Sub Status Sub Ageing</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Latest Sub Status Date</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Nationality</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Employee Discount</th>
                <th className="border border-gray-600 p-2 text-left font-semibold whitespace-nowrap">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, idx) => (
                <tr key={customer._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                  <td className="border border-gray-300 p-2 font-bold text-gray-600 sticky left-0 bg-inherit z-10">{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                  <td className="border border-gray-300 p-2 font-bold text-blue-600">{customer.updateCount || 1}</td>
                  <td className="border border-gray-300 p-2">
                    {customer.isDuplicate ? (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">🔄 Dup</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">✨ New</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-xs whitespace-nowrap">
                    {customer.importedAt ? new Date(customer.importedAt).toLocaleString() : '-'}
                  </td>
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
                  <td className="border border-gray-300 p-2 text-center">{customer.numberOfMembers || '-'}</td>
                  <td className="border border-gray-300 p-2">{customer.policyCertificateNo || '-'}</td>
                  <td className="border border-gray-300 p-2">{customer.intermediaryCode}</td>
                  <td className="border border-gray-300 p-2">{customer.intermediaryName}</td>
                  <td className="border border-gray-300 p-2">{customer.intermediaryClassification}</td>
                  <td className="border border-gray-300 p-2">{customer.salesManagerCode}</td>
                  <td className="border border-gray-300 p-2">{customer.salesManagerName}</td>
                  <td className="border border-gray-300 p-2">{customer.latestTeamName}</td>
                  <td className="border border-gray-300 p-2">{customer.premiumMode}</td>
                  <td className="border border-gray-300 p-2 text-right font-medium text-green-700">₹{customer.netPremium}</td>
                  <td className="border border-gray-300 p-2 text-right font-medium text-green-700">₹{customer.grossPremium}</td>
                  <td className="border border-gray-300 p-2 text-right font-medium">₹{customer.applicableSumInsured}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls - Bottom */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Page <strong>{pagination.page}</strong> of <strong>{pagination.pages}</strong>
            {loading && <span className="ml-4 text-blue-600">Loading...</span>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏮ First
            </button>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <div className="px-4 py-2 bg-gray-100 rounded font-medium">
              Page {pagination.page}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
            <button
              onClick={() => handlePageChange(pagination.pages)}
              disabled={pagination.page >= pagination.pages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last ⏭
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tips:</strong>
        </p>
        <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
          <li>Scroll horizontally to see all 39 Excel columns</li>
          <li>Click "Export Page to CSV" to download current page data</li>
          <li>Use pagination buttons to navigate through all {pagination.total} records</li>
          <li>Each page shows up to 100 customers for optimal performance</li>
        </ul>
      </div>
    </div>
  );
};

export default AllData;
