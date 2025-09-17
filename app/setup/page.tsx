"use client";

import { useState, useEffect } from 'react';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [dbStatus, setDbStatus] = useState<any>(null);

  useEffect(() => {
    checkDbStatus();
  }, []);

  const checkDbStatus = async () => {
    try {
      const response = await fetch('/api/setup');
      const data = await response.json();
      setDbStatus(data);
    } catch (error) {
      console.error('Failed to check database status:', error);
    }
  };

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      // Refresh database status after setup
      await checkDbStatus();
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Database Setup
        </h1>
        
        {dbStatus && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Database Status:</h3>
            <div className="text-sm text-gray-600">
              <p>Users: {dbStatus.users}</p>
              <p>Vendors: {dbStatus.vendors}</p>
              <p>Assets: {dbStatus.assets}</p>
              <p className={`font-semibold ${dbStatus.needsSetup ? 'text-red-600' : 'text-green-600'}`}>
                {dbStatus.needsSetup ? 'Setup Required' : 'Database Ready'}
              </p>
            </div>
          </div>
        )}
        
        <p className="text-gray-600 mb-6 text-center">
          {dbStatus?.needsSetup 
            ? 'Click the button below to set up the database with demo users.'
            : 'Database is already set up. You can still run setup to add more demo data.'
          }
        </p>
        
        <button
          onClick={handleSetup}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Setting up...' : 'Setup Database'}
        </button>
        
        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a 
            href="/auth/signin" 
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
}
