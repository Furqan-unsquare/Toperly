import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Play,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
  });
  const [userStats, setUserStats] = useState({
    enrolledCourses: 0,
    reviews: 0,
    quizAttempts: 0,
    certificates: 0,
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStats();
    if (user) fetchUserStats();
  }, [API_BASE, user]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/courses`);
      if (response.ok) {
        const courses = await response.json();
        setStats({
          totalCourses: courses.length,
          totalStudents: Math.floor(Math.random() * 50000) + 10000,
          totalInstructors: Math.floor(courses.length / 10) + 50,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalCourses: 1000,
        totalStudents: 25000,
        totalInstructors: 150,
      });
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      });
      if (response.ok) {
        const data = await response.json();
        setUserStats({
          enrolledCourses: data.enrolledCourses?.length || 0,
          reviews: data.reviews?.length || 0,
          quizAttempts: data.quizAttempts?.length || 0,
          certificates: data.certificates?.length || 0,
        });
      } else {
        throw new Error("Failed to fetch user stats");
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setUserStats({
        enrolledCourses: 0,
        reviews: 0,
        quizAttempts: 0,
        certificates: 0,
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/courses");
    }
  };

  const popularCategories = [
    { name: "Web Development", icon: "💻", count: 245 },
    { name: "Data Science", icon: "📊", count: 189 },
    { name: "Mobile Development", icon: "📱", count: 156 },
    { name: "Design", icon: "🎨", count: 134 },
    { name: "Business", icon: "💼", count: 98 },
    { name: "Marketing", icon: "📈", count: 87 },
  ];

  const achievements = [
    {
      icon: BookOpen,
      value: userStats.enrolledCourses > 0 ? userStats.enrolledCourses.toLocaleString() : "10+ Courses",
      label: "Enrolled Courses",
    },
    {
      icon: Star,
      value: userStats.reviews > 0 ? userStats.reviews.toLocaleString() : "99+ Review",
      label: "Reviews Given",
    },
    {
      icon: Zap,
      value: userStats.quizAttempts > 0 ? userStats.quizAttempts.toLocaleString() : "Attempt Now!",
      label: "Quizzes Attempted",
    },
    {
      icon: Award,
      value: userStats.certificates > 0 ? userStats.certificates.toLocaleString() : "10+ Available",
      label: "Certificates Earned",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {user && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/40 shadow-sm mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Welcome back, {user.name}!
                </span>
              </div>
            )}

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Learn{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Without
              </span>
              <br />
              Limits
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover thousands of courses from industry experts. Build skills
              that matter and advance your career with hands-on projects and
              real-world experience.
            </p>          

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/student/courses")}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                Explore Courses
              </button>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Play size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Featured Course
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Complete Web Development
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-2/3"></div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Interactive coding exercises",
                  "Real-world projects",
                  "Expert instructor support",
                  "Certificate of completion",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-500" />
                <span className="text-sm font-semibold text-gray-900">
                  4.8★ Rating
                </span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" />
                <span className="text-sm font-semibold text-gray-900">
                  50K+ Students
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/40 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <achievement.icon size={24} className="text-blue-600" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {achievement.value}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;