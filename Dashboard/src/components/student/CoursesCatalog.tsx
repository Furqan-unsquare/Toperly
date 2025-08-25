// components/CoursesCatalog.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Play,
  BookOpen,
  Heart,
  ChevronDown,
  Grid3X3,
  List,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CoursesCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel, sortBy]);

  // Client-side sorting function
  const sortCourses = (coursesToSort, sortType) => {
    const sorted = [...coursesToSort];

    switch (sortType) {
      case "latest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || b.updatedAt) -
            new Date(a.createdAt || a.updatedAt)
        );

      case "popular":
        return sorted.sort(
          (a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0)
        );

      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));

      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));

      case "rating":
        return sorted.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));

      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));

      default:
        return sorted;
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/courses`;
      const params = new URLSearchParams();

      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedLevel) params.append("level", selectedLevel);
      // Remove sort from API call since we'll handle it client-side
      // if (sortBy) params.append("sort", sortBy);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        let filteredCourses = data;

        // Filter by search term
        if (searchTerm) {
          filteredCourses = data.filter(
            (course) =>
              course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              course.category.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply client-side sorting
        const sortedCourses = sortCourses(filteredCourses, sortBy);
        setCourses(sortedCourses);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((course) => course.category)),
        ];
        setCategories(uniqueCategories);
      }

      // Fetch wishlist if user is logged in
      if (user?.id && token) {
        try {
          const res = await fetch(`${API_BASE}/wishlist/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setWishlist(data.map((course) => course._id));
          }
        } catch (wishlistError) {
          console.error("Error fetching wishlist:", wishlistError);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Separate useEffect for sorting existing courses without refetching
  useEffect(() => {
    if (courses.length > 0) {
      const sortedCourses = sortCourses(courses, sortBy);
      // Only update if the order actually changed
      if (JSON.stringify(sortedCourses) !== JSON.stringify(courses)) {
        setCourses(sortedCourses);
      }
    }
  }, [sortBy]);

  const CourseCard = ({ course, index }) => {
    const isWishlisted = wishlist.includes(course._id);

    const toggleWishlist = async () => {
      if (!user?.id) {
        navigate("/login");
        return;
      }

      const endpoint = `${API_BASE}/wishlist/${course._id}`;
      const method = isWishlisted ? "DELETE" : "POST";

      try {
        const res = await fetch(endpoint, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          setWishlist((prev) =>
            isWishlisted
              ? prev.filter((id) => id !== course._id)
              : [...prev, course._id]
          );
        }
      } catch (error) {
        console.error("Error updating wishlist:", error);
      }
    };

    return (
      <div
        className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
        style={{
          animationDelay: `${index * 100}ms`,
          animation: "fadeInUp 0.6s ease-out forwards",
          opacity: 0,
        }}
      >
        {/* Course Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {/* Wishlist Button */}
          {user?.id && (
            <button
              onClick={toggleWishlist}
              className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
            >
              <Heart
                size={16}
                className={
                  isWishlisted
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 hover:text-red-400"
                }
              />
            </button>
          )}

          {/* Course Image */}
          {course.thumbnail ? (
            <img
              src={course.thumbnail.url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="p-4 bg-white/80 rounded-full">
                <Play size={24} className="text-blue-600" />
              </div>
            </div>
          )}

          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                course.level === "beginner"
                  ? "bg-green-100/90 text-green-700 border border-green-200/50"
                  : course.level === "intermediate"
                  ? "bg-yellow-100/90 text-yellow-700 border border-yellow-200/50"
                  : "bg-red-100/90 text-red-700 border border-red-200/50"
              }`}
            >
              {course.level?.toUpperCase() || "BEGINNER"}
            </span>
          </div>

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Category Tag */}
          <div className="mb-3">
            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md uppercase tracking-wide">
              {course.category || "DEVELOPMENTS"}
            </span>
          </div>

          {/* Course Title */}
          <h3 className="font-semibold text-lg text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {course.title}
          </h3>

          {/* Rating and Students */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <Star size={14} className="text-amber-400 fill-current mr-1" />
                <span className="text-sm font-medium text-gray-700">
                  {course.rating || 4.8}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <Users size={14} className="mr-1" />
                <span className="text-sm">
                  {(course.enrolledCount || 435).toLocaleString()} students
                </span>
              </div>
            </div>
          </div>

          {/* Price and Duration */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center text-gray-500">
              <Clock size={14} className="mr-1.5" />
              <span className="text-sm">{course.duration || 0}h</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">
                ${course.price || 0}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate(`/student/courses/${course._id}`)}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all duration-200 font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View Course
          </button>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-200" />
          <div className="p-5">
            <div className="h-4 bg-gray-200 rounded mb-3" />
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="flex justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
              <p className="text-gray-600">
                Discover and learn from our extensive course catalog
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search in your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 sm:flex-none sm:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              <div className="relative flex-1 sm:flex-none sm:w-48">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer pr-10"
                >
                  <option value="latest">Sort by Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="title">Title A-Z</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              {/* View Mode Toggle */}
              {/* <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List size={18} />
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedLevel("");
                setSortBy("latest");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {courses.length} course{courses.length !== 1 ? "s" : ""}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory && ` in ${selectedCategory}`}
                {selectedLevel && ` (${selectedLevel} level)`}
              </p>
              <p className="text-sm text-gray-500">
                Sorted by:{" "}
                {sortBy === "latest"
                  ? "Latest"
                  : sortBy === "popular"
                  ? "Most Popular"
                  : sortBy === "price-low"
                  ? "Price: Low to High"
                  : sortBy === "price-high"
                  ? "Price: High to Low"
                  : sortBy === "rating"
                  ? "Highest Rated"
                  : sortBy === "title"
                  ? "Title A-Z"
                  : "Default"}
              </p>
            </div>

            {/* Course Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CoursesCatalog;
