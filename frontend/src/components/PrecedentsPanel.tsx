import React, { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { PDFViewer } from './PDFViewer';

interface Precedent {
  id: number;
  case_name: string;
  year: number;
  parties: string;
  court: string;
  summary: string;
  pdf_file: string;
  keywords: string[];
  sections: string[];
  citation: string;
}

interface PrecedentsStats {
  total_precedents: number;
  year_range: { from: number; to: number };
  by_decade: Record<string, number>;
}

interface PrecedentsPanelProps {
  searchQuery?: string;
  onPrecedentSelect?: (precedent: Precedent) => void;
}

export const PrecedentsPanel: React.FC<PrecedentsPanelProps> = ({
  searchQuery = '',
  onPrecedentSelect,
}) => {
  const [precedents, setPrecedents] = useState<Precedent[]>([]);
  const [stats, setStats] = useState<PrecedentsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [yearFilter, setYearFilter] = useState<{from?: number; to?: number}>({});
  const [sectionFilter, setSectionFilter] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [selectedPDFId, setSelectedPDFId] = useState<number | null>(null);
  const [selectedPDFName, setSelectedPDFName] = useState<string>('');

  const pageSize = 50;

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: PrecedentsStats = await apiClient.getPrecedentStats();
        setStats(response);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Fetch precedents based on filters
  const fetchPrecedents = async (pageNum: number = 0) => {
    setLoading(true);
    try {
      let response: Precedent[] = [];

      if (sectionFilter) {
        // Search by section
        response = await apiClient.getPrecedentsBySection(sectionFilter, 500);
      } else if (searchTerm) {
        // Search with query
        response = await apiClient.searchPrecedents(searchTerm, 500, yearFilter.from, yearFilter.to);
      } else {
        // Default: get all recent precedents
        response = await apiClient.listPrecedents(0, 500);
      }
      
      setPrecedents(response);
      setTotalResults(response.length);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error fetching precedents:', error);
      setPrecedents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchPrecedents(0);
  };

  // Get paginated results
  const paginatedResults = precedents.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  const totalPages = Math.ceil(precedents.length / pageSize);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            📚 Legal Precedents Database
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {stats ? `${stats.total_precedents.toLocaleString()} cases (1950-2024)` : 'Loading...'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cases by name, parties, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>

          {/* Year Filter */}
          <div className="flex gap-2">
            <input
              type="number"
              min="1950"
              max="2024"
              placeholder="From Year"
              value={yearFilter.from || ''}
              onChange={(e) =>
                setYearFilter({ ...yearFilter, from: e.target.value ? parseInt(e.target.value) : undefined })
              }
              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              min="1950"
              max="2024"
              placeholder="To Year"
              value={yearFilter.to || ''}
              onChange={(e) =>
                setYearFilter({ ...yearFilter, to: e.target.value ? parseInt(e.target.value) : undefined })
              }
              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Section Filter */}
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">All Sections</option>
            <option value="498A">Dowry (498A)</option>
            <option value="302">Murder (302)</option>
            <option value="304">Culpable Homicide (304)</option>
            <option value="404">Cheating (420)</option>
            <option value="21">Right to Life (Article 21)</option>
            <option value="25">Equality (Article 25)</option>
          </select>

          <button
            onClick={() => {
              setYearFilter({});
              setSectionFilter('');
              setSearchTerm('');
              setPrecedents([]);
            }}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {totalResults > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            Found <strong>{totalResults.toLocaleString()}</strong> relevant precedents
            {searchTerm && ` for "${searchTerm}"`}
            {sectionFilter && ` related to section ${sectionFilter}`}
          </p>
        </div>
      )}

      {/* Precedents List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-600 mt-2">Loading precedents...</p>
          </div>
        ) : paginatedResults.length > 0 ? (
          <>
            {paginatedResults.map((precedent, index) => (
              <div
                key={precedent.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div
                  className="cursor-pointer flex items-start justify-between"
                  onClick={() => setExpandedId(expandedId === precedent.id ? null : precedent.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">
                        {((currentPage * pageSize) + index + 1).toString().padStart(3, '0')}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                        {precedent.case_name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                      <span className="font-semibold">
                        {precedent.court} • {precedent.year}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {precedent.citation}
                      </span>
                      {precedent.keywords && precedent.keywords.length > 0 && (
                        <span className="text-xs">
                          🏷️ {precedent.keywords.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(expandedId === precedent.id ? null : precedent.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedId === precedent.id ? (
                      <ChevronUp size={20} className="text-gray-600" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedId === precedent.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {/* Parties */}
                    {precedent.parties && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">PARTIES:</p>
                        <p className="text-sm text-gray-700">{precedent.parties}</p>
                      </div>
                    )}

                    {/* Summary */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">JUDGMENT SUMMARY:</p>
                      <p className="text-sm text-gray-700 line-clamp-4">
                        {precedent.summary}
                      </p>
                    </div>

                    {/* Sections */}
                    {precedent.sections && precedent.sections.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">APPLICABLE SECTIONS:</p>
                        <div className="flex flex-wrap gap-2">
                          {precedent.sections.map((section, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSectionFilter(section)}
                              className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 cursor-pointer"
                            >
                              Section {section}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Keywords */}
                    {precedent.keywords && precedent.keywords.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">KEYWORDS:</p>
                        <div className="flex flex-wrap gap-2">
                          {precedent.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => onPrecedentSelect?.(precedent)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        ✓ Use as Reference
                      </button>
                      {precedent.pdf_file && (
                        <button
                          onClick={() => {
                            setSelectedPDFId(precedent.id);
                            setSelectedPDFName(precedent.case_name);
                          }}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          📄 View PDF
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                  <span className="ml-2">
                    ({((currentPage * pageSize) + 1)}-
                    {Math.min((currentPage + 1) * pageSize, precedents.length)} of {precedents.length})
                  </span>
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : precedents.length === 0 && !loading && (searchTerm || sectionFilter) ? (
          <div className="text-center py-8 text-gray-600">
            <p>No precedents found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSectionFilter('');
                setYearFilter({});
                fetchPrecedents();
              }}
              className="mt-2 text-blue-600 hover:underline"
            >
              Reset and try again
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>Start by searching for a case or applying filters above.</p>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      {stats && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-gray-800 mb-3">Database Distribution by Decade:</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(stats.by_decade).map(([decade, count]) => (
              <div key={decade} className="bg-gradient-to-b from-blue-50 to-blue-100 p-3 rounded">
                <p className="text-xs font-semibold text-gray-600">{decade}</p>
                <p className="text-lg font-bold text-blue-600">{(count as number).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPDFId && (
        <PDFViewer
          precedentId={selectedPDFId}
          caseName={selectedPDFName}
          isOpen={selectedPDFId !== null}
          onClose={() => {
            setSelectedPDFId(null);
            setSelectedPDFName('');
          }}
        />
      )}
    </div>
  );
};

export default PrecedentsPanel;
