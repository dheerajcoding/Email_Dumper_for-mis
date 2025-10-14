import React, { useState } from 'react';
import { syncAPI } from '../services/api';

const Settings = () => {
  const [authUrl, setAuthUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const getGmailAuthUrl = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const response = await syncAPI.getAuthUrl();
      const url = response.data.data.authUrl;
      setAuthUrl(url);
      
      // Open in new window
      window.open(url, '_blank', 'width=600,height=600');
      
      setMessage({
        type: 'info',
        text: 'Please complete the authentication in the popup window. After authorization, you will receive a refresh token that should be added to the backend .env file.'
      });
    } catch (error) {
      console.error('Error getting auth URL:', error);
      setMessage({
        type: 'error',
        text: 'Failed to get authentication URL. Please check your configuration.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gmail Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📧 Gmail Configuration</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Connect your Gmail account to automatically fetch Excel attachments.
            </p>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              onClick={getGmailAuthUrl}
              disabled={loading}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {loading ? '⏳ Loading...' : '🔗 Connect Gmail Account'}
            </button>

            {authUrl && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Authorization URL:</p>
                <a
                  href={authUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 break-all hover:underline"
                >
                  {authUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🛠️ Setup Instructions</h2>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Step 1: Google Cloud Setup</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Cloud Console</a></li>
                <li>Create a new project or select existing one</li>
                <li>Enable Gmail API</li>
                <li>Create OAuth 2.0 credentials</li>
                <li>Add authorized redirect URI: <code className="bg-gray-100 px-1">http://localhost:5000/oauth2callback</code></li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Step 2: Backend Configuration</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Copy Client ID and Client Secret from Google Cloud</li>
                <li>Add them to backend <code className="bg-gray-100 px-1">.env</code> file</li>
                <li>Click "Connect Gmail Account" above</li>
                <li>Complete the OAuth flow</li>
                <li>Copy the refresh token to <code className="bg-gray-100 px-1">.env</code></li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Step 3: Test</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Restart the backend server</li>
                <li>Send a test email with Excel attachment to your Gmail</li>
                <li>Click "Sync Now" on the dashboard</li>
                <li>Check if data is imported successfully</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Environment Variables</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <pre className="text-gray-700">
{`# Backend .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/emaildumper

# Gmail OAuth2
GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=http://localhost:5000/oauth2callback
GMAIL_REFRESH_TOKEN=your_refresh_token

# Gmail User
GMAIL_USER=your-email@gmail.com

# Cron (every 5 minutes)
CRON_SCHEDULE=*/5 * * * *`}
            </pre>
          </div>
        </div>

        {/* Cron Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⏰ Automatic Sync Schedule</h2>
          
          <div className="space-y-3">
            <p className="text-gray-600">
              The system automatically checks for new emails with Excel attachments every 5 minutes.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Current Schedule:</h3>
              <p className="text-blue-700">Every 5 minutes (*/5 * * * *)</p>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold">Other schedule options:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code className="bg-gray-100 px-1">*/10 * * * *</code> - Every 10 minutes</li>
                <li><code className="bg-gray-100 px-1">*/15 * * * *</code> - Every 15 minutes</li>
                <li><code className="bg-gray-100 px-1">0 * * * *</code> - Every hour</li>
                <li><code className="bg-gray-100 px-1">0 */2 * * *</code> - Every 2 hours</li>
              </ul>
              <p className="mt-2">
                To change the schedule, update <code className="bg-gray-100 px-1">CRON_SCHEDULE</code> in the backend .env file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
