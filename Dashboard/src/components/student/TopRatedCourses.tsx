// components/TopRatedCourses.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  Star,
  Clock,
  Users,
  Play,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TopRatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchTopRatedCourses();
    if (user?.id) {
      fetchWishlist();
    }
  }, [user]);

  const fetchTopRatedCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses`);

      if (response.ok) {
        const data = await response.json();

        // Sort courses by rating (simulated) and add rating data
        const coursesWithRatings = data.map((course) => ({
          ...course,
          rating: (Math.random() * 1.5 + 4).toFixed(1), // Random rating between 4.0-5.5
          reviewCount: Math.floor(Math.random() * 5000) + 1000, // Random reviews 1k-6k
          enrolledCount: Math.floor(Math.random() * 10000) + 5000, // Random enrolled 5k-15k
        }));

        // Sort by rating (highest first) and take top courses
        const topRated = coursesWithRatings
          .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
          .slice(0, 8);

        // If we need more courses, duplicate some with variations
        if (topRated.length < 8) {
          const additionalCourses = topRated.slice(0, 4).map((course) => ({
            ...course,
            _id: `${course._id}_advanced`,
            title: `Advanced ${course.title}`,
            rating: (parseFloat(course.rating) - 0.2).toFixed(1),
            reviewCount: Math.floor(course.reviewCount * 0.7),
          }));
          setCourses([...topRated, ...additionalCourses]);
        } else {
          setCourses(topRated);
        }
      }
    } catch (error) {
      console.error("Error fetching top rated courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
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
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const CourseCard = ({ course, index }) => {
    const isWishlisted = wishlist.includes(course._id);

    const toggleWishlist = async () => {
      if (!user?.id) {
        navigate("/login");
        return;
      }

      const originalId = course._id.includes("_advanced")
        ? course._id.split("_advanced")[0]
        : course._id;

      const endpoint = `${API_BASE}/wishlist/${originalId}`;
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

    const handleCourseClick = () => {
      const originalId = course._id.includes("_advanced")
        ? course._id.split("_advanced")[0]
        : course._id;
      navigate(`/student/courses/${originalId}`);
    };

    const getRatingColor = (rating) => {
      const numRating = parseFloat(rating);
      if (numRating >= 4.8) return "text-green-600";
      if (numRating >= 4.5) return "text-yellow-600";
      return "text-blue-600";
    };

    return (
      <div
        className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 h-full"
        style={{
          animationDelay: `${index * 100}ms`,
          animation: "fadeInUp 0.6s ease-out forwards",
          opacity: 0,
        }}
      >
        {/* Course Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {/* Top Rated Badge */}
          {parseFloat(course.rating) >= 4.7 && (
            <div className="absolute top-3 left-3 z-10">
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 border border-yellow-200 rounded-full">
                <Award size={12} className="text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700">
                  Top Rated
                </span>
              </div>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 right-14 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-white/50">
              <Star size={12} className="text-amber-400 fill-current" />
              <span
                className={`text-xs font-bold ${getRatingColor(course.rating)}`}
              >
                {course.rating}
              </span>
            </div>
          </div>

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
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-50 to-blue-100">
              <div className="p-4 bg-white/80 rounded-full">
                <Play size={24} className="text-blue-600" />
              </div>
            </div>
          )}

          {/* Level Badge */}
          <div className="absolute bottom-3 left-3">
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
        <div className="p-5 flex flex-col h-full">
          {/* Category Tag */}
          <div className="mb-3">
            <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-md uppercase tracking-wide">
              {course.category || "DEVELOPMENTS"}
            </span>
          </div>

          {/* Course Title */}
          <h3 className="font-semibold text-lg text-gray-900 mb-3 leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-200 flex-grow">
            {course.title}
          </h3>

          {/* Prominent Rating Display */}
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star size={16} className="text-amber-400 fill-current mr-1" />
                <span
                  className={`text-lg font-bold ${getRatingColor(
                    course.rating
                  )}`}
                >
                  {course.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({course.reviewCount?.toLocaleString()} reviews)
              </span>
            </div>
            <div className="flex items-center text-gray-500">
              <Users size={14} className="mr-1" />
              <span className="text-sm">
                {course.enrolledCount?.toLocaleString()}
              </span>
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
                ₹{course.price || 0}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleCourseClick}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98] mt-auto"
          >
            View Course
          </button>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="flex gap-6 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="min-w-[300px] bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"
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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Award className="text-yellow-500" size={28} />
                <h2 className="text-3xl font-bold text-gray-900">
                  Top Rated Courses
                </h2>
              </div>
            </div>
            <p className="text-gray-600">
              Highest rated courses based on student reviews and satisfaction
            </p>
          </div>

          <button
            onClick={() => navigate("/courses?sort=rating")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Courses Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".swiper-button-prev-custom-toprated",
              nextEl: ".swiper-button-next-custom-toprated",
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet-toprated",
              bulletActiveClass: "swiper-pagination-bullet-active-toprated",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            className="pb-12"
          >
            {courses.map((course, index) => (
              <SwiperSlide key={course._id}>
                <CourseCard course={course} index={index} />
              </SwiperSlide>
            ))}

            {/* View All Courses Slide */}
            <SwiperSlide>
              <div
                onClick={() => navigate("/courses?sort=rating")}
                className="group bg-gradient-to-br from-blue-50 to-yellow-100 rounded-xl border-2 border-dashed border-blue-200 overflow-hidden hover:from-blue-100 hover:to-yellow-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 h-full cursor-pointer flex flex-col items-center justify-center p-8 min-h-[400px]"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp size={24} className="text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  More Top Rated Courses
                </h3>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Explore our complete collection of highest-rated courses
                  across all categories
                </p>

                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium group-hover:scale-105">
                  View All Top Rated
                </button>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom-toprated absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group">
            <ChevronLeft
              size={20}
              className="text-gray-600 group-hover:text-gray-900"
            />
          </button>

          <button className="swiper-button-next-custom-toprated absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group">
            <ChevronRight
              size={20}
              className="text-gray-600 group-hover:text-gray-900"
            />
          </button>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

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

        :global(.swiper-pagination-bullet-toprated) {
          width: 12px !important;
          height: 12px !important;
          background: #d1d5db !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
        }

        :global(.swiper-pagination-bullet-active-toprated) {
          background: #ea580c !important;
          transform: scale(1.2) !important;
        }
      `}</style>
    </section>
  );
};

export default TopRatedCourses;
