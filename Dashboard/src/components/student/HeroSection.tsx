// components/HeroSection.jsx
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
  fetchStats();
 }, [API_BASE]);

  const fetchStats = async () => {
    try {
      // You can create an endpoint for stats or use existing data
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
      // Fallback stats
      setStats({
        totalCourses: 1000,
        totalStudents: 25000,
        totalInstructors: 150,
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
      icon: Users,
      value: stats.totalStudents.toLocaleString(),
      label: "Active Students",
    },
    {
      icon: BookOpen,
      value: stats.totalCourses.toLocaleString(),
      label: "Courses Available",
    },
    {
      icon: Award,
      value: stats.totalInstructors.toLocaleString(),
      label: "Expert Instructors",
    },
    { icon: Star, value: "4.8", label: "Average Rating" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Welcome Message for Logged-in Users */}
            {user && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/40 shadow-sm mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Welcome back, {user.name}!
                </span>
              </div>
            )}

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Learn{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Without
              </span>
              <br />
              Limits
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover thousands of courses from industry experts. Build skills
              that matter and advance your career with hands-on projects and
              real-world experience.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What would you like to learn?"
                  className="w-full pl-12 pr-32 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white/80 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center px-6 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Explore Courses
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-all duration-200 font-semibold border border-gray-200 shadow-sm hover:shadow-md"
              >
                Learn More
              </button>
            </div>

            {/* Popular Categories */}
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-500 mb-4">
                Popular Categories:
              </p>
              <div className="flex flex-wrap gap-3">
                {popularCategories.slice(0, 4).map((category, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      navigate(
                        `/courses?category=${encodeURIComponent(
                          category.name.toLowerCase().replace(" ", "-")
                        )}`
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40 hover:bg-white/80 transition-all duration-200 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            {/* Main Visual Card */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Course Preview */}
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

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-2/3"></div>
                </div>
              </div>

              {/* Features */}
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

            {/* Floating Stats Cards */}
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
