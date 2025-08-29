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
} from "lucide-react";

import VideoPlayer from "../../components/student/VideoPlayer";
import EnrollmentCard from "../../components/student/EnrollmentCard";
import CourseContentList from "../../components/student/CourseContentList";
import Material from "../../components/student/Material";
import Toast from "../../components/student/Toast";
import CourseReviewSection from "../../components/student/CourseReviewSection";
import PaymentForm from "../../components/Payment/PaymentForm";
import PaymentModal from "../../components/Payment/PaymentModal";
import { usePayment } from "../../hooks/usePayment";
import LearningObjectives from "../../components/student/LearningObjectives";

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
    if (paymentSuccess || paymentError) {
      setShowPaymentModal(true);
      setShowPaymentForm(false);

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
      setInstructor(data2);
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
    if (!user?._id || !isEnrolled)
      return showToast("You must be enrolled", "error");

    try {
      setCertificateLoading(true);
      const res = await fetch(
        `${API_BASE}/certificates/issue/${courseId}/${user._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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

      window.open(data.data?.certificateUrl, "_blank");
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
      price: course.price,
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
            onClick={() => navigate("/courses")}
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

  const requirements = [
    "No prior experience necessary",
    "A computer with internet access",
    "Willingness to learn and practice",
    "Basic understanding of computers",
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Toast message={toastMessage} />

      {/* Hero Section - Hidden if enrolled */}
      {!isEnrolled ? (
        <div className="bg-gradient-to-r mt-28 from-gray-900 via-gray-700 to-gray-900 text-white">
          <div className="mx-auto px-4 sm:px-6 lg:px-0 lg:pl-40 lg:pr-10 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-2">
                <button
                  onClick={() => navigate("/courses")}
                  className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Courses
                </button>
                <div className="mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      course.level === "beginner"
                        ? "bg-green-100 text-green-800"
                        : course.level === "intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.level?.charAt(0).toUpperCase() +
                      course.level?.slice(1)}{" "}
                    Level
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {course.title}
                </h1>

                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  {course.description
                    ?.replace(/<[^>]*>/g, "")
                    .substring(0, 200)}
                  ...
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center text-yellow-400">
                    <Star size={16} className="mr-1 fill-current" />
                    <span className="font-semibold mr-1">4.8</span>
                    <span className="text-gray-300">(2,847 ratings)</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users size={16} className="mr-2" />
                    <span>{course.enrolledStudents?.length || 0} students</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Globe size={16} className="mr-2" />
                    <span>English</span>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 text-white font-semibold text-lg">
                    {instructor?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-blue-400 text-sm">Created by</p>
                    <h3 className="font-semibold text-lg">
                      {instructor?.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    <span>{course.duration || 0} total hours</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    <span>{course.videos?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <PlayCircle size={16} className="mr-2" />
                    <span>On-demand video</span>
                  </div>
                </div>
              </div>

              {/* Course Preview Section - Right Side */}
              <div className="lg:col-span-2 ">
                <div className="bg-gray-800 rounded-lg sm:rounded overflow-hidden shadow-xl">
                  {/* Video Preview */}
                  <div className="relative aspect-video bg-gray-700">
                    <img
                      src={course?.thumbnail?.url}
                      alt=""
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                        {course.duration || 0} hours
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Enrollment Card - Hidden on desktop */}
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
                <div>
                  <button onClick={handleCertificate} className="text-green-600 font-medium">Certificate</button>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-sm font-medium">Enrolled</span>
                  <button
                    onClick={() => navigate("/courses")}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors pl-8"
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Courses
                  </button>
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
                    { id: "curriculum", label: "Curriculum" },
                    { id: "instructor", label: "Instructor" },
                    { id: "reviews", label: "Reviews" },
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
              <div className="bg-white px-6 py-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* What you'll learn */}
                    <LearningObjectives courseId={courseId} />

                    {/* Requirements */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {requirements.map((requirement, index) => (
                          <li
                            key={index}
                            className="flex items-start text-gray-700 text-sm"
                          >
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Description
                      </h3>
                      <div
                        className="text-gray-700 leading-relaxed prose max-w-none"
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

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div>
                    <CourseContentList
                      course={course}
                      currentVideo={currentVideo}
                      setCurrentVideo={setCurrentVideo}
                      isEnrolled={isEnrolled}
                      showToast={showToast}
                    />
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900">
                        About the Instructor 
                      </h3>
                    </div>

                    {/* Instructor Profile */}
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Side - Avatar and Basic Info */}
                        <div className="flex flex-col items-center md:items-start">
                          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4">
                            {instructor?.name?.charAt(0) || "K"}
                          </div>
                          <div className="text-center md:text-left">
                            <h4 className="text-xl font-bold text-blue-600 mb-1">
                              {instructor?.name || "Kirill Eremenko"}
                            </h4>
                            <p className="text-gray-600 font-medium mb-2">
                              {instructor?.title || "DS & AI Instructor"}
                            </p>
                          </div>
                        </div>

                        {/* Right Side - Stats and Bio */}
                        <div className="flex-1">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <span className="text-yellow-400 mr-1">★</span>
                                <span className="font-bold text-gray-900">
                                  {instructor?.rating || "4.5"}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Instructor Rating
                              </div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="font-bold text-gray-900 mb-1">
                                {instructor?.reviewsCount?.toLocaleString() ||
                                  "844,727"}
                              </div>
                              <div className="text-sm text-gray-600">
                                Reviews
                              </div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="font-bold text-gray-900 mb-1">
                                {instructor?.studentsCount?.toLocaleString() ||
                                  "3,182,434"}
                              </div>
                              <div className="text-sm text-gray-600">
                                Students
                              </div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="font-bold text-gray-900 mb-1">
                                {instructor?.coursesCount || "49"}
                              </div>
                              <div className="text-sm text-gray-600">
                                Courses
                              </div>
                            </div>
                          </div>

                          {/* Bio Section */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-700 leading-relaxed">
                                {instructor?.bio ||
                                  "My name is Kirill Eremenko and I am super-psyched that you are reading this!"}
                              </p>
                            </div>

                            {/* Detailed Bio - Show/Hide based on state */}
                            <div
                              className={`space-y-3 text-sm text-gray-600 transition-all duration-300 overflow-hidden ${
                                showFullBio
                                  ? "max-h-none opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <p>
                                {instructor?.detailedBio?.paragraph1 ||
                                  "Professionally, I come from the Data Science consulting space with experience in finance, retail, transport and other industries. I was trained by the best analytics mentors at Deloitte Australia and since starting on Udemy I have passed on my knowledge to thousands of aspiring data scientists."}
                              </p>
                              <p>
                                {instructor?.detailedBio?.paragraph2 ||
                                  "From my courses you will straight away notice how I combine my real-life experience and academic background in Physics and Mathematics to deliver professional step-by-step coaching in the space of Data Science. One of the strongest sides of my teaching style is that I focus on intuitive explanations, so you can be sure that you will truly understand even the most complex topics."}
                              </p>
                              <p>
                                {instructor?.detailedBio?.paragraph3 ||
                                  "To sum up, I am absolutely and utterly passionate about Data Science and I am looking forward to sharing my passion and knowledge with you!"}
                              </p>
                            </div>

                            {/* Additional Info - Show only when expanded */}
                            {showFullBio && instructor?.expertise && (
                              <div className="pt-4 border-t border-gray-200">
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Areas of Expertise
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {(
                                    instructor.expertise || [
                                      "Data Science",
                                      "Machine Learning",
                                      "Python",
                                      "R",
                                      "Statistics",
                                    ]
                                  ).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Education & Experience - Show only when expanded */}
                            {showFullBio &&
                              (instructor?.education ||
                                instructor?.experience) && (
                                <div className="pt-4 border-t border-gray-200 grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">
                                      Education
                                    </h5>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      {(
                                        instructor?.education || [
                                          "MSc in Physics",
                                          "Mathematics Background",
                                        ]
                                      ).map((edu, index) => (
                                        <div key={index}>{edu}</div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">
                                      Experience
                                    </h5>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      {(
                                        instructor?.experience || [
                                          "Deloitte Australia - Senior Analytics Consultant",
                                          "Data Science Consulting - 5+ years",
                                        ]
                                      ).map((exp, index) => (
                                        <div key={index}>{exp}</div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                            {/* Show More/Less Button */}
                            <div className="pt-4">
                              <button
                                onClick={() => setShowFullBio(!showFullBio)}
                                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center transition-colors"
                              >
                                {showFullBio ? "Show less" : "Show more"}
                                <svg
                                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                    showFullBio ? "transform rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 hidden lg:block">
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
          onSubmit={handlePaymentFormSubmit}
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
    </div>
  );
};

export default CourseDetail;
