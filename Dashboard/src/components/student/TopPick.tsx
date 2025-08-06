// components/TopPick.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Users,
  Play,
  Heart,
  Award,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  thumbnail?: {
    url: string;
    public_id: string;
  };
  price: number;
  duration: number;
  level: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  enrolledCount?: number;
}

const TopPick: React.FC = () => {
  const [topCourse, setTopCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    fetchTopPick();
  }, []);

  useEffect(() => {
    if (user?.id && topCourse) {
      checkWishlistStatus();
    }
  }, [user, topCourse?._id]);

  const fetchTopPick = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses`);

      if (response.ok) {
        const data = await response.json();

        if (data.length > 0) {
          // Select the first course or you can add logic to select featured course
          // You could also add a featured flag to your course model
          const featuredCourse = data[0];
          setTopCourse(featuredCourse);
        }
      }
    } catch (error) {
      console.error("Error fetching top pick:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user?.id || !topCourse) return;

    try {
      const res = await fetch(`${API_BASE}/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const wishlistData = await res.json();
        setIsWishlisted(
          wishlistData.some((course: any) => course._id === topCourse._id)
        );
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const toggleWishlist = async () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    if (!topCourse) return;

    const endpoint = `${API_BASE}/wishlist/${topCourse._id}`;
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
        setIsWishlisted(!isWishlisted);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `Updated ${month} ${year}`;
  };

  // Static data for missing fields
  const getStaticData = (course: Course) => {
    const staticData = {
      rating: 4.7,
      totalRatings: Math.floor(Math.random() * 50000) + 10000, // Random between 10k-60k
      lectureCount: Math.floor(Math.random() * 200) + 100, // Random between 100-300
      originalPrice: Math.floor(course.price * 1.8), // 80% discount
      isPremium: Math.random() > 0.5,
      isBestseller: Math.random() > 0.3,
      enrolledCount:
        course.enrolledCount || Math.floor(Math.random() * 50000) + 5000,
      instructorTitle: "Developer and Lead Instructor",
      enhancedDescription:
        course.description ||
        `Master ${course.category} with this comprehensive course. Learn from industry experts and build real-world projects that will enhance your portfolio and career prospects.`,
    };

    return staticData;
  };

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/5 h-64 lg:h-80 bg-gray-200" />
              <div className="flex-1 p-6 lg:p-8">
                <div className="h-8 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
                <div className="flex gap-4 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
                <div className="h-10 bg-gray-200 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!topCourse) {
    return null;
  }

  const staticData = getStaticData(topCourse);

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-orange-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">
              Our top pick for you
            </h2>
          </div>
        </div>

        {/* Featured Course Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row">
            {/* Course Image */}
            <div className="lg:w-2/5 relative">
              {topCourse.thumbnail?.url ? (
                <div className="aspect-video lg:aspect-auto lg:h-80 relative overflow-hidden">
                  <img
                    src={topCourse.thumbnail.url}
                    alt={topCourse.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Play Button */}
                  <button
                    onClick={() => navigate(`/courses/${topCourse._id}`)}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Play
                        className="text-white ml-1"
                        size={24}
                        fill="currentColor"
                      />
                    </div>
                  </button>
                </div>
              ) : (
                <div className="aspect-video lg:aspect-auto lg:h-80 bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-purple-700/90 to-orange-500/90" />

                  {/* Category Icon */}
                  <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xs text-center px-1">
                          {topCourse.category.slice(0, 6)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute left-8 top-8">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {topCourse.level.slice(0, 3)}
                      </span>
                    </div>
                  </div>

                  {/* Instructor Placeholder */}
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-bold text-lg">
                          {topCourse.instructor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => navigate(`/courses/${topCourse._id}`)}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Play
                        className="text-white ml-1"
                        size={24}
                        fill="currentColor"
                      />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Course Details */}
            <div className="flex-1 p-6 lg:p-8">
              {/* Course Title - Dynamic */}
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {topCourse.title}
              </h3>

              {/* Course Description - Dynamic or Enhanced */}
              <p
                className="text-gray-600 mb-4 leading-relaxed line-clamp-1"
                dangerouslySetInnerHTML={{
                  __html: staticData.enhancedDescription,
                }}
              ></p>

              {/* Instructor - Dynamic */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  By{" "}
                  <span className="font-medium text-gray-700">
                    {topCourse.instructor.name}
                  </span>
                  <span className="text-gray-500">
                    , {staticData.instructorTitle}
                  </span>
                </p>
              </div>

              {/* Course Meta - Mix of Dynamic and Static */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <span className="text-gray-500">
                  {formatDate(topCourse.updatedAt)}
                </span>
                <span>•</span>
                <span>{topCourse.duration || 0} total hours</span>
                <span>•</span>
                <span>{staticData.lectureCount} lectures</span>
                <span>•</span>
                <span>{topCourse.level}</span>
              </div>

              {/* Rating and Badges - Static */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    {staticData.rating}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(staticData.rating)
                            ? "text-orange-400 fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-500">
                    ({staticData.totalRatings.toLocaleString()})
                  </span>
                </div>

                {staticData.isPremium && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded border border-purple-200">
                    Premium
                  </span>
                )}

                {staticData.isBestseller && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded border border-orange-200">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Price - Dynamic with Static Original Price */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(topCourse.price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(staticData.originalPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {user?.id && (
                    <button
                      onClick={toggleWishlist}
                      className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200"
                    >
                      <Heart
                        size={20}
                        className={
                          isWishlisted
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400 hover:text-red-400"
                        }
                      />
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/courses/${topCourse._id}`)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
                  >
                    View Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPick;
