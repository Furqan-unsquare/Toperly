import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Star, ChevronRight as ChevronRightIcon, X, Filter } from 'lucide-react';
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

// Skeleton Grid
function CoursesSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <CourseCardSkeleton key={idx} />
      ))}
    </div>
  );
}

const ProfessionalCourseSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses/');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const result = await response.json();
        const mappedCourses = result?.map((course: Course) => ({
          _id: course._id,
          title: course.title,
          description: course.description,
          instructor: course.instructor || 'Unknown Instructor',
          category: course.category || 'Other',
          level: course.level || 'Beginner',
          price: course.price,
          duration: course.duration,
          isPublished: course.isPublished,
          rating: course.rating || 0,
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
        setFilteredCourses(mappedCourses);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter and sort courses
  useEffect(() => {
    let result = [...courses];

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(course => course.category === selectedCategory);
    }

    // Apply level filter (case-insensitive comparison)
    if (selectedLevel) {
      result = result.filter(course => course.level.toLowerCase() === selectedLevel.toLowerCase());
    }

    // Apply sorting
    if (sortOption) {
      result.sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating-desc':
            return b.rating - a.rating;
          case 'duration-asc':
            return a.duration - b.duration;
          case 'duration-desc':
            return b.duration - a.duration;
          default:
            return 0;
        }
      });
    }

    setFilteredCourses(result);
  }, [courses, selectedCategory, selectedLevel, sortOption]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedLevel('');
    setSortOption('');
    setFilteredCourses(courses);
    setIsFilterOpen(false);
  };

  // Helper functions
  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique categories and levels
  const categories = [...new Set(courses.map(course => course.category))].sort();
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-64 bg-gray-50 rounded-md border-2 border-gray-200 shadow-y-xl p-6 sticky top-28 self-start">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="mr-2"
              />
              All Categories
            </label>
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                  className="mr-2"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Level</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="level"
                value=""
                checked={selectedLevel === ''}
                onChange={() => setSelectedLevel('')}
                className="mr-2"
              />
              All Levels
            </label>
            {levels.map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={selectedLevel === level}
                  onChange={() => setSelectedLevel(level)}
                  className="mr-2"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        <button
          className="flex items-center text-blue-600 font-semibold hover:underline mb-4"
          onClick={clearFilters}
        >
          Clear All Filters
          <X className="w-4 h-4 ml-2" />
        </button>
      </aside>

      {/* Mobile Filter Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-gray-50 p-6 shadow-lg transform transition-transform duration-300 z-50 ${
          isFilterOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
          <button onClick={() => setIsFilterOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="mobile-category"
                value=""
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="mr-2"
              />
              All Categories
            </label>
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="mobile-category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                  className="mr-2"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Level</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="mobile-level"
                value=""
                checked={selectedLevel === ''}
                onChange={() => setSelectedLevel('')}
                className="mr-2"
              />
              All Levels
            </label>
            {levels.map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="mobile-level"
                  value={level}
                  checked={selectedLevel === level}
                  onChange={() => setSelectedLevel(level)}
                  className="mr-2"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        <button
          className="flex items-center text-blue-600 font-semibold hover:underline mb-4"
          onClick={clearFilters}
        >
          Clear All Filters
          <X className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Main Content */}
      <section className="flex-1 bg-gray-50 pt-20 md:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Main Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-blue-600 font-semibold text-lg uppercase tracking-wide">Professional Courses</span>
              </div>
            </div>
          </div>

          {/* Courses Header with Count, Sort, and Filter Icon */}
          <div className="flex items-center justify-between md:mb-2">
            <h3 className="text-sm md:text-md font-semibold text-gray-600">
              {filteredCourses.length} courses
            </h3>
            <div className="flex items-center md:space-x-4">
              <select
                className="p-2 border rounded-lg bg-white text-gray-700"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="duration-asc">Duration: Short to Long</option>
                <option value="duration-desc">Duration: Long to Short</option>
              </select>
              <button
                className="md:hidden p-2 text-gray-600 hover:text-gray-800"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content: Loading Skeletons, Error, or Courses */}
          {loading ? (
            <CoursesSkeleton />
          ) : error ? (
            <div className="text-center py-16 text-red-600">Error: {error}</div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredCourses.map(course => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/student/courses/${course._id}`)}
                >
                  <div className="relative">
                    <img
                      src="https://toperly.com/wp-content/uploads/2025/07/Machine_learning_thumbnail-480x360.webp"
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                      {course.duration ? `${course.duration} min` : 'N/A'}
                    </div>
                  </div>
                  
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
                        className="bg-blue-600 text-sm hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/courses/${course._id}`);
                        }}
                      >
                        View Details
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfessionalCourseSection;