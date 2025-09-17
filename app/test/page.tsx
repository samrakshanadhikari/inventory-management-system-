"use client";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-4">If you can see this, the app is working!</p>
        <div className="space-y-2">
          <button onClick={() => window.location.href = '/'} className="block text-blue-600 hover:text-blue-800">Go to Home</button>
          <button onClick={() => window.location.href = '/dashboard'} className="block text-blue-600 hover:text-blue-800">Go to Dashboard</button>
          <button onClick={() => window.location.href = '/auth/signin'} className="block text-blue-600 hover:text-blue-800">Go to Sign In</button>
        </div>
      </div>
    </div>
  );
}
