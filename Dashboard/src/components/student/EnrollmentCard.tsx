import React from 'react';
import { Award, CreditCard, BookOpen } from 'lucide-react';

const EnrollmentCard = ({ course, isEnrolled, onEnroll, enrollmentLoading }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {course.price === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>{formatPrice(course.price)}</span>
          )}
        </div>
        {course.price > 0 && course.originalPrice && (
          <div className="text-sm text-gray-500 line-through">
            {formatPrice(course.originalPrice)}
          </div>
        )}
        {course.price > 0 && (
          <div className="text-sm text-red-600 font-medium mt-1">
            Limited time offer!
          </div>
        )}
      </div>

      {!isEnrolled ? (
        <button
          onClick={onEnroll}
          disabled={enrollmentLoading}
          className={`w-full py-3 rounded-lg mb-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            course.price === 0
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          } ${enrollmentLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
        >
          {enrollmentLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {course.price === 0 ? 'Enrolling...' : 'Processing...'}
            </>
          ) : (
            <>
              {course.price === 0 ? (
                <>
                  <BookOpen size={20} />
                  Enroll for Free
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Buy Now
                </>
              )}
            </>
          )}
        </button>
      ) : (
        <div className="text-center py-3 bg-green-100 text-green-800 rounded-lg mb-4 font-medium border-2 border-green-200">
          <div className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Successfully Enrolled
          </div>
        </div>
      )}

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center justify-center">
          <Award size={16} className="mr-2 text-yellow-500" />
          <span>Certificate of completion</span>
        </div>
        
        <div className="flex items-center justify-center">
          <BookOpen size={16} className="mr-2 text-blue-500" />
          <span>Lifetime access</span>
        </div>
        
        {course.price > 0 && (
          <div className="flex items-center justify-center">
            <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>30-day money-back guarantee</span>
          </div>
        )}

        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {course.price === 0 ? 'No credit card required' : 'Secure payment powered by Razorpay'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentCard;
