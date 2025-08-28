import React from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  actionButton
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          {type === 'success' ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-900 mb-2"> 
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
            
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  type === 'success' 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {actionButton.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
