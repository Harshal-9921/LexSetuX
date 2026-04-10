import React from 'react';
import { PrecedentsPanel } from '@/components/PrecedentsPanel';

const PrecedentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📚 Supreme Court Precedents Database
          </h1>
          <p className="text-lg text-gray-600">
            Search and analyze 26,285 Supreme Court judgments spanning 75 years (1950-2024)
          </p>
        </div>

        {/* Precedents Panel */}
        <PrecedentsPanel />

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Comprehensive Database</h3>
            <p className="text-sm text-blue-800">
              Access all 26,285 Supreme Court judgments from 1950 to 2024. All cases are indexed and searchable.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">🔍 Advanced Search</h3>
            <p className="text-sm text-green-800">
              Search by case name, parties, or keywords. Filter by year range and specific legal sections.
            </p>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">⚖️ Legal Sections</h3>
            <p className="text-sm text-orange-800">
              Find cases by IPC sections, Constitutional articles, or specific acts. Auto-extracted from judgments.
            </p>
          </div>
        </div>

        {/* Popular Sections */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Legal Sections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: '498A', name: 'Dowry Prohibition', icon: '💔' },
              { code: '302', name: 'Murder', icon: '⚖️' },
              { code: '304', name: 'Culpable Homicide', icon: '📋' },
              { code: '21', name: 'Right to Life', icon: '✨' },
              { code: '25', name: 'Equality', icon: '⚡' },
              { code: '370', name: 'Kashmir Special', icon: '🏛️' },
              { code: '377', name: 'Sexuality', icon: '🌈' },
              { code: '420', name: 'Cheating', icon: '🚨' },
            ].map((section) => (
              <button
                key={section.code}
                onClick={() => {
                  const element = document.querySelector('[class*="PrecedentsPanel"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition text-left"
              >
                <div className="text-2xl mb-2">{section.icon}</div>
                <div className="font-bold text-gray-900">{section.code}</div>
                <div className="text-xs text-gray-600">{section.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Tips for Effective Searching</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Search Techniques:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Use full case names or party names</li>
                <li>✓ Search by specific keywords (e.g., "dowry", "custody")</li>
                <li>✓ Filter by year range to find recent or historical cases</li>
                <li>✓ Browse by legal section for targeted research</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How to Use Results:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Click to expand case details</li>
                <li>✓ View applicable legal sections and keywords</li>
                <li>✓ Reference case citations in your research</li>
                <li>✓ Use as precedents in your analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecedentsPage;
