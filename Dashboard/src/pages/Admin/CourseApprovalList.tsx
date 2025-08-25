import React, { useEffect, useState } from "react";
import {
  Clock,
  Users,
  BookOpen,
  Calendar,
  Check,
  X,
  Clock3,
  MoreVertical,
  Search,
  Filter,
  ChevronDown,
  Star,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminCourseApprovalList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const API_BASE = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchCourses();
  }, []); 

  const fetchCourses = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/api/courses`, {
        headers,
      });

      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCourseStatus = async (courseId, newStatus) => {
    try {
      if (!token) {
        throw new Error("Authentication required to update course status");
      }
      const res = await fetch(
        `${API_BASE}/api/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update course status");

      setCourses(
        courses.map((course) =>
          course._id === courseId
            ? { ...course, isPublished: newStatus }
            : course
        )
      );
      setOpenMenuId(null);
      toast({
        title: "Success",
        description: `Course status updated to ${newStatus}.`,
      });
    } catch (err) {
      console.error("Error updating course status:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update course status.",
        variant: "destructive",
      });
    }
  };

  const updateCourseFlag = async (courseId, field, value) => {
    try {
      if (!token) {
        throw new Error("Authentication required to update course flags");
      }
      // Check limits
      if (field === "topRated" && value) {
        const count = courses.filter((c) => c.topRated).length;
        if (count >= 3) {
          toast({
            title: "Limit Reached",
            description: "Cannot set more than 3 courses as Top Rated.",
            variant: "destructive",
          });
          return;
        }
      }
      if (field === "inDemand" && value) {
        const count = courses.filter((c) => c.inDemand).length;
        if (count >= 10) {
          toast({
            title: "Limit Reached",
            description: "Cannot set more than 10 courses as In Demand.",
            variant: "destructive",
          });
          return;
        }
      }

     const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!res.ok) throw new Error("Failed to update course flag");

      const { course: updatedCourse } = await res.json();
      setCourses(
        courses.map((course) =>
          course._id === courseId ? updatedCourse : course
        )
      );
      setOpenMenuId(null);
      toast({
        title: "Success",
        description: `${field === "topRated" ? "Top Rated" : "In Demand"} flag updated.`,
      });
    } catch (err) {
      console.error("Error updating course flag:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update course flag.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "approved":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <Check className="w-4 h-4 mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <X className="w-4 h-4 mr-1" /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            <Clock3 className="w-4 h-4 mr-1" /> Pending
          </span>
        );
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    const matchesInstructor = selectedInstructor ? course.instructor?.name === selectedInstructor : true;
    const matchesStatus = selectedStatus ? course.isPublished === selectedStatus : true;
    const matchesFlag =
      selectedFlag === "topRated" ? course.topRated :
      selectedFlag === "inDemand" ? course.inDemand : true;
    return matchesSearch && matchesCategory && matchesInstructor && matchesStatus && matchesFlag;
  });

  const categories = [...new Set(courses.map((c) => c.category))];
  const instructors = [...new Set(courses.map((c) => c.instructor?.name))];

  const totalCourses = courses.length;
  const pendingCount = courses.filter((c) => c.isPublished === "pending").length;
  const approvedCount = courses.filter((c) => c.isPublished === "approved").length;
  const rejectedCount = courses.filter((c) => c.isPublished === "rejected").length;
  const topRatedCount = courses.filter((c) => c.topRated).length;
  const inDemandCount = courses.filter((c) => c.inDemand).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm p-4 h-80">
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Management
          </h1>
          <p className="text-gray-600">
            Review, approve, and manage course submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Top Rated</p>
            <p className="text-2xl font-bold text-blue-600">{topRatedCount}/3</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">In Demand</p>
            <p className="text-2xl font-bold text-purple-600">{inDemandCount}/10</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses by title, instructor, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <select
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Instructors</option>
                  {instructors.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Flags</label>
                <select
                  value={selectedFlag}
                  onChange={(e) => setSelectedFlag(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Flags</option>
                  <option value="topRated">Top Rated</option>
                  <option value="inDemand">In Demand</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
            <span className="font-semibold">{courses.length}</span> courses
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden group"
            >
              {/* Course Image */}
              <div className="relative ">
                <img
                  src={course.image || "/api/placeholder/400/250"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status badge on image */}
                <div className="absolute top-3 left-3">{getStatusBadge(course.isPublished)}</div>

                {/* Special flags */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  {course.topRated && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-yellow-500" /> Top
                    </span>
                  )}
                  {course.inDemand && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> Popular
                    </span>
                  )}
                </div>

                {/* Action menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === course._id ? null : course._id)}
                    className="p-1 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>

                  {openMenuId === course._id && (
                    <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg p-2 z-10 w-48 border border-gray-200">
                      <div className="space-y-1">
                        <button
                          onClick={() => updateCourseStatus(course._id, "approved")}
                          className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={course.isPublished === "approved"}
                        >
                          <Check className="w-4 h-4 mr-2 text-green-600" /> Approve Course
                        </button>
                        <button
                          onClick={() => updateCourseStatus(course._id, "rejected")}
                          className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={course.isPublished === "rejected"}
                        >
                          <X className="w-4 h-4 mr-2 text-red-600" /> Reject Course
                        </button>
                        <button
                          onClick={() => updateCourseStatus(course._id, "pending")}
                          className="w-full text-left px-3 py-2 hover:bg-amber-50 rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={course.isPublished === "pending"}
                        >
                          <Clock3 className="w-4 h-4 mr-2 text-amber-600" /> Set as Pending
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <label className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <input
                            type="checkbox"
                            checked={course.topRated}
                            onChange={(e) => updateCourseFlag(course._id, "topRated", e.target.checked)}
                            className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">Mark as Top Rated</span>
                        </label>
                        <label className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <input
                            type="checkbox"
                            checked={course.inDemand}
                            onChange={(e) => updateCourseFlag(course._id, "inDemand", e.target.checked)}
                            className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">Mark as In Demand</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Details */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">by {course.instructor?.name}</p>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}h</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{course.videos?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{(course.students || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    {course.category}
                  </span>

                 <button
      onClick={() => navigate(`/courses/${course._id}`)}
      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
    >
      View Details →
    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseApprovalList;