import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, X, CreditCard, BookOpen, Clock, AlertCircle, RefreshCw, Download } from 'lucide-react';
import axios from 'axios';

const PaymentHistory = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptCourse, setReceiptCourse] = useState(null);
  const dropdownRef = useRef(null);


  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (courseId) => {
    setShowDropdown(showDropdown === courseId ? null : courseId);
  };

 const handleDownload = (course) => {
    console.log('Downloading receipt for:', course);
    setShowDropdown(null);
    
    // Create a new window with the receipt content
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      // Generate HTML for the receipt
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt { max-width: 500px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .title { font-weight: bold; margin-bottom: 5px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .divider { border-top: 1px dashed #ccc; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>Payment Receipt</h2>
              <p>${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="section">
              <div class="title">Course Information</div>
              <div class="row">
                <span>Course:</span>
                <span>${course?.course?.title || course?.title || 'Untitled Course'}</span>
              </div>
              <div class="row">
                <span>Category:</span>
                <span>${course?.category || 'Uncategorized'}</span>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="section">
              <div class="title">Payment Details</div>
              <div class="row">
                <span>Amount:</span>
                <span>${formatAmount(
                  course?.paymentDetails?.amount || course?.amount, 
                  course?.paymentDetails?.currency || course?.currency
                )}</span>
              </div>
              <div class="row">
                <span>Method:</span>
                <span>${course?.paymentDetails?.method || 'N/A'}</span>
              </div>
              <div class="row">
                <span>Date:</span>
                <span>${formatDate(course?.enrolledAt || course?.createdAt)}</span>
              </div>
              <div class="row">
                <span>Status:</span>
                <span>${course?.paymentDetails?.status || course?.status || 'completed'}</span>
              </div>
              <div class="row">
                <span>Payment ID:</span>
                <span>${course?.paymentDetails?.paymentId || 'N/A'}</span>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Write the HTML to the new window
      receiptWindow.document.write(receiptHTML);
      receiptWindow.document.close();
      
      // Give it a moment to render before printing
      setTimeout(() => {
        receiptWindow.print();
      }, 500);
    } else {
      alert('Popup blocked. Please allow popups for this site to download receipts.');
    }
  };

  const handleViewReceipt = (course) => {
    setReceiptCourse(course);
    setShowReceipt(true);
    setShowDropdown(null);
  }


  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get(
          `${API_BASE_URL}/enroll/my-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        let enrollmentData = response.data.data || response.data.courses || response.data || [];

        if (!Array.isArray(enrollmentData)) {
          console.warn('Data is not an array, converting...');
          enrollmentData = enrollmentData ? [enrollmentData] : [];
        }

        setCourses(enrollmentData);
        setFilteredCourses(enrollmentData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load payment history. Please ensure you are logged in and the API server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses || [];

    if (searchTerm && Array.isArray(filtered)) {
      filtered = filtered.filter(course => {
        const courseTitle = course?.course?.title || course?.title || '';
        const category = course?.category || '';
        const instructor = typeof course?.course?.instructor === 'object' 
          ? course?.course?.instructor?.name || course?.instructor?.name || '' 
          : course?.course?.instructor || course?.instructor || '';
        
        return (
          courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatAmount = (amount, currency = 'USD') => {
    if (!amount || isNaN(amount)) return 'N/A';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD'
      }).format(amount);
    } catch (error) {
      return `${currency || '$'} ${(amount).toFixed(2)}`;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'card': return '💳';
      case 'paypal': return '🅿️';
      case 'wallet': return '💰';
      case 'razorpay': return '💳';
      default: return '💳';
    }
  };

  const navigateToCourse = (courseId) => {
    console.log(`Navigating to course: ${courseId}`);
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg shadow">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Make sure you are logged in and the API server is running on LIve API
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Payment History</h1>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses && filteredCourses.length > 0 ? (
                  filteredCourses.map((course, index) => (
                    <tr 
                      key={course._id || course.id || index} 
                      className="hover:bg-gray-50 cursor-pointer" 
                      onClick={() => setSelectedCourse(course)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course?.course?.title || course?.title || 'Untitled Course'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course?.category || 'Uncategorized'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(course?.enrolledAt || course?.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {getPaymentMethodIcon(course?.paymentDetails?.method)}
                          </span>
                          {course?.paymentDetails?.method || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatAmount(
                          course?.paymentDetails?.amount || course?.amount, 
                          course?.paymentDetails?.currency || course?.currency
                        )}
                      </td>
                    
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No courses found. {courses.length === 0 ? 'No enrollments available.' : 'Try adjusting your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <div
                  key={course._id || course.id || index}
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 relative"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {course?.course?.title || course?.title || 'Untitled Course'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {course?.category || 'Uncategorized'}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {formatAmount(
                            course?.paymentDetails?.amount || course?.amount, 
                            course?.paymentDetails?.currency || course?.currency
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(course?.enrolledAt || course?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {courses.length === 0 ? 'No enrollments available.' : 'Try adjusting your search criteria.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Course Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Course Details</h2>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedCourse?.course?.title || selectedCourse?.title || 'Untitled Course'}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      by {typeof selectedCourse?.course?.instructor === 'object' 
                        ? selectedCourse?.course?.instructor?.name || selectedCourse?.instructor?.name || 'Unknown' 
                        : selectedCourse?.course?.instructor || selectedCourse?.instructor || 'Unknown'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedCourse?.category || 'Uncategorized'}
                      </span>
                      {selectedCourse?.course?.duration && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock className="w-3 h-3 mr-1" />
                          {selectedCourse.course.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Price: {formatAmount(
                        (selectedCourse?.course?.price || selectedCourse?.price || 0) * 100, 
                        selectedCourse?.paymentDetails?.currency || selectedCourse?.currency
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Payment ID:</span>
                      <p className="font-mono text-gray-900">
                        {selectedCourse?.paymentDetails?.paymentId || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Order ID:</span>
                      <p className="font-mono text-gray-900">
                        {selectedCourse?.paymentDetails?.orderId || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <p className="font-semibold text-gray-900">
                        {formatAmount(
                          selectedCourse?.paymentDetails?.amount || selectedCourse?.amount, 
                          selectedCourse?.paymentDetails?.currency || selectedCourse?.currency
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Method:</span>
                      <p className="text-gray-900 capitalize">
                        {selectedCourse?.paymentDetails?.method || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Enrolled:</span>
                      <p className="text-gray-900">
                        {formatDate(selectedCourse?.enrolledAt || selectedCourse?.createdAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="text-gray-900 capitalize">
                        {selectedCourse?.paymentDetails?.status || selectedCourse?.status || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigateToCourse(selectedCourse?.course?._id || selectedCourse?._id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue Course
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentHistory;