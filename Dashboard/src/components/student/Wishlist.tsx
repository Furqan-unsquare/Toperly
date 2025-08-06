// pages/Wishlist.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Play, Star, Clock, BookOpen, Heart } from "lucide-react";
import VdoPlayer from "../VdoPlayer";

const API_BASE = "http://localhost:5000/api";

const Wishlist = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE}/wishlist/my-wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setWishlistCourses(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative h-44 bg-gray-100">
        {course?.thumbnail?.url ? (
          <img
            src={course?.thumbnail.url}
            alt={course?.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Play size={32} className="text-gray-400" />
          </div>
        )}

        {/* Price & Level */}
        <div className="absolute top-3 right-3 text-sm bg-white px-2 py-1 rounded shadow">
          ${course?.price}
        </div>
        <div className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700">
          {course?.level}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-3">
          {course?.title}
        </h3>
        <div className="flex items-center mb-4">
          <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center mr-2.5">
            <span className="text-xs font-semibold text-gray-600">
              {course?.instructor.name.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {course?.instructor.name}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
          <div className="flex items-center">
            <Clock size={14} className="mr-1.5" />
            <span>{course?.duration || 0}h</span>
          </div>
          <div className="flex items-center">
            <Star size={14} className="text-yellow-500 fill-current mr-1" />
            <span>{course?.rating}</span>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => navigate(`/courses/${course?._id}`)}
          className="w-full bg-gray-900 text-white py-2.5 rounded-md hover:bg-gray-800 transition font-medium text-sm"
        >
          View Course
        </button>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            {wishlistCourses.length} course{wishlistCourses.length !== 1 && "s"}{" "}
            wishlisted
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        ) : wishlistCourses.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Explore courses and add them to your wishlist
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistCourses.map((course) => (
              <CourseCard key={course?._id} course={course} />
            ))}
          </div>
        )}
      </div>
      <VdoPlayer videoId="ff2dabcc6615d0d2a3177bdc0e4c6312" />
    </div>
  );
};

export default Wishlist;
