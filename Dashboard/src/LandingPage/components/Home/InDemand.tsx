
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, Users, PlayCircle, BookOpen } from 'lucide-react';
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
  inDemand: boolean; // Added to interface
}

// Skeleton Card Component
function CourseCardSkeleton() {
  return (
    <div className="flex-none w-80 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200" />
      </div>
      <div className="p-6">
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
        <span className="h-6 w-24 bg-gray-200 rounded block" />
      </div>
    </div>
  );
}

const ProfessionalCourseSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const swiperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const slidePrev = () => {
    if (swiperRef.current) {
      const container = swiperRef.current;
      container.scrollBy({ left: -400, behavior: 'smooth' });
      updateNavState();
    }
  };

  const slideNext = () => {
    if (swiperRef.current) {
      const container = swiperRef.current;
      container.scrollBy({ left: 400, behavior: 'smooth' });
      updateNavState();
    }
  };

  const updateNavState = () => {
    if (swiperRef.current) {
      const container = swiperRef.current;
      setAtStart(container.scrollLeft <= 0);
      setAtEnd(container.scrollLeft >= container.scrollWidth - container.clientWidth);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/courses/`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        const result = await response.json();
        const mappedCourses = result
          ?.filter((course: any) => course.inDemand === true) // Filter inDemand: true
          .map((course: any) => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            instructor: course.instructor || 'Unknown Instructor',
            category: course.category,
            level: course.level as 'Beginner' | 'Intermediate' | 'Advanced',
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
            __v: course.__v,
            inDemand: course.inDemand || false,
          }));
        setCourses(mappedCourses);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCourses();
    // eslint-disable-next-line
  }, [API_BASE]);

  // Intersection Observer to trigger animation when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Helper functions
  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section ref={sectionRef} className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:mb-12">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-2">
              <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Professional Courses</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Future-Ready Courses for Every Field
            </h2>
            <p className="md:text-lg text-gray-600">
              We help you upskill in the areas that matter most to your passion and your profession
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={slidePrev}
              disabled={atStart}
              className={`p-3 rounded-full border-2 transition-all duration-200 ${
                atStart
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={slideNext}
              disabled={atEnd}
              className={`p-3 rounded-full border-2 transition-all duration-200 ${
                atEnd
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Course Cards OR Skeleton */}
        <div className="relative">
          <style>
            {`
              @keyframes fadeUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .animate-fade-up {
                animation: fadeUp 0.6s ease-out forwards;
                animation-delay: calc(var(--index) * 0.1s);
              }

              .hidden-animation {
                opacity: 0;
                transform: translateY(20px);
              }
            `}
          </style>
          <div
            ref={swiperRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={updateNavState}
          >
            {loading ? (
              // Render 4 skeletons while loading
              Array.from({ length: 4 }).map((_, idx) => <CourseCardSkeleton key={idx} />)
            ) : error ? (
              // No cards on error
              null
            ) : (
              // Real course cards
              courses.map((course, idx) => (
                <div
                  key={course._id}
                  className={`flex-none w-80 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer ${
                    isVisible ? 'animate-fade-up' : 'hidden-animation'
                  }`}
                  style={{ '--index': idx } as React.CSSProperties}
                  onClick={() => handleCourseClick(course._id)}
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={course.thumbnail.url}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                      <PlayCircle className="w-3 h-3 mr-1" />
                      {course.duration ? `${course.duration} min` : 'N/A'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category & Level */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-blue-600 text-sm font-medium">{course.category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{course.title}</h3>

                    <div
                      className="text-gray-600 mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />

                    {/* Instructor */}
                    <div className="flex items-center mb-3">
                      <img
                        src={'https://i.pinimg.com/736x/98/a6/aa/98a6aadc34b3519d5c4e0a6150f0701f.jpg'}
                        alt={typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
                        className="w-8 h-8 rounded-full mr-2 border-2 border-gray-200"
                      />
                      <span className="text-sm text-gray-600">
                        {typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        <span className="text-sm font-bold text-gray-900 mr-1">{course.rating || 'N/A'}</span>
                        <div className="flex">
                          {[...Array(5)]?.map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(course.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">({course.totalReviews.toLocaleString()})</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" /> 99+ students
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.videos.length} lessons
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(course.price)}</span>
                      </div>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course._id);
                        }}
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Show error below the cards, only if not loading */}
          {!loading && error && <div className="text-center py-16 text-red-600">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalCourseSection;
