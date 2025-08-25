import React, { useState, useEffect } from "react";
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
} from "lucide-react";

interface InstructorData {
  profile: any;
  courses: any[];
  reviews: any[];
  certificatesIssued: any[];
}

const InstructorDashboard = () => {
  const [data, setData] = useState<InstructorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchInstructorData();
  }, [API_BASE]);

  const fetchInstructorData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
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

  const averageRating =
    data.reviews.length > 0
      ? (
          data.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
          data.reviews.length
        ).toFixed(1)
      : "0";

  const totalEnrollments = data.courses.reduce(
    (acc, course) => acc + (course.enrollments || 0),
    0
  );

  const stats = [
    {
      title: "Total Courses",
      value: data.courses.length,
      icon: BookOpen,
    },
    {
      title: "Total Students",
      value: totalEnrollments,
      icon: Users,
    },
    {
      title: "Average Rating",
      value: averageRating,
      icon: Star,
    },
    {
      title: "Certificates Issued",
      value: data.certificatesIssued.length,
      icon: Star,
    },
  ];

  return (
    <div className="bg-gray-100  p-6 space-y-8">
      <div className="max-w-5xl mx-auto ">
        {/* Header */}
        <div className=" rounded-lg shadow-sm p-6">
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
                {data.courses.length > 0 ? (
                  <div className="space-y-4">
                    {data.courses.slice(0, 3).map((course, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {course.title || "Course Title"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {course.enrollments || 0} students enrolled
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {course.status || "Active"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${course.price || "0"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {course.duration || "N/A"} hours
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
                {data.reviews.length > 0 ? (
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

            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">
                  Performance Overview
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="font-medium text-gray-900">
                    {data.reviews.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="font-medium text-gray-900">
                    {averageRating}★
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Courses</span>
                  <span className="font-medium text-gray-900">
                    {data.courses.filter((c) => c.status !== "inactive").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Certificates Issued
                  </span>
                  <span className="font-medium text-gray-900">
                    {data.certificatesIssued.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { InstructorDashboard };
