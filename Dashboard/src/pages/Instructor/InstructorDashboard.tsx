import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  Users,
  Star,
  TrendingUp,
  Calendar,
  MessageSquare,
  ChevronRight,
  User,
  PlusCircle,
  DollarSign,
} from "lucide-react";
import axios from "axios";

interface InstructorData {
  profile: any;
  courses: any[];
  reviews: any[];
  certificatesIssued: any[];
}

const InstructorDashboard = () => {
  const [data, setData] = useState<InstructorData | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch instructor data and enrollments
  const fetchInstructorData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      // Fetch profile data
      const profileResponse = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      // Fetch enrollment data
      const enrollmentResponse = await axios.post(
        `${API_BASE}/api/students/get-mystudents`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(profileResponse.data);
      setEnrollments(enrollmentResponse.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, [API_BASE]);

  // Process courses with metrics
  const coursesWithMetrics = useMemo(() => {
    if (!enrollments.length || !data?.courses) return [];

    const courseMap = {};
    data.courses.forEach((course) => {
      courseMap[course._id] = {
        id: course._id,
        name: course.title || "Untitled Course",
        customId: course.customId || "N/A",
        category: course.category || "Uncategorized",
        price: course.price || 0,
        students: 0,
        revenue: 0,
        rating: course.rating || 0,
        status: course.isPublished || "draft",
        duration: course.duration || "N/A",
      };
    });

    enrollments.forEach((enrollment) => {
      const courseId = enrollment.course?._id;
      if (courseMap[courseId]) {
        courseMap[courseId].students += 1;
        if (enrollment.paymentDetails?.status === "completed") {
          courseMap[courseId].revenue += (enrollment.paymentDetails.amount || 0) / 100;
        }
      }
    });

    return Object.values(courseMap);
  }, [enrollments, data]);

  // Calculate total metrics
  const totalMetrics = useMemo(() => {
    if (!coursesWithMetrics.length) {
      return { totalRevenue: 0, totalStudents: 0, avgRating: "0", totalCourses: 0 };
    }

    const totalRevenue = coursesWithMetrics.reduce((sum, course) => sum + course.revenue, 0) * 100;
    const totalStudents = coursesWithMetrics.reduce((sum, course) => sum + course.students, 0);
    const avgRating = data?.reviews?.length
      ? (data.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / data.reviews.length).toFixed(1)
      : "0";
    const totalCourses = coursesWithMetrics.length;

    return { totalRevenue, totalStudents, avgRating, totalCourses };
  }, [coursesWithMetrics, data]);

  // Format currency for INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: "Total Courses",
      value: totalMetrics.totalCourses,
      icon: BookOpen,
    },
    {
      title: "Total Students",
      value: formatNumber(totalMetrics.totalStudents),
      icon: Users,
    },
    {
      title: "Average Rating",
      value: totalMetrics.avgRating,
      icon: Star,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalMetrics.totalRevenue),
      icon: DollarSign,
    },
  ];

  return (
    <div className="bg-gray-100 h-screen p-6 space-y-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome back, {data.profile.name || "Instructor"}
                </h1>
                <p className="text-gray-600">
                  Manage your courses and track student progress
                </p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              <PlusCircle className="w-4 h-4" />
              <span>Create Course</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Courses
                  </h2>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                {coursesWithMetrics.length > 0 ? (
                  <div className="space-y-4">
                    {coursesWithMetrics.slice(0, 3).map((course, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {course.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatNumber(course.students)} students enrolled
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {course.status === "approved" ? "Active" : course.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(course.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {course.duration} hours
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No courses created yet</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Create your first course to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reviews */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Recent Reviews</h3>
              </div>
              <div className="p-6">
                {data.reviews?.length > 0 ? (
                  <div className="space-y-4">
                    {data.reviews.slice(0, 2).map((review, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-100 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (review.rating || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          "{review.comment?.substring(0, 80) || "Great course!"}
                          ..."
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.student?.name || "Anonymous"} •{" "}
                          {review.course?.title || "Course"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No reviews yet</p>
                  </div>
                )}
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;