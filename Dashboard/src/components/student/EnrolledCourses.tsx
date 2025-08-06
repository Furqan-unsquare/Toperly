import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  Clock,
  Play,
  BookOpen,
  Calendar,
  Filter,
  TrendingUp,
  Award,
} from "lucide-react";

interface Course {
  _id: string;
  customId: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
  };
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: number;
  thumbnail?: {
    url: string;
    filename: string;
  };
  videos: Array<{
    title: string;
    duration: number;
    order: number;
  }>;
  rating: number;
  totalReviews: number;
  enrolledStudents: string[];
  createdAt: string;
}

const EnrolledCourses = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    if (user?.role === "student") {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/enroll/my-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const studentData = await response.json();

        const studentEnrolledCourses = studentData?.map((entry: any) => ({
          ...entry?.course,
          enrolledAt: entry?.enrolledAt,
          progress: entry?.progress,
          completedLessons: entry?.completedLessons,
          certificateIssued: entry?.certificateIssued,
        }));

        setEnrolledCourses(studentEnrolledCourses);

        const uniqueCategories = [
          ...new Set(
            studentEnrolledCourses
              ?.map((course: Course) => course?.category)
              .filter(Boolean)
          ),
        ];
        setCategories(uniqueCategories);
      } else {
        console.error("Failed to fetch student data");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      searchTerm === "" ||
      course?.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      course?.description?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      course?.instructor?.name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || course?.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "" || course?.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200">
      {/* Course Thumbnail */}
      <div className="relative h-44 bg-gray-100">
        {course?.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt={course?.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Play size={32} className="text-gray-400" />
          </div>
        )}

        {/* Enrolled Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-medium border border-green-200">
            Enrolled
          </span>
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
              course?.level === "beginner"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : course?.level === "intermediate"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {course?.level}
          </span>
        </div>

        {/* Continue Learning Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <button
            onClick={() => navigate(`/courses/${course?._id}`)}
            className="bg-white text-gray-800 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Course Title */}
        <h3 className="font-semibold text-lg text-gray-900 mb-3 leading-tight line-clamp-2">
          {course?.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center mb-4">
          <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center mr-2.5">
            <span className="text-xs font-semibold text-gray-600">
              {course?.instructor?.name?.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {course?.instructor?.name}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
          <div className="flex items-center">
            <Clock size={14} className="mr-1.5" />
            <span>{course?.duration || 0}h</span>
          </div>
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1.5" />
            <span>{course?.videos?.length || 0} lessons</span>
          </div>
          <div className="flex items-center">
            <Star size={14} className="text-amber-400 fill-current mr-1" />
            <span className="font-medium">{course?.rating || 0}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/courses/${course?._id}`)}
            className="flex-1 bg-gray-900 text-white py-2.5 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium text-sm"
          >
            Continue Learning
          </button>
          <button
            onClick={() => navigate(`/courses/${course?._id}`)}
            className="px-3 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            <BookOpen size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!user?.role || user?.role !== "student") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            My Enrolled Courses
          </h2>
          <p className="text-gray-600 mt-1">
            {enrolledCourses?.length} course
            {enrolledCourses?.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="font-medium">Learning Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-green-600" />
            <span className="font-medium">Certificates</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      ) : filteredCourses?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          {enrolledCourses?.length === 0 ? (
            <>
              <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No enrolled courses
              </h3>
              <p className="text-gray-500 mb-6">
                Start your learning journey by enrolling in your first course
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                Browse Courses
              </button>
            </>
          ) : (
            <>
              <Filter size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No courses match your filters
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses?.map((course) => (
            <CourseCard key={course?._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
