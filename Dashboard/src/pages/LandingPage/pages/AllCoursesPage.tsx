import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Star, ChevronRight as ChevronRightIcon, X, Filter, Clock, TrendingUp, Award } from 'lucide-react';
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse flex flex-col transform transition-all duration-300 hover:scale-[1.02]">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="h-4 w-16 bg-gray-200 rounded-full" />
          <span className="h-4 w-14 bg-gray-200 rounded-full" />
        </div>
        <div className="h-6 w-2/3 bg-gray-200 rounded-lg mb-3" />
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
          <span className="h-6 w-24 bg-gray-200 rounded-lg" />
          <span className="h-8 w-28 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Skeleton Grid
function CoursesSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

useEffect(() => {
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/`);
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

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        (typeof course.instructor === 'string' 
          ? course.instructor.toLowerCase().includes(query)
          : course.instructor.name.toLowerCase().includes(query))
      );
    }

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
  }, [courses, selectedCategory, selectedLevel, sortOption, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedLevel('');
    setSortOption('');
    setSearchQuery('');
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
    <div className="relative  flex min-h-screen bg-gradient-to-br from-gray-50 mt-20 to-blue-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-72 shadow-xl p-6 sticky top-28 self-start mt-10 ml-8 border border-gray-100">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-500" />
            Filters
          </h3>
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Search</h4>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Category
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              All Categories
            </label>
            {categories.map(category => (
              <label key={category} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Level
          </h4>
          <div className="space-y-2">
            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="level"
                value=""
                checked={selectedLevel === ''}
                onChange={() => setSelectedLevel('')}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              All Levels
            </label>
            {levels.map(level => (
              <label key={level} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={selectedLevel === level}
                  onChange={() => setSelectedLevel(level)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        <button
          className="flex items-center justify-center w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          onClick={clearFilters}
        >
          Clear All Filters
          <X className="w-4 h-4 ml-2" />
        </button>
      </aside>

      {/* Mobile Filter Panel */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsFilterOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-xl transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filters
            </h3>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Search Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Search</h4>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="mobile-category"
                  value=""
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                All Categories
              </label>
              {categories.map(category => (
                <label key={category} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="mobile-category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
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
              <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="mobile-level"
                  value=""
                  checked={selectedLevel === ''}
                  onChange={() => setSelectedLevel('')}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                All Levels
              </label>
              {levels.map(level => (
                <label key={level} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="mobile-level"
                    value={level}
                    checked={selectedLevel === level}
                    onChange={() => setSelectedLevel(level)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <button
            className="flex items-center justify-center w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            onClick={clearFilters}
          >
            Clear All Filters
            <X className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex-1 pt-20 md:pt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Main Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
            <div>
              <div className="flex items-center mb-2">
                <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                <span className="text-blue-600 font-bold text-xl uppercase tracking-wide">Professional Courses</span>
              </div>
              <p className="text-gray-600">Discover courses to advance your career and skills</p>
            </div>
          </div> 

          {/* Courses Header with Count, Sort, and Filter Icon */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-3 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Available
              </h3>
              {(selectedCategory || selectedLevel || searchQuery) && (
                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Filtered
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <select
                className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="md:hidden p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content: Loading Skeletons, Error, or Courses */}
          {loading ? (
            <CoursesSkeleton />
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-gray-600 text-xl font-semibold mb-4">Error Loading Courses</div>
              <p className="text-gray-600">{error}</p>
              <button 
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16 ">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-700 text-xl font-semibold mb-2">No courses found</div>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map(course => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer flex flex-col transform hover:-translate-y-2"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail?.url || "https://toperly.com/wp-content/uploads/2025/07/Machine_learning_thumbnail-480x360.webp"}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.duration ? `${course.duration} min` : 'N/A'}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div className="absolute bottom-3 left-3 text-white font-semibold text-lg">
                      {formatPrice(course.price)}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className='justify-between flex'>
                      <span className="text-blue-600 text-sm font-medium mb-2">{course.category}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    <div 
                      className="text-gray-600 mb-4 line-clamp-2 text-sm"
                      dangerouslySetInnerHTML={{ __html: course.description }} 
                    />
                    
                    <div className="flex items-center mb-4">
                      <img
                        src="https://i.pinimg.com/736x/98/a6/aa/98a6aadc34b3519d5c4e0a6150f0701f.jpg"
                        alt={typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
                        className="w-8 h-8 rounded-full mr-3 border-2 border-white shadow-sm"
                      />
                      <span className="text-sm text-gray-600">
                        {typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-4">
                        <span className="text-sm font-bold text-gray-900 mr-1">{course.rating || 'N/A'}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(course.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">({course.totalReviews.toLocaleString()})</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-5 space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" /> 99+ students
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.videos.length} lessons
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <button
                        className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors flex items-center"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/courses/${course._id}`);
                        }}
                      >
                        Learn more
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </button>
                      <button
                        className="bg-blue-600 text-sm hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center shadow-md hover:shadow-lg"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/courses/${course._id}`);
                        }}
                      >
                        Enroll Now
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