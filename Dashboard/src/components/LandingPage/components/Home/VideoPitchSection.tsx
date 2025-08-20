
import React, { useState, useRef, useEffect } from 'react';
import { Clock, Users, Star, Play, ArrowRight, Brain, Code, TrendingUp, Award, CheckCircle, Timer, Globe, ChevronLeft, ChevronRight } from "lucide-react";

const CoursesSection = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle card
  const [isVisible, setIsVisible] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const startTime = useRef(0);

  const courses = [
    {
      customId: 'COURSE001',
      title: 'Machine Learning Fundamentals',
      description:
        'Master the core concepts of machine learning with hands-on projects, real-world applications, and industry best practices from Google engineers.',
      instructor: '507f1f77bcf86cd799439011',
      category: 'Machine Learning',
      level: 'beginner',
      price: 199,
      duration: 40,
      thumbnail: {
        filename: '',
        url: 'https://toperly.com/wp-content/uploads/2025/07/Machine_learning_thumbnail-480x360.webp',
        bunnyFileId: '',
      },
      rating: 4.9,
      totalReviews: 2834,
      createdAt: new Date('2025-07-01T00:00:00Z'),
      updatedAt: new Date('2025-08-01T00:00:00Z'),
    },
    {
      customId: 'COURSE002',
      title: 'Political Science Essentials',
      description:
        'Master the core concepts of machine learning with hands-on projects, real-world applications, and industry best practices from Google engineers.',
      instructor: '507f1f77bcf86cd799439011',
      category: 'Machine Learning',
      level: 'beginner',
      price: 199,
      duration: 40,
      thumbnail: {
        filename: '',
        url: 'https://toperly.com/wp-content/uploads/2025/07/Political_thumbnail-480x360.png',
        bunnyFileId: '',
      },
      rating: 4.9,
      totalReviews: 2834,
      createdAt: new Date('2025-07-01T00:00:00Z'),
      updatedAt: new Date('2025-08-01T00:00:00Z'),
    },
    {
      customId: 'COURSE003',
      title: 'Python Programming',
      description:
        'Master the core concepts of machine learning with hands-on projects, real-world applications, and industry best practices from Google engineers.',
      instructor: '507f1f77bcf86cd799439011',
      category: 'Machine Learning',
      level: 'beginner',
      price: 199,
      duration: 40,
      thumbnail: {
        filename: '',
        url: 'https://toperly.com/wp-content/uploads/2025/07/Python_thumbnail-480x360.png',
        bunnyFileId: '',
      },
      rating: 4.9,
      totalReviews: 2834,
      createdAt: new Date('2025-07-01T00:00:00Z'),
      updatedAt: new Date('2025-08-01T00:00:00Z'),
    },
  ];

  // Placeholder mappings for missing fields
  const mapCourseData = (course: any) => ({
    ...course,
    subtitle: 'Complete Guide to ML Mastery',
    totalHours: `${course.duration} hours`,
    students: '12,547',
    instructorName: 'Dr. Sarah Chen',
    instructorTitle: 'AI Expert',
    popular: false,
    originalPrice: '₹299',
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Touch/mouse handlers
  const handleStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    currentX.current = clientX;
    startTime.current = Date.now();
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    currentX.current = clientX;
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    const deltaX = currentX.current - startX.current;
    const deltaTime = Date.now() - startTime.current;
    const threshold = 50;
    const maxTime = 300;

    isDragging.current = false;

    if (Math.abs(deltaX) > threshold && deltaTime < maxTime) {
      if (deltaX > 0) {
        setActiveIndex((prev) => (prev === 0 ? courses.length - 1 : prev - 1));
      } else {
        setActiveIndex((prev) => (prev === courses.length - 1 ? 0 : prev + 1));
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleEnd();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleEnd();
  };

  const getTransform = () => {
    const cardWidth = 288; // 72rem (w-72) = 288px
    const gap = 16; // mx-2 = 8px each side
    const containerWidth = window.innerWidth;
    const centerPosition = (containerWidth - cardWidth) / 2;
    const cardPosition = activeIndex * (cardWidth + gap);
    return centerPosition - cardPosition;
  };

  // Intersection Observer to trigger animations on view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Trigger when 20% of section is visible
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

  return (
<div className="w-full min-h-full bg-gradient-to-b from-[#2721F5] via-[#1c17ac] to-gray-50 px-4 sm:px-6 lg:px-8">

    <section ref={sectionRef} className="pt-6 md:pt-14 md:pb-10 relative overflow-hidden bg-gray-50 rounded-t-2xl">
      <div className="absolute inset-0 opacity-5 ">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
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
            }

            .hidden-animation {
              opacity: 0;
              transform: translateY(20px);
            }

            .carousel-card {
              transition: all 0.5s ease-out;
            }

            .carousel-card-active {
              opacity: 1;
              transform: scale(1.05);
            }

            .carousel-card-inactive {
              opacity: 0.7;
              transform: scale(0.95);
            }
          `}
        </style>

        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-up' : 'hidden-animation'}`}>
          <div className="inline-flex items-center px-6 py-3 bg-blue-100 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-800 mb-6 border border-blue-200">
            <Brain className="w-4 h-4 mr-2 text-blue-600" />
            AI-Powered Course Catalog
            <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 animate-pulse"></div>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Top-Rated {' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Courses
            </span>
          </h2>
          <p className="hidden md:block text-sm md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Explore expert-designed AI courses with smart learning.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-16">
          {courses.map((course, index) => {
            const mappedCourse = mapCourseData(course);
            return (
              <div
  key={course.customId}
  className={`relative overflow-hidden transition-all duration-700 hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg ${isVisible ? 'animate-fade-up' : 'hidden-animation'}`}
  style={{ animationDelay: `${index * 0.1}s` }}
>
  <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
    {mappedCourse.popular && (
      <div className="border border-emerald-300 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
        <TrendingUp className="w-3 h-3 mr-1" />
        Popular
      </div>
    )}
  </div>

  {/* Image container with LOW z-index */}
  <div className="relative overflow-hidden rounded-t-2xl z-0">
    <img
      src={mappedCourse.thumbnail.url}
      alt={mappedCourse.title}
      className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
    />
    <div className="absolute bottom-4 left-4 right-4">
      <div className="flex items-center justify-between text-white text-sm">
        <span className="font-semibold">{mappedCourse.totalHours}</span>
      </div>
    </div>
  </div>

  {/* Details container with HIGH z-index */}
  <div className="p-6 -mt-20 relative z-20 bg-white/95 backdrop-blur-sm rounded-t-2xl">
    <div className="flex items-center justify-between mb-3">
      <div className={`px-3 py-1 rounded-full text-sm font-medium border  ${getLevelColor(mappedCourse.level)}`}>
        {mappedCourse.level.charAt(0).toUpperCase() + mappedCourse.level.slice(1)}
      </div>
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold">{mappedCourse.rating}</span>
        <span>({mappedCourse.totalReviews.toLocaleString()})</span>
      </div>
    </div>

    <h3 className="text-xl font-bold hover:text-blue-600 transition-colors mb-1">
      {mappedCourse.title}
    </h3>
    <p className="text-sm font-medium text-blue-600 mb-2">{mappedCourse.subtitle}</p>

    <div className="flex items-center space-x-3 mb-4 p-3 bg-blue-50 rounded-lg">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {mappedCourse.instructorName.split(' ').map((n: string) => n[0]).join('')}
        </span>
      </div>
      <div>
        <div className="text-sm font-semibold">{mappedCourse.instructorName}</div>
        <div className="text-xs text-gray-600">{mappedCourse.instructorTitle}</div>
      </div>
    </div>

    <div className="pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-black text-blue-600">₹{mappedCourse.price}</div>
          {mappedCourse.originalPrice && (
            <div className="text-lg text-gray-500 line-through">{mappedCourse.originalPrice}</div>
          )}
        </div>
      </div>

      <button
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
        onClick={() => alert('Proceed to enrollment...')}
      >
        <Award className="w-4 h-4 mr-2" />
        Enroll Now & Start Learning
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  </div>
</div>

            );
          })}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-16 mx-auto">
          <div className="relative -ml-16">
            <div
              ref={carouselRef}
              className="flex ml-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${getTransform()}px)`,
                transition: isDragging.current ? 'none' : 'transform 0.5s ease-out',
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {courses.map((course, index) => {
                const mappedCourse = mapCourseData(course);
                const isActive = index === activeIndex;

                return (
                  <div
                    key={course.customId}
                    className={`w-72 flex-shrink-0 mx-2 select-none carousel-card ${
                      isVisible
                        ? isActive
                          ? 'carousel-card-active'
                          : 'carousel-card-inactive'
                        : 'opacity-70 scale-95'
                    }`}>
                    <div
                      className="relative overflow-hidden transition-all duration-500 shadow-xl bg-white backdrop-blur-sm max-w-72 rounded-2xl border border-gray-200">
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                          src={mappedCourse.thumbnail.url}
                          alt={mappedCourse.title}
                          className="w-full h-40 object-cover"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center justify-between text-white text-sm">
                            <span className="font-semibold">{mappedCourse.totalHours}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(mappedCourse.level)}`}>
                            {mappedCourse.level.charAt(0).toUpperCase() + mappedCourse.level.slice(1)}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <span className="font-semibold">{mappedCourse.rating}</span>
                            <span className="text-xs">({mappedCourse.totalReviews.toLocaleString()})</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold mb-1 line-clamp-2">{mappedCourse.title}</h3>
                        <p className="text-sm font-medium text-blue-600 mb-2">{mappedCourse.subtitle}</p>

                        <div className="flex items-center space-x-3 mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {mappedCourse.instructorName.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{mappedCourse.instructorName}</div>
                            <div className="text-xs text-gray-600">{mappedCourse.instructorTitle}</div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center"
                            onClick={() => alert('Proceed to enrollment...')}
                          >
                            <Award className="w-4 h-4 mr-2" />
                            Enroll Now for ₹{mappedCourse.price}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {courses.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {courses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
    </div>
  );
};

export default CoursesSection;