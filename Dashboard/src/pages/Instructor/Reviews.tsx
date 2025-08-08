import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  User,
  Calendar,
  Book,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react";

const AdminCoursesReviews = () => {
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [filteredData, setFilteredData] = useState([]);

  // Fetch courses and reviews
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch all courses
        const coursesResponse = await fetch(
          "http://192.168.1.29:5000/api/courses/"
        );
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);

        // Fetch all reviews once
        const reviewsResponse = await fetch(
          "http://192.168.1.29:5000/api/reviews/all"
        );
        const allReviews = await reviewsResponse.json();

        // Group reviews by courseId
        const reviewsByCourse = allReviews.reduce((acc, review) => {
          const courseId = review.course?._id || review.course; // Handle both populated and ObjectId cases
          if (!acc[courseId]) acc[courseId] = [];
          acc[courseId].push(review);
          return acc;
        }, {});
        setReviews(reviewsByCourse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses and reviews based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(courses);
      return;
    }

    const filtered = courses.filter((course) => {
      const courseMatch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructor?.name || course.instructor)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());

      const reviewMatch = reviews[course._id]?.some(
        (review) =>
          (review.student?.name || "Anonymous")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (review.comment || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

      return courseMatch || reviewMatch;
    });

    setFilteredData(filtered);
  }, [searchTerm, courses, reviews]);

  const toggleCourseExpansion = (courseId) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getAverageRating = (courseReviews) => {
    if (!courseReviews || courseReviews.length === 0) return 0;
    const sum = courseReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / courseReviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses and reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100  p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Courses & Reviews
          </h1>
          <p className="text-gray-600">
            Monitor all courses and their reviews. Read-only access for
            administrative oversight.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, instructors, or reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(Array.isArray(courses)
                    ? courses.reduce(
                        (sum, course) => sum + (course.students || 0),
                        0
                      )
                    : 0
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(reviews).reduce(
                    (sum, reviewArray) => sum + reviewArray.length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(reviews).length > 0
                    ? (
                        Object.values(reviews)
                          .flat()
                          .reduce((sum, review) => sum + review.rating, 0) /
                        Object.values(reviews).flat().length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className=" rounded-lg  overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Courses & Reviews ({filteredData.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No courses found matching your search.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((course) => (
                    <React.Fragment key={course._id}>
                      {" "}
                      {/* Use _id as key, assuming it's the MongoDB ID */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.category}
                            </div>
                            <div className="text-xs text-gray-400">
                              {course.duration} • {course.price}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {course.instructor?.name || course.instructor}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {renderStars(
                                Math.round(
                                  getAverageRating(reviews[course._id])
                                )
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {getAverageRating(reviews[course._id])}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {reviews[course._id]?.length || 0} reviews
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleCourseExpansion(course._id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            {expandedCourses.has(course._id) ? (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Hide Reviews
                              </>
                            ) : (
                              <>
                                <ChevronRight className="h-4 w-4 mr-1" />
                                View Reviews
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      {/* Reviews Section */}
                      {expandedCourses.has(course._id) &&
                        reviews[course._id] && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Reviews for {course.title}
                                </h4>
                                {reviews[course._id].map((review) => (
                                  <div
                                    key={review._id}
                                    className="bg-white rounded-lg p-4 border border-gray-200"
                                  >
                                    {" "}
                                    {/* Added key with _id */}
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center">
                                        <div className="flex mr-2">
                                          {renderStars(review.rating)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 mr-2">
                                          {review.student?.name || "Anonymous"}
                                        </span>
                                        {review.verified && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            Verified
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(
                                          review.createdAt
                                        ).toLocaleDateString()}{" "}
                                        {/* Changed from review.date to createdAt */}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      {review.comment || "No comment"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursesReviews;
