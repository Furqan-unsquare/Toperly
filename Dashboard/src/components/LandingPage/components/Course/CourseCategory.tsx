import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Star, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: { _id: string; name: string } | string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  duration: number;
  isPublished: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  customId: string;
  thumbnail: { url?: string };
  materials: any[];
  videos: any[];
  __v: number;
}

// Skeleton Card Component for Grid Layout
function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse flex flex-col">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="h-4 w-16 bg-gray-200 rounded" />
          <span className="h-4 w-14 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-2/3 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-full bg-gray-200 rounded mb-3" />
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
          <span className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center mb-3">
          <span className="h-4 w-28 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <span className="h-4 w-20 bg-gray-200 rounded" />
          <span className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="h-6 w-24 bg-gray-200 rounded" />
          <span className="h-8 w-28 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// Skeleton Category Section
function CategorySkeleton() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-4
      ">
        {Array.from({ length: 4 }).map((_, idx) => (
          <CourseCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

function groupCoursesByCategory(courses) {
  const map = {};
  courses.forEach(course => {
    const cat = course.category || 'Other';
    if (!map[cat]) map[cat] = [];
    map[cat].push(course);
  });
  return map;
}

const ProfessionalCourseSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses/');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const result = await response.json();
        const mappedCourses = result?.map((course) => ({
          _id: course._id,
          title: course.title,
          description: course.description,
          instructor: course.instructor || 'Unknown Instructor',
          category: course.category,
          level: course.level,
          price: course.price,
          duration: course.duration,
          isPublished: course.isPublished,
          rating: course.rating,
          totalReviews: course.totalReviews || 0,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          customId: course.customId || 'N/A',
          thumbnail: course.thumbnail || { url: 'https://via.placeholder.com/480x360.png?text=Course' },
          materials: course.materials || [],
          videos: course.videos || [],
          __v: course.__v
        }));
        setCourses(mappedCourses);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Helper functions
  const formatPrice = (price) => `₹${price.toFixed(2)}`;
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="bg-gray-50 pt-32 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Professional Courses</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              What to learn next
            </h2>
          </div>
        </div>

        {/* Content: Loading Skeletons, Error, or Courses */}
        {loading ? (
          // Show 3 category skeletons while loading
          Array.from({ length: 3 }).map((_, idx) => (
            <CategorySkeleton key={idx} />
          ))
        ) : error ? (
          // Show error message
          <div className="text-center py-16 text-red-600">Error: {error}</div>
        ) : (
          // Show actual course categories
          (() => {
            const coursesByCategory = groupCoursesByCategory(courses);
            const categories = Object.keys(coursesByCategory);
            
            return categories.map((category) => {
              const allCourses = coursesByCategory[category];
              const showCourses = allCourses.slice(0, 2); // later update to 8
              const isMore = allCourses.length > 1; // later update to 8

              return (
                <div key={category} className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{category} Courses</h3>
                    {isMore && (
                      <button
                        className="flex items-center text-blue-600 font-semibold hover:underline"
                        onClick={() => navigate(`/courses/category/${encodeURIComponent(category)}`)}
                      >
                        View All
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </button>
                    )}
                  </div>
                  
                  <div className="
                    grid gap-6
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-4
                  ">
                    {showCourses.slice(0, window.innerWidth < 640 ? 4 : 8).map(course => (
                      <div
                        key={course._id}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer flex flex-col"
                        onClick={() => navigate(`/student/courses/${course._id}`)}
                      >
                        {/* Image */}
                        <div className="relative">
                          <img
                            src="https://toperly.com/wp-content/uploads/2025/07/Machine_learning_thumbnail-480x360.webp"
                            alt={course.title}
                            className="w-full h-48 object-cover  transition-transform duration-300"
                          />
                          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                            {course.duration ? `${course.duration} min` : 'N/A'}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-blue-600 text-sm font-medium">{course.category}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getLevelColor(course.level)}`}>
                              {course.level}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                            {course.title}
                          </h3>
                          
                          <div className="text-gray-600 mb-3 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: course.description }} 
                          />
                          
                          <div className="flex items-center mb-3">
                            <img
                              src="https://i.pinimg.com/736x/98/a6/aa/98a6aadc34b3519d5c4e0a6150f0701f.jpg"
                              alt={typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
                              className="w-8 h-8 rounded-full mr-2 border-2 border-gray-200"
                            />
                            <span className="text-sm text-gray-600">
                              {typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            <span className="text-sm font-bold text-gray-900 mr-1">{course.rating || 'N/A'}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">({course.totalReviews.toLocaleString()})</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" /> 99+ students
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {course.videos.length} lessons
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-2xl font-bold text-gray-900">{formatPrice(course.price)}</span>
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                              onClick={e => {
                                e.stopPropagation();
                                navigate(`/courses/${course._id}`);
                              }}
                            >
                              View Details
                              <ChevronRightIcon className="w-4 h-4 ml-2" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>
    </section>
  );
};

export default ProfessionalCourseSection;
