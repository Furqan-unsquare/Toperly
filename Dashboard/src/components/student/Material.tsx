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
      showToast(`Downloading ${filename}`, 'success');
    } catch (err) {
      showToast('Failed to download material', 'error');
    }
  };

  if (!materials?.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h3>
        <p className="text-gray-600">No materials available for this course.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h3>
      <div className="space-y-4">
        {materials.map((material, index) => (
          <div
            key={material.bunnyFileId || index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-blue-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">{material.title}</h4>
                <p className="text-xs text-gray-500 capitalize">{material.type}</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload(material.url, material.filename)}
              disabled={!isEnrolled}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                isEnrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Material;