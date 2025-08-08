// components/RecommendedCourses.jsx
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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const RecommendedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const API_BASE = "http://192.168.1.29:5000/api";

  useEffect(() => {
    fetchRecommendedCourses();
    if (user?.id) {
      fetchWishlist();
    }
  }, [user]);

  const fetchRecommendedCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses`);

      if (response.ok) {
        const data = await response.json();

        // Duplicate courses to have more content for the slider
        const duplicatedCourses = [
          ...data,
          ...data.map((course) => ({
            ...course,
            _id: `${course._id}_dup1`,
            title: `${course.title} - Advanced`,
          })),
          ...data.map((course) => ({
            ...course,
            _id: `${course._id}_dup2`,
            title: `${course.title} - Masterclass`,
          })),
        ];

        // Shuffle and take first 12 courses
        const shuffled = duplicatedCourses.sort(() => 0.5 - Math.random());
        setCourses(shuffled.slice(0, 12));
      }
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
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

  const CourseCard = ({ course }) => {
    const isWishlisted = wishlist.includes(course._id);

    const toggleWishlist = async () => {
      if (!user?.id) {
        navigate("/login");
        return;
      }

      const originalId = course._id.includes("_dup")
        ? course._id.split("_dup")[0]
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
      const originalId = course._id.includes("_dup")
        ? course._id.split("_dup")[0]
        : course._id;
      navigate(`/courses/${originalId}`);
    };

    return (
      <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 h-full">
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
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col h-full">
          {/* Category Tag */}
          <div className="mb-3">
            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md uppercase tracking-wide">
              {course.category || "DEVELOPMENTS"}
            </span>
          </div>

          {/* Course Title */}
          <h3 className="font-semibold text-lg text-gray-900 mb-3 leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-200 flex-grow">
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
                  {(course.enrolledCount || 435).toLocaleString()}
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
            onClick={handleCourseClick}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all duration-200 font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98] mt-auto"
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
      <section className="py-16 bg-gray-50">
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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Recommended for you
            </h2>
            <p className="text-gray-600">
              Handpicked courses just for you based on your interests
            </p>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium"
          >
            All Courses
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
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            autoplay={{
              delay: 4000,
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
                <CourseCard course={course} />
              </SwiperSlide>
            ))}

            {/* More Courses Slide */}
            <SwiperSlide>
              <div
                onClick={() => navigate("/courses")}
                className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-dashed border-blue-200 overflow-hidden hover:from-blue-100 hover:to-indigo-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 h-full cursor-pointer flex flex-col items-center justify-center p-8 min-h-[400px]"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={24} className="text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  Explore More Courses
                </h3>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Discover hundreds of courses across different categories and
                  skill levels
                </p>

                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium group-hover:scale-105">
                  View All Courses
                </button>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group">
            <ChevronLeft
              size={20}
              className="text-gray-600 group-hover:text-gray-900"
            />
          </button>

          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group">
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

        :global(.swiper-pagination) {
          bottom: 0 !important;
        }

        :global(.swiper-pagination-bullet) {
          width: 12px !important;
          height: 12px !important;
          background: #d1d5db !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
        }

        :global(.swiper-pagination-bullet-active) {
          background: #2563eb !important;
          transform: scale(1.2) !important;
        }

        :global(.swiper-button-prev),
        :global(.swiper-button-next) {
          display: none !important;
        }
      `}</style>
    </section>
  );
};

export default RecommendedCourses;
