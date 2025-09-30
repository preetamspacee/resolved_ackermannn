import React from 'react';
import Link from 'next/link';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">ACK</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">ACKERMANN</h1>
              <p className="text-xs text-gray-500 font-medium">Enterprise Workflow Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-50">
                Sign In
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 rounded-full text-blue-700 font-semibold text-sm border border-blue-200/50 shadow-sm">
                🚀 Trusted by 250+ Fortune 500 Companies
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Enterprise
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                  Workflow Platform
                </span>
                <span className="text-4xl lg:text-5xl text-gray-700 font-medium">
                  Powered by AI
                </span>
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
              Transform your business operations with our comprehensive ACKERMANN platform. 
              <span className="font-semibold text-gray-800">201 active tickets, 79 client accounts, 1,128 IT assets</span> - 
              all managed intelligently with AI automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Free Trial
                </button>
              </Link>
              
              <Link href="/login">
                <button className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-3">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
