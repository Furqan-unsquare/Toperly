import React, { useState, useEffect } from "react";
import {
  Award,
  CreditCard,
  BookOpen,
  PlayCircle,
  Download,
  Tv,
  Infinity,
  Heart,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const EnrollmentCard = ({ course, isEnrolled, onEnroll, enrollmentLoading }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (!user) {
      console.log("User not logged in, skipping wishlist check");
      return;
    }

    const checkWishlistStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/api/wishlist/my-wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const wishlistCourses = await response.json();
          const isInWishlist = wishlistCourses.some(
            (wishlistCourse) => wishlistCourse._id === course._id
          );
          setIsWishlisted(isInWishlist);
        } else {
          console.error("Failed to fetch wishlist:", response.statusText);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [course._id, user]);

  const showAlertMessage = (message, type) => {
    setShowAlert({ show: true, message, type });
    setTimeout(() => {
      setShowAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      showAlertMessage("Please login to manage wishlist", "error");
      navigate("/auth/login");
      return;
    }

    const token = localStorage.getItem("token");
    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        const response = await fetch(`${API_BASE}/api/wishlist/${course._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to remove from wishlist");
        }

        setIsWishlisted(false);
        showAlertMessage("Course removed from wishlist", "success");
      } else {
        const response = await fetch(`${API_BASE}/api/wishlist/${course._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to add to wishlist");
        }

        setIsWishlisted(true);
        showAlertMessage("Course added to wishlist", "success");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      showAlertMessage(
        isWishlisted
          ? "Failed to remove from wishlist"
          : "Failed to add to wishlist",
        "error"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user || !user.email) {
      showAlertMessage("Please login to enroll in the course", "error");
      navigate("/auth/login");
      return;
    }

    console.log("User email for enrollment:", user.email); // Debug user email

    if (course.price === 0) {
      try {
        const response = await fetch(`${API_BASE}/api/enroll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ courseId: course._id, userEmail: user.email }),
        });

        if (response.ok) {
          showAlertMessage("Enrolled successfully!", "success");
        } else {
          throw new Error("Enrollment failed");
        }
      } catch (error) {
        console.error("Enrollment error:", error);
        showAlertMessage("Failed to enroll in the course", "error");
      }
    } else {
      onEnroll(user.email); // Pass user.email to onEnroll
    }
  };

  const features = [
    {
      icon: <PlayCircle size={16} />,
      text: `${course.videos?.length || 0} on-demand videos`,
    },
    { icon: <Download size={16} />, text: "Downloadable resources" },
    { icon: <Tv size={16} />, text: "Access on mobile and TV" },
    { icon: <Infinity size={16} />, text: "Full lifetime access" },
    { icon: <Award size={16} />, text: "Certificate of completion" },
  ];

  const AlertNotification = () =>
    showAlert.show && (
      <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
        <div
          className={`p-4 rounded-lg shadow-lg border text-white font-medium flex items-center justify-between ${
            showAlert.type === "success"
              ? "bg-green-500 border-green-600"
              : "bg-red-500 border-red-600"
          }`}
        >
          <span>{showAlert.message}</span>
          <button
            onClick={() => setShowAlert({ show: false, message: "", type: "" })}
            className="ml-3 text-white hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

  return (
    <>
      <AlertNotification />
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
          <img src={course.thumbnail.url} alt="" className="" />
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-3xl font-bold text-gray-900">
                {course.price === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>{formatPrice(course.price)}</span>
                )}
              </div>
              {course.price > 0 && course.originalPrice && (
                <div className="text-lg text-gray-500 line-through">
                  {formatPrice(course.originalPrice)}
                </div>
              )}
            </div>
            {course.price > 0 && course.originalPrice && (
              <div className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full inline-block">
                {Math.round((1 - course.price / course.originalPrice) * 100)}%
                off
              </div>
            )}
          </div>
          {!isEnrolled ? (
            <button
              onClick={handleEnroll}
              disabled={enrollmentLoading}
              className={`w-full py-4 rounded-lg mb-4 font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                course.price === 0
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-[#1ac6a7] hover:to-[#66E4CC] hover:text-black text-white"
              } ${
                enrollmentLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {enrollmentLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {course.price === 0 ? "Enrolling..." : "Processing..."}
                </>
              ) : (
                <>
                  {course.price === 0 ? (
                    <>
                      <BookOpen size={20} />
                      Enroll for Free
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Buy Now
                    </>
                  )}
                </>
              )}
            </button>
          ) : (
            <div className="text-center py-4 bg-green-50 text-green-800 rounded-lg mb-4 font-semibold border-2 border-green-200">
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                ✨ You're Enrolled!
              </div>
            </div>
          )}
          {course.price > 0 && (
            <div className="text-center text-sm text-gray-600 mb-6">
              <span className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                30-Day Money-Back Guarantee
              </span>
            </div>
          )}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">
              This course includes:
            </h4>
            <div className="space-y-3">
              {[
                {
                  icon: <PlayCircle size={16} />,
                  text: `${course.videos?.length || 0} on-demand videos`,
                },
                { icon: <Download size={16} />, text: "Downloadable resources" },
                { icon: <Tv size={16} />, text: "Access on mobile and TV" },
                { icon: <Infinity size={16} />, text: "Full lifetime access" },
                { icon: <Award size={16} />, text: "Certificate of completion" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <span className="text-gray-500">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6">
            <div className="flex justify-between items-center text-sm">
              <button className="text-purple-600 hover:text-purple-700 font-medium">
                Share
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`font-medium flex items-center gap-1 transition-colors ${
                  wishlistLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : isWishlisted
                    ? "text-red-600 hover:text-red-700"
                    : "text-purple-600 hover:text-purple-700"
                }`}
              >
                {wishlistLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                    />
                    {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrollmentCard;