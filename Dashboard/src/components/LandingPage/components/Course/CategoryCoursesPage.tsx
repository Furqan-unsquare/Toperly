import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const COURSES_PER_LOAD = 12;

// Skeleton Card Component for Category Page
function CategoryCourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse flex flex-col">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200" />
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="h-4 w-16 bg-gray-200 rounded" />
            <span className="h-4 w-14 bg-gray-200 rounded" />
          </div>
          <div className="h-6 w-2/3 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        </div>
        <div>
          <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

const CategoryCoursesPage = () => {
  const { category } = useParams();
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(COURSES_PER_LOAD);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses/');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const result = await response.json();
        const filtered = result?.filter(course => (course.category || 'Other') === category) || [];
        setAllCourses(filtered);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [category]);

  const coursesToShow = allCourses.slice(0, visibleCount);

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-12 mt-8 md:mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {loading ? (
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          ) : (
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">{category} Courses</h2>
          )}
        </div>

        {/* Content: Loading Skeletons, Error, or Courses */}
        {loading ? (
          // Show skeleton grid while loading
          <div className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
          ">
            {Array.from({ length: 12 }).map((_, idx) => (
              <CategoryCourseCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          // Show error message
          <div className="text-center py-16 text-red-600">Error: {error}</div>
        ) : (
          // Show actual courses
          <>
            <div className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            ">
              {coursesToShow.map(course => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail?.url ||
                        'https://via.placeholder.com/480x360.png?text=Course'}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                      {course.duration ? `${course.duration} min` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-600 text-sm font-medium">{course.category}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800">
                          {course.level}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="text-gray-600 mb-2 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: course.description }} 
                      />
                    </div>
                    
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{(course.price || 0).toFixed(2)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course._id}`);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-200 transform mt-2 shadow-lg"
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {visibleCount < allCourses.length && (
              <div className="flex justify-center mt-8">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                  onClick={() => setVisibleCount(count => count + COURSES_PER_LOAD)}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryCoursesPage;
