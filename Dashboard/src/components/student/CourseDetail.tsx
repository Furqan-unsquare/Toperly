import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  BookOpen,
  PlayCircle,
  Download,
  Globe,
  Award,
  Smartphone,
  Tv,
  Infinity,
  CheckCircle,
  Heart,
  Play,
  StarHalf,
} from "lucide-react";

import VideoPlayer from "./VideoPlayer";
import { Preview } from "./Preview";
import EnrollmentCard from "./EnrollmentCard";
import CourseContentList from "./CourseContentList";
import Material from "./Material";
import Toast from "./Toast";
import CourseReviewSection from "./CourseReviewSection";
import InstructorProfile from "./InstructorProfile";
import PaymentForm from "../Payment/PaymentForm";
import PaymentModal from "../Payment/PaymentModal";
import { usePayment } from "../../hooks/usePayment";
import LearningObjectives from "../../components/student/LearningObjectives";
import CourseRequirements from "../../components/student/CourseRequirements";
import BotPopup from "../BotPopup";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    loading: paymentLoading,
    error: paymentError,
    paymentSuccess,
    initiatePayment,
    resetPaymentState,
  } = usePayment();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [instructor, setInstructor] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  // Payment states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  const [certificateUrl, setCertificateUrl] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const [showCertificatePopup, setShowCertificatePopup] = useState(false);
  // Dummy courses data for "Students also bought" section
  const dummyCourses = [
    {
      id: 1,
      title: "Data Structures and Algorithms Complete Course - CPP & JAVA",
      rating: 4.4,
      students: 4653,
      price: 469,
      originalPrice: 2869,
      totalHours: 81,
      instructor: "John Doe",
      badge: "Premium",
      lastUpdated: "12/2024",
      image: "https://via.placeholder.com/100x100/4ade80/ffffff?text=DSA",
    },
    {
      id: 2,
      title: "Master the Coding Interview: Data Structures + Algorithms",
      rating: 4.6,
      students: 251528,
      price: 469,
      originalPrice: 3229,
      totalHours: 20,
      instructor: "Jane Smith",
      badge: "Bestseller",
      lastUpdated: "2/2025",
      image: "https://via.placeholder.com/100x100/3b82f6/ffffff?text=INT",
    },
    {
      id: 3,
      title: "50Days of DSA JavaScript Data Structures Algorithms LEETCODE",
      rating: 4.6,
      students: 31965,
      price: 509,
      originalPrice: 3289,
      totalHours: 68,
      instructor: "Mike Johnson",
      badge: "Premium",
      lastUpdated: "5/2025",
      image: "https://via.placeholder.com/100x100/eab308/ffffff?text=JS",
    },
    {
      id: 4,
      title: "JavaScript Data Structures & Algorithms + LEETCODE Exercises",
      rating: 4.8,
      students: 26459,
      price: 579,
      originalPrice: 3999,
      totalHours: 9.5,
      instructor: "Sarah Wilson",
      badge: "Bestseller",
      lastUpdated: "5/2025",
      image: "https://via.placeholder.com/100x100/f59e0b/ffffff?text=JS",
    },
    {
      id: 5,
      title: "Master the Coding Interview: Big Tech (FAANG) Interviews",
      rating: 4.6,
      students: 65367,
      price: 479,
      originalPrice: 3289,
      totalHours: 37,
      instructor: "Alex Brown",
      badge: "Premium",
      lastUpdated: "5/2024",
      image: "https://via.placeholder.com/100x100/06b6d4/ffffff?text=BT",
    },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userData) {
      setUser({ ...JSON.parse(userData), token });
    }
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (user && course) {
      checkEnrollment();
    }
  }, [user, course]);

  useEffect(() => {
    if (paymentSuccess) {
      setShowPaymentModal(true);
      setShowPaymentForm(false);
      // Show Topsy popup for successful purchase
      setShowPurchasePopup(true);
      if (paymentSuccess) {
        setTimeout(() => {
          checkEnrollment();
        }, 1000);
      }
    }
  }, [paymentSuccess, paymentError]);

  const showToast = (text, type = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}`);
      const data = await res.json();
      const res2 = await fetch(`${API_BASE}/instructors/${data.instructor}`);
      const data2 = await res2.json();
      setCourse(data);
      setInstructor(data2.data); // Changed to data2.data
      if (data.videos?.length > 0) {
        setCurrentVideo(data.videos[0]);
      }
    } catch (err) {
      showToast("Failed to load course", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCertificate = async () => {
    if (!user?.id || !isEnrolled) {
      return showToast("You must be enrolled", "error");
    }

    try {
      setCertificateLoading(true);
      const res = await fetch(
        `${API_BASE}/certificates/issue/${courseId}/${user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Certificate download failed");
      }

      setCertificateUrl(data.data?.certificateUrl);
      showToast("Certificate ready for download!", "success");
      setShowCertificatePopup(true); // Show Topsy popup
      // window.open(data.data?.certificateUrl, "_blank");
    } catch (err) {
      console.error("Certificate error:", err);
      showToast(err?.message || "Certificate generation failed", "error");
    } finally {
      setCertificateLoading(false);
    }
  };
  const checkEnrollment = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${API_BASE}/enroll/my-courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      const isAlreadyEnrolled = data.some(
        (item) => item.course?._id === course?._id
      );
      setIsEnrolled(isAlreadyEnrolled);
    } catch (err) {
      console.error("Enrollment check failed:", err);
    }
  };

  const handleEnroll = async () => {
    if (!user) return navigate("/auth");

    if (course.price === 0) {
      return handleFreeEnrollment();
    }

    setShowPaymentForm(true);
  };

  const handleFreeEnrollment = async () => {
    try {
      setEnrollmentLoading(true);
      const res = await fetch(`${API_BASE}/enroll/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to enroll");

      setIsEnrolled(true);
      showToast("Successfully enrolled!", "success");
    } catch (err) {
      console.error(err);
      showToast("Enrollment failed", "error");
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handlePaymentFormSubmit = async (userDetails) => {
    if (!course) return;

    const courseData = {
      id: course._id,
      name: course.title,
      price: course.price * 100,
      description: course.description,
    };

    await initiatePayment(courseData, userDetails);
  };

  const handlePaymentFormCancel = () => {
    setShowPaymentForm(false);
    resetPaymentState();
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    resetPaymentState();
  };

  const handleGoToCourse = () => {
    setShowPaymentModal(false);
    resetPaymentState();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/student/courses")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const courseFeatures = [
    { icon: <Tv size={20} />, text: "Watch on TV and mobile" },
    { icon: <Download size={20} />, text: "Downloadable resources" },
    { icon: <Infinity size={20} />, text: "Full lifetime access" },
    { icon: <Award size={20} />, text: "Certificate of completion" },
  ];
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Toast message={toastMessage} />

      {/* Hero Section - Hidden if enrolled */}
      {!isEnrolled ? (
        <div
  className="text-white"
  style={{
    backgroundImage: `url('https://d2o2utebsixu4k.cloudfront.net/Data%20science-9ebefe6e77794815b69708b0ac1e9d13-af28611554944c678c0989ef967e8103.webp')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="mx-auto px-4 sm:px-6 lg:px-0 lg:pl-40 lg:pr-10 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      {/* Left Content - Compact */}
      <div className="lg:col-span-2 space-y-4">
        {/* Badge */}
        <div className="mb-4">
          <span className="bg-[#ffffff29] text-white px-4 py-2 rounded-full text-sm font-medium">
            {course.level + " course"}
          </span>
        </div>

        {/* Title - Adjusted font weight and size */}
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-white">
          {course.title}
        </h1>

        {/* Description - Check icons and smaller fonts */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M20 6L9 17L4 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-base text-gray-200 font-normal leading-relaxed">
              Enroll into India's pioneering Online Machine Learning Program; learn from the latest 2025 curriculum.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M20 6L9 17L4 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-base text-gray-200 font-normal leading-relaxed">
              Join an alumni network of ML Experts at Amazon, HSBC, ICICI, Kotak, Microsoft, Jio Digital, Lenskart, Swiggy, and more.
            </p>
          </div>
        </div>

        {/* Stats Row - Dummy data fallbacks */}
        <div className="flex items-center gap-4 text-sm mb-6">
          {/* Alumni Image */}
          <img
            src="https://www.upgrad.com/_ww3-next/image/?url=https%3A%2F%2Fd2o2utebsixu4k.cloudfront.net%2Falumni%203-62e5a1d6511a4250b159727a80ee36a9.png&w=3840&q=75"
            alt="alumni"
            className="h-6"
          />

          {/* Alumni Count with dummy fallback */}
          <span className="text-gray-200 font-medium text-sm">
            Join{" "}
            {course.enrolledStudents?.length > 0
              ? course.enrolledStudents.length > 10000
                ? "10k+"
                : course.enrolledStudents.length
              : "10k+"}{" "}
            alumni
          </span>

          {/* Separator */}
          <span className="text-gray-400">|</span>

          {/* Ratings with dummy fallbacks */}
          <div className="flex items-center">
            {/* Stars with half-star logic */}
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }, (_, i) => {
                const rating = course.rating > 0 ? course.rating : 4.5; // Dummy rating
                if (rating >= i + 1) {
                  return (
                    <Star key={i} size={14} className="fill-current" />
                  ); // full star
                } else if (rating >= i + 0.5) {
                  return (
                    <StarHalf
                      key={i}
                      size={14}
                      className="fill-current"
                    />
                  ); // half star
                } else {
                  return (
                    <Star key={i} size={14} className="opacity-40" />
                  ); // empty star
                }
              })}
            </div>
            <span className="ml-2 font-semibold text-sm">
              {course.rating > 0 ? course.rating.toFixed(1) : "4.5"}/5
            </span>
            <span className="ml-1 text-gray-300 font-normal text-sm">
              ({course.totalReviews > 0 ? course.totalReviews.toLocaleString() : "7,812"} ratings)
            </span>
          </div>
        </div>

        {/* Instructor - Smaller and less bold */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3 text-white font-semibold text-lg">
            {instructor?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-blue-300 text-xs font-normal">
              Created by
            </p>
            <h3 className="font-semibold text-base text-white">
              {instructor?.name}
            </h3>
          </div>
        </div>

        {/* Course Details - Smaller fonts */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-blue-400" />
            <span className="font-normal">
              {course.duration || 0} total hours
            </span>
          </div>
          <div className="flex items-center">
            <BookOpen size={16} className="mr-2 text-blue-400" />
            <span className="font-normal">
              {course.videos?.length || 0} lessons
            </span>
          </div>
          <div className="flex items-center">
            <PlayCircle size={16} className="mr-2 text-blue-400" />
            <span className="font-normal">On-demand video</span>
          </div>
        </div>
      </div>

      {/* Right Side - Same Height */}
      <div className="lg:col-span-2">
        <div className="bg-gray-900/90 rounded-xl overflow-hidden shadow-2xl h-full backdrop-blur-sm border border-gray-700">
          {/* Video Preview - Maintains aspect ratio */}
          <div className="relative aspect-video bg-gray-800">
            <Preview />
            <div className="absolute bottom-4 right-4">
              <span className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                {course.duration || 0} hours
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Enrollment Card */}
        <div className="lg:hidden mt-6">
          <EnrollmentCard
            course={course}
            isEnrolled={isEnrolled}
            onEnroll={handleEnroll}
            enrollmentLoading={enrollmentLoading || paymentLoading}
          />
        </div>
      </div>
    </div>
  </div>
</div>

      ) : (
        // New header for enrolled students
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* <div className="h-6 w-px bg-gray-300"></div> */}
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 truncate">
                    {course.title}
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users size={14} className="mr-1" />
                      <span>
                        {course.enrolledStudents?.length || 0} students
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span>{course.duration || 0} total hours</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen size={14} className="mr-1" />
                      <span>{course.videos?.length || 0} lessons</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional: Progress indicator or course status */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleCertificate}
                  className="text-green-600 font-medium"
                >
                  Certificate
                </button>
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-sm font-medium">Enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Video Player - Only shown if enrolled */}
            {isEnrolled && (
              <div className="mb-8">
                <VideoPlayer
                  video={currentVideo}
                  isEnrolled={isEnrolled}
                  course={course}
                  onEnroll={handleEnroll}
                  enrollmentLoading={enrollmentLoading || paymentLoading}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Tab Navigation - No card background */}
            <div className="mb-8">
              <div className="border-b border-gray-200 bg-white">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "instructor", label: "Instructor" },
                    { id: "reviews", label: "Reviews" },
                    { id: "curriculum", label: "Curriculum" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content - Clean background */}
              <div className="bg-white px-4 py-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-10">
                    {/* What you'll learn */}
                    <LearningObjectives courseId={courseId} />

                    {/* Requirements */}
                    <CourseRequirements
                      courseId={courseId}
                      isAdmin={
                        user?.role === "admin" || user?.role === "instructor"
                      }
                    />

                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Description
                      </h3>
                      <div
                        className="text-gray-700 leading-relaxed prose text-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                      />
                    </div>

                    {/* This course includes */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        This course includes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courseFeatures.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center text-gray-700"
                          >
                            <span className="text-gray-600 mr-3">
                              {feature.icon}
                            </span>
                            <span className="text-sm">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && (
                  <InstructorProfile instructorId={course.instructor} />
                )}

                {activeTab === "curriculum" && (
                  <CourseContentList
                  course={course}
                  currentVideo={currentVideo}
                  setCurrentVideo={setCurrentVideo}
                  isEnrolled={isEnrolled}
                  showToast={showToast}
                />
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div>
                    <CourseReviewSection
                      courseId={course._id}
                      currentUser={user}
                      isEnrolled={isEnrolled}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Materials Section - Clean background */}
            <div className="mb-8">
              <Material
                materials={course.materials}
                isEnrolled={isEnrolled}
                showToast={showToast}
              />
            </div>

            {/* Students also bought section - Clean background */}
            <div className="bg-white px-6 py-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Students also bought
              </h3>

              <div className="divide-y divide-gray-200">
                {dummyCourses.map((dummyCourse) => (
                  <div
                    key={dummyCourse.id}
                    className="py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          "https://img-c.udemycdn.com/course/750x422/5993822_2c2a_7.jpg"
                        }
                        alt={dummyCourse.title}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {dummyCourse.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="font-medium text-gray-900">
                              {dummyCourse.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{dummyCourse.students.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              dummyCourse.badge === "Premium"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {dummyCourse.badge}
                          </span>
                          <span>•</span>
                          <span>{dummyCourse.totalHours} total hours</span>
                          <span>•</span>
                          <span>Updated {dummyCourse.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-base font-semibold text-gray-900">
                            ₹{dummyCourse.price}
                          </div>
                          <div className="text-sm text-gray-500 line-through">
                            ₹{dummyCourse.originalPrice}
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Fixed/Sticky Course Content or Enrollment Card */}
          <div className="lg:col-span-1 z-50">
            <div className="lg:sticky lg:top-16 hidden lg:block ">
              {isEnrolled ? (
                <CourseContentList
                  course={course}
                  currentVideo={currentVideo}
                  setCurrentVideo={setCurrentVideo}
                  isEnrolled={isEnrolled}
                  showToast={showToast}
                />
              ) : (
                <EnrollmentCard
                  course={course}
                  isEnrolled={isEnrolled}
                  onEnroll={handleEnroll}
                  enrollmentLoading={enrollmentLoading || paymentLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modals */}
      {showPaymentForm && course && (
        <PaymentForm
          course={{
            id: course._id,
            name: course.title,
            price: course.price,
            description: course.description,
          }}
          onSubmit={(formData) => {
            handlePaymentFormSubmit(formData);
          }}
          onCancel={handlePaymentFormCancel}
          loading={paymentLoading}
        />
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        type={paymentSuccess ? "success" : "error"}
        title={paymentSuccess ? "Payment Successful!" : "Payment Failed"}
        message={
          paymentSuccess
            ? `Congratulations! You have successfully purchased ${course?.title}. You now have lifetime access to the course.`
            : paymentError ||
              "Something went wrong with your payment. Please try again."
        }
        onClose={handlePaymentModalClose}
        actionButton={
          paymentSuccess
            ? {
                text: "Start Learning",
                onClick: handleGoToCourse,
              }
            : {
                text: "Try Again",
                onClick: handlePaymentModalClose,
              }
        }
      />
      <BotPopup
        isOpen={showPurchasePopup}
        onClose={() => setShowPurchasePopup(false)}
        studentName={user?.name || "Student"}
        title="Congratulations on Your New Course!"
        description={`You've successfully enrolled in ${course?.title}! Dive in and start learning with Toperly!`}
        buttonText="Start Learning"
        buttonLink={`/student/courses/${courseId}`}
        botImage="/Bot-image-purchase.png"
      />
      <BotPopup
        isOpen={showCertificatePopup}
        onClose={() => setShowCertificatePopup(false)}
        studentName={user?.name || "Student"}
        title="You've Earned Your Certificate!"
        description="Congratulations on completing the course! Download your certificate and share your achievement!"
        buttonText="View Certificate"
        buttonLink={certificateUrl || "#"}
        botImage="/Bot-image-purchase.png"
      />
    </div>
  );
};

export default CourseDetail;
