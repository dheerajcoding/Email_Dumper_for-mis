import React, { useState } from 'react';
import { customerAPI } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (ext === 'xlsx' || ext === 'xls') {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError('Please select a valid Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setResult(null);

      const response = await customerAPI.uploadExcel(file);
      setResult(response.data.data);
      setFile(null);
      
      // Reset file input
      document.getElementById('file-input').value = '';
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const ext = droppedFile.name.split('.').pop().toLowerCase();
      if (ext === 'xlsx' || ext === 'xls') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please drop a valid Excel file (.xlsx or .xls)');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Excel File</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upload File</h2>
          
          <form onSubmit={handleUpload}>
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
            >
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600 mb-2">
                Drag and drop your Excel file here, or click to browse
              </p>
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('file-input').click()}
                className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Browse Files
              </button>
            </div>

            {/* Selected File */}
            {file && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-600">Selected file:</p>
                <p className="font-semibold text-green-800">{file.name}</p>
                <p className="text-sm text-gray-500">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
                {error}
              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={!file || uploading}
              className={`w-full mt-6 px-6 py-3 rounded-lg font-medium transition-colors ${
                !file || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {uploading ? '📤 Uploading...' : '📤 Upload & Process'}
            </button>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">📋 Required Columns</h3>
              <p className="text-sm text-gray-600 mb-2">
                Your Excel file should contain the following columns:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><strong>ProposalNo</strong> (or Proposal No, ID) - Required</li>
                <li><strong>CustomerName</strong> (or Customer Name, Name)</li>
                <li><strong>Status</strong></li>
                <li><strong>Remarks</strong> (or Comments, Notes)</li>
                <li><strong>Date</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">✅ What Happens</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>New records will be created if they don't exist</li>
                <li>Existing records will be updated</li>
                <li>Old versions are saved in history</li>
                <li>You can track all changes over time</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">📝 Tips</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Use .xlsx or .xls format</li>
                <li>Maximum file size: 10MB</li>
                <li>First row should contain column headers</li>
                <li>ProposalNo must be unique for each customer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Result */}
      {result && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{result.totalRecords}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-2xl font-bold text-green-600">{result.created}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Updated</p>
              <p className="text-2xl font-bold text-yellow-600">{result.updated}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Unchanged</p>
              <p className="text-2xl font-bold text-gray-600">{result.unchanged}</p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-red-600 mb-2">Errors:</h3>
              <div className="bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                {result.errors.map((err, index) => (
                  <p key={index} className="text-sm text-red-700">
                    {err.proposalNo}: {err.error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
