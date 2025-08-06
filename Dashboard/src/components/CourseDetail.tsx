import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, Star, BookOpen } from "lucide-react";

import VideoPlayer from "./student/VideoPlayer";
import EnrollmentCard from "./student/EnrollmentCard";
import CourseContentList from "./student/CourseContentList";
import Material from "./student/Material";
import Toast from "./student/Toast";
import CourseReviewSection from "./student/CourseReviewSection";
import PaymentForm from "./PaymentForm";
import PaymentModal from "./PaymentModal";
import { usePayment } from "../hooks/usePayment";

const API_BASE = "http://localhost:5000/api";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { loading: paymentLoading, error: paymentError, paymentSuccess, initiatePayment, resetPaymentState } = usePayment();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [instructor, setInstructor] = useState({});
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  
  // Payment states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  // Handle payment success/error
  useEffect(() => {
    if (paymentSuccess || paymentError) {
      setShowPaymentModal(true);
      setShowPaymentForm(false);
      
      if (paymentSuccess) {
        // Refresh enrollment status after successful payment
        setTimeout(() => {
          checkEnrollment();
        }, 1000);
      }
    }
  }, [paymentSuccess, paymentError]);

  const handleDownloadCertificate = async () => {
    if (!user?.id || !isEnrolled)
      return showToast("You must be enrolled", "error");

    try {
      setCertificateLoading(true);
      const res = await fetch(
        `${API_BASE}/certificates/issue/${courseId}/${user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
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

  const checkEnrollment = async () => {
    if (!user) return;
    
    try {
      const res = await fetch(`${API_BASE}/enroll/my-courses`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
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

    // If course is free, enroll directly
    if (course.price === 0) {
      return handleFreeEnrollment();
    }

    // If course is paid, show payment form
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
    
    console.log(course);
    const courseData = {
      id: course._id,
      name: course.title,
      price: course.price,
      description: course.description
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
    // Refresh the page to show updated enrollment status
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  console.log(course)

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast message={toastMessage} />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <VideoPlayer
              video={currentVideo}
              isEnrolled={isEnrolled}
              course={course}
              onEnroll={handleEnroll}
              enrollmentLoading={enrollmentLoading || paymentLoading}
              showToast={showToast}
            />

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.level === "beginner"
                      ? "bg-green-100 text-green-800"
                      : course.level === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {course.level}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{course.duration || 0} hours</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={16} className="mr-1" />
                  <span>{course.videos?.length || 0} lessons</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  <span>{course.enrolledStudents?.length || 0} students</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-500" />
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>

              <div
                className="text-gray-700 mb-6 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description }}
              ></div>

              {instructor && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-2">Instructor</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 text-white font-semibold">
                      {instructor?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {instructor?.name}
                      </h4>
                      <p className="text-sm text-gray-600">{instructor?.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Materials Section */}
            <Material
              materials={course.materials}
              isEnrolled={isEnrolled}
              showToast={showToast}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <EnrollmentCard
              course={course}
              isEnrolled={isEnrolled}
              onEnroll={handleEnroll}
              enrollmentLoading={enrollmentLoading || paymentLoading}
            />

            <CourseContentList
              course={course}
              currentVideo={currentVideo}
              setCurrentVideo={setCurrentVideo}
              isEnrolled={isEnrolled}
              showToast={showToast}
            />
            
            {isEnrolled && (
              <div className="mt-6">
                <button
                  onClick={handleDownloadCertificate}
                  disabled={certificateLoading}
                  className={`w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition duration-150 ${
                    certificateLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {certificateLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <>Download Certificate</>
                  )}
                </button>
              </div>
            )}
          </div>

          <CourseReviewSection
            courseId={course._id}
            currentUser={user}
            isEnrolled={isEnrolled}
          />
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && course && (
        <PaymentForm
          course={{
            id: course._id,
            name: course.title,
            price: course.price,
            description: course.description
          }}
          onSubmit={handlePaymentFormSubmit}
          onCancel={handlePaymentFormCancel}
          loading={paymentLoading}
        />
      )}

      {/* Payment Success/Error Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        type={paymentSuccess ? 'success' : 'error'}
        title={paymentSuccess ? 'Payment Successful!' : 'Payment Failed'}
        message={
          paymentSuccess 
            ? `Congratulations! You have successfully purchased ${course?.title}. You now have lifetime access to the course.`
            : paymentError || 'Something went wrong with your payment. Please try again.'
        }
        onClose={handlePaymentModalClose}
        actionButton={
          paymentSuccess 
            ? {
                text: 'Start Learning',
                onClick: handleGoToCourse
              }
            : {
                text: 'Try Again',
                onClick: handlePaymentModalClose
              }
        }
      />
    </div>
  );
};

export default CourseDetail;
