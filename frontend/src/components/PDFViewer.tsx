import React, { useState, useEffect } from 'react';
import { X, Download, AlertCircle } from 'lucide-react';

interface PDFViewerProps {
  precedentId: number;
  caseName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  precedentId,
  caseName,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfInfo, setPdfInfo] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadPDF();
    }
  }, [isOpen, precedentId]);

  const loadPDF = async () => {
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      // First, check PDF availability and get info
      const infoResponse = await fetch(`/api/precedents/pdf-info/${precedentId}`);
      
      if (!infoResponse.ok) {
        setError('PDF information not found');
        setLoading(false);
        return;
      }

      const info = await infoResponse.json();
      setPdfInfo(info);

      if (info.available && info.url) {
        // Load the PDF
        setPdfUrl(info.url);
      } else {
        setError(info.message || 'PDF is not available');
      }
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${caseName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{caseName}</h2>
            {pdfInfo?.citation && (
              <p className="text-sm text-gray-600">{pdfInfo.citation}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center max-w-md">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-800 font-semibold mb-2">PDF Not Available</p>
                <p className="text-gray-600 mb-4">{error}</p>
                {pdfInfo?.pdf_reference && (
                  <p className="text-sm text-gray-500">
                    Referenced as: {pdfInfo.pdf_reference}
                  </p>
                )}
                {pdfInfo?.summary && (
                  <div className="mt-6 p-4 bg-gray-50 rounded text-left">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Case Summary
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-4">
                      {pdfInfo.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              style={{ minHeight: '400px' }}
              title={caseName}
            />
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          {pdfUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download size={18} />
              Download PDF
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
