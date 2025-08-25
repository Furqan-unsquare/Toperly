import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, TrendingUp, DollarSign, BookOpen, Users, Star, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const InstructorRevenueDashboard = () => {
  // State management
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('students');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // API Base URL
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        `${API_BASE_URL}/students/get-mystudents`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const enrollmentData = response.data.data || [];
      console.log('Fetched enrollments:', enrollmentData);
      setEnrollments(enrollmentData);
      setLastRefresh(new Date());
    } catch (error) {
      setError('Failed to load dashboard data. Please ensure you are logged in and the API server is running.');
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Process courses from enrollments
  const coursesWithMetrics = useMemo(() => {
    if (!enrollments.length) return [];

    const courseMap = {};
    enrollments.forEach(enrollment => {
      const course = enrollment.course || {};
      const courseId = course._id || 'unknown';
      const payment = enrollment.paymentDetails || {};
      if (!courseMap[courseId]) {
        courseMap[courseId] = {
          id: courseId,
          name: course.title || 'Untitled Course',
          customId: course.customId || 'N/A',
          category: enrollment.category || course.category || 'Uncategorized',
          price: payment.amount ? payment.amount : 0,
          students: 0,
          revenue: 0,
          rating: course.rating || 0,
        };
      }
      courseMap[courseId].students += 1;
      if (payment.status === 'completed') {
        courseMap[courseId].revenue += (payment.amount || 0) / 100;
      }
    });

    return Object.values(courseMap);
  }, [enrollments]);

  // Course revenue data for bar chart
  const courseRevenueChartData = useMemo(() => {
    const topCourses = coursesWithMetrics
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Show top 10 courses to avoid cluttering

    return {
      labels: topCourses.map(course => course.name.length > 20 ? course.name.substring(0, 20) + '...' : course.name),
      datasets: [
        {
          label: 'Revenue (₹)',
          data: topCourses.map(course => course.revenue),
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [coursesWithMetrics]);

  // Category distribution data for pie chart
  const categoryDistributionChartData = useMemo(() => {
    if (!coursesWithMetrics.length) return { labels: [], datasets: [] };

    const categoryRevenue = {};
    coursesWithMetrics.forEach(course => {
      const category = course.category || 'Uncategorized';
      categoryRevenue[category] = (categoryRevenue[category] || 0) + course.revenue;
    });

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

    return {
      labels: Object.keys(categoryRevenue),
      datasets: [
        {
          data: Object.values(categoryRevenue),
          backgroundColor: COLORS.slice(0, Object.keys(categoryRevenue).length),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }, [coursesWithMetrics]);

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Courses by Revenue',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Revenue: ₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (₹)',
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Courses',
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Revenue Distribution by Category',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    if (!coursesWithMetrics.length) return [];

    let filtered = coursesWithMetrics.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.customId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField] || 0;
      const bVal = b[sortField] || 0;
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (aVal > bVal ? 1 : -1) * multiplier;
    });

    return filtered;
  }, [coursesWithMetrics, searchTerm, sortField, sortDirection, filterCategory]);

  // Calculate total metrics
  const totalMetrics = useMemo(() => {
    if (!coursesWithMetrics.length) {
      return { totalRevenue: 0, totalStudents: 0, avgRating: 0, topCourse: null };
    }

    const totalRevenue = coursesWithMetrics.reduce((sum, course) => sum + course.revenue, 0);
    const totalStudents = coursesWithMetrics.reduce((sum, course) => sum + course.students, 0);
    const avgRating = coursesWithMetrics.reduce((sum, course) => sum + course.rating, 0) / coursesWithMetrics.length;
    const topCourse = coursesWithMetrics.reduce((top, course) => 
      course.students > (top?.students || 0) ? course : top, null);

    return { totalRevenue, totalStudents, avgRating, topCourse };
  }, [coursesWithMetrics]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    return [...new Set(coursesWithMetrics.map(course => course.category))].filter(Boolean);
  }, [coursesWithMetrics]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching your revenue data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Make sure you are logged in and the API server is running on Live API
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Track your course performance and revenue insights
                <span className="text-sm text-gray-500 ml-2">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMetrics.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">Live Data</span>
              <span className="text-gray-500 ml-1">of Courses</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalMetrics.totalStudents)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Across {coursesWithMetrics.length} courses</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{coursesWithMetrics.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Avg rating:</span>
              <Star className="w-4 h-4 text-yellow-400 mx-1 fill-current" />
              <span className="text-gray-900 font-medium">{totalMetrics.avgRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Course</p>
                <p className="text-lg font-bold text-gray-900 truncate">{totalMetrics.topCourse?.name || 'No data'}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Students: </span>
              <span className="text-sm font-medium text-gray-900">{formatNumber(totalMetrics.topCourse?.students || 0)}</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Course Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Course</h3>
            {courseRevenueChartData.labels.length > 0 ? (
              <div style={{ height: '300px' }}>
                <Bar data={courseRevenueChartData} options={barChartOptions} />
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No course revenue data available</p>
              </div>
            )}
          </div>

          {/* Revenue by Category Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Distribution by Category</h3>
            {categoryDistributionChartData.labels.length > 0 ? (
              <div style={{ height: '300px' }}>
                <Pie data={categoryDistributionChartData} options={pieChartOptions} />
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No category data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Revenue Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Course Performance Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Course Name
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('customId')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Course ID
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Category
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('students')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Students
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('price')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Price
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('revenue')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Total Revenue
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('rating')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Rating
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedCourses.length > 0 ? (
                  filteredAndSortedCourses.map((course, index) => (
                    <tr key={course.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{course.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.customId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(course.students)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(course.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(course.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {course.rating.toFixed(1)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      {enrollments.length === 0 ? 'No courses found in API' : 'No courses match your search criteria'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Courses */}
        {coursesWithMetrics.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Courses</h3>
            <div className="space-y-4">
              {coursesWithMetrics
                .sort((a, b) => b.students - a.students)
                .slice(0, 3)
                .map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-500">{course.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatNumber(course.students)} students</p>
                      <p className="text-sm text-gray-500">{formatCurrency(course.revenue)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorRevenueDashboard;
