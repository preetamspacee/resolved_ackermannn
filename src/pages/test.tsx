import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-xl text-gray-600">This is a simple test page to verify the app is working.</p>
        <div className="mt-8">
          <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Go to Welcome Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
