import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface Material {
  title: string;
  filename: string;
  url: string;
  bunnyFileId: string;
  type: 'pdf' | 'image' | 'document';
}

interface MaterialProps {
  materials: Material[];
  isEnrolled: boolean;
  showToast: (text: string, type?: string) => void;
}

const Material = ({ materials, isEnrolled, showToast }: MaterialProps) => {
  const handleDownload = (url: string, filename: string) => {
    if (!isEnrolled) {
      showToast('You must be enrolled to access materials', 'error');
      return;
    }

    try {
      window.open(url, '_blank');
      showToast(`Opening ${filename}`, 'success');
    } catch (err) {
      showToast('Failed to open material', 'error');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'image':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!materials?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Course Materials</h3>
        </div>
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600">No materials available for this course.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">Course Materials</h3>
        <p className="text-sm text-gray-600 mt-1">{materials.length} files available</p>
      </div>

      {/* Materials List */}
      <div className="divide-y divide-gray-200">
        {materials.map((material, index) => (
          <div
            key={material.bunnyFileId || index}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(material.type)}
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {material.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {material.type}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {material.filename}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleDownload(material.url, material.filename)}
                disabled={!isEnrolled}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                  isEnrolled
                    ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100'
                    : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                {isEnrolled ? 'View' : 'Locked'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer for Non-enrolled Users */}
      {!isEnrolled && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Enroll to access all course materials and resources
          </p>
        </div>
      )}
    </div>
  );
};

export default Material;
