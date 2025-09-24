import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  BookOpen,
  Award,
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  User,
  Target,
  Clock,
  Activity,
  TargetIcon,
  Edit3,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const StudentProfile = () => {
  const { id } = useParams(); // Get student _id from URL
  const navigate = useNavigate(); // For navigation
  const [data, setData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id, API_BASE]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching data for ID:", id); // Debug ID
      console.log("API Base URL:", API_BASE); // Debug API URL

      const response = await fetch(`${API_BASE}/api/auth/user-detail/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData); // Debug response

      setData(responseData.data || responseData); // Fallback to responseData if no data field
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">{error || "Student not found"}</p>
          <button
            onClick={fetchProfileData}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalCourses = data.enrolledCourses?.length || 0;
  const totalCertificates = data.certificates?.length || 0;
  const totalReviews = data.reviews?.length || 0;
  const totalScore = data.quizAttempts?.reduce(
    (acc, q) => acc + (q.score || 0),
    0
  ) || 0;
  const avgScore = data.quizAttempts?.length
    ? (totalScore / data.quizAttempts?.length).toFixed(1)
    : "0";
  const completedCourses = data.enrolledCourses?.filter((c) => c.progress >= 100)?.length || 0;
  const totalQuizAttempts = data.quizAttempts?.length || 0;
  const averageQuizScore = totalQuizAttempts > 0
    ? Math.round(data.quizAttempts.reduce((acc, q) => acc + (q.score || 0), 0) / totalQuizAttempts)
    : 0;

  // Learning streak calculation
  const activityDates = data.activityDates || [];
  const activityDateSet = new Set(activityDates);
  const uniqueActivityDates = [...activityDateSet].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const calculateLearningStreak = () => {
    if (!uniqueActivityDates.length) return 0;

    let streak = 1;
    let current = new Date(uniqueActivityDates[uniqueActivityDates.length - 1]);

    for (let i = uniqueActivityDates.length - 2; i >= 0; i--) {
      const prevDate = new Date(uniqueActivityDates[i]);
      if (Math.floor((current.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)) === 1) {
        streak++;
        current = prevDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const learningStreak = calculateLearningStreak();

  // Top category calculation
  const categoryProgress = {};
  data.enrolledCourses?.forEach((c) => {
    const cat = c.course?.category || "Unknown";
    if (!categoryProgress[cat]) categoryProgress[cat] = 0;
    categoryProgress[cat] += c.progress || 0;
  });
  const topCategoryEntries = Object.entries(categoryProgress).sort((a, b) => b[1] - a[1]);
  const topCategory = topCategoryEntries.length > 0 ? topCategoryEntries[0][0] : "None";

  // Engagement score calculation
  const calculateEngagementScore = () => {
    let score = 0;

    const progressScore = data.enrolledCourses?.reduce(
      (acc, c) => acc + (c.progress || 0),
      0
    ) / (data.enrolledCourses?.length || 1);
    score += progressScore * 0.6;

    score += (averageQuizScore / 100) * 30;

    const reviewScore = data.reviews?.length * 10;
    score += Math.min(reviewScore, 10);

    const recentActivityScore = learningStreak * (20 / 7);
    score += Math.min(recentActivityScore, 20);

    return Math.round(score);
  };

  const engagementScore = calculateEngagementScore();

  // Badges data
  const badges = [
    {
      id: 1,
      name: "First Quiz",
      png: "https://www.pngarts.com/files/4/Golden-Badge-PNG-Free-Download.png",
      earned: data.quizAttempts?.length >= 1,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      id: 2,
      name: "Course Completer",
      png: "https://static.vecteezy.com/system/resources/previews/023/654/780/original/golden-logo-template-it-s-finisher-concept-free-png.png",
      earned: completedCourses >= 1,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: 3,
      name: "5 Courses Master",
      png: "https://apexlegendsstatus.com/assets/badges/badges_new/you_re_tiering_me_apart_master_rs11.png",
      earned: completedCourses >= 5,
      color: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      name: "Perfect Quiz",
      png: "https://halo.wiki.gallery/images/a/ac/HINF_Medal_Perfect.png",
      earned: data.quizAttempts?.some((q) => q.score >= 100),
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 5,
      name: "Streak Master",
      png: "https://cdn2.iconfinder.com/data/icons/gamification-badges-1/300/streak_7d1-1024.png",
      earned: learningStreak >= 7,
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: 6,
      name: "High Scorer",
      png: "https://cdn-icons-png.flaticon.com/512/7960/7960322.png",
      earned: data.quizAttempts?.some((q) => q.score >= 90),
      color: "bg-red-100 text-red-800",
    },
  ];

  // Weekly streak data
  const weeklyStreakData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dayStr = day.toISOString().slice(0, 10);
      const completed = activityDateSet.has(dayStr);
      weekData.push({
        day: days[day.getDay()],
        completed,
      });
    }
    return weekData;
  })();

  // Recent courses
  const recentCourses = data.enrolledCourses?.length
    ? [...data.enrolledCourses]
        .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
        .slice(0, 2)
    : [];

  // Course Progress Chart Data
  const progressChartData = data.enrolledCourses?.map((c, idx) => ({
    name: c.course?.title
      ? c.course.title.length > 15
        ? c.course.title.substring(0, 15) + "..."
        : c.course.title
      : `Course ${idx + 1}`,
    fullName: c.course?.title || `Course ${idx + 1}`,
    progress: c.progress || 0,
    completed: c.progress >= 100,
  })) || [];

  // Quiz Performance Data
  const quizData = data.quizAttempts?.slice(-5)?.map((q, idx) => ({
    quiz: `Quiz ${idx + 1}`,
    score: q.score || 0,
    date: q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "N/A",
  })) || [];


  // Monthly Activity Data (mock data - replace with real data if available)
  const monthlyActivity = [
    { month: "Jan", courses: 2, certificates: 0, quizzes: 3 },
    { month: "Feb", courses: 1, certificates: 1, quizzes: 5 },
    { month: "Mar", courses: 3, certificates: 2, quizzes: 8 },
    { month: "Apr", courses: 1, certificates: 1, quizzes: 4 },
    { month: "May", courses: 2, certificates: 3, quizzes: 6 },
    { month: "Jun", courses: 1, certificates: 1, quizzes: 7 },
  ];

  // Updated stat cards
  const statCards = [
    {
      id: "courses",
      title: "Enrolled Courses",
      value: totalCourses,
      subtitle: "Courses Enrolled",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      change: "+12%",
      changeType: "increase",
    },
    {
      id: "certificates",
      title: "Certificates Earned",
      value: totalCertificates,
      subtitle: "Certificates Earned",
      icon: Award,
      color: "bg-green-50 text-green-600",
      change: "+8%",
      changeType: "increase",
    },
    {
      id: "score",
      title: "Avg Quiz Score",
      value: `${averageQuizScore}%`,
      subtitle: "Average across all attempts",
      icon: Trophy,
      color: "bg-purple-50 text-purple-600",
      change: "+15%",
      changeType: "increase",
    },
    {
      id: "categories",
      title: "Top Category",
      value: topCategory,
      subtitle: "Category with most progress",
      icon: TargetIcon,
      color: "bg-orange-50 text-orange-600",
      change: "",
      changeType: "",
    },
  ];

  // Engagement Gauge Component
  const EngagementGauge = ({ score }) => {
    let status, color;

    if (score >= 80) {
      status = "Highly Engaged";
      color = "#10b981"; // green
    } else if (score >= 60) {
      status = "Moderately Engaged";
      color = "#f59e0b"; // amber
    } else {
      status = "Needs Improvement";
      color = "#ef4444"; // red
    }

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 3.39} 340`}
              transform="rotate(-90 60 60)"
            />
            <text
              x="60"
              y="65"
              textAnchor="middle"
              fontSize="24"
              fontWeight="bold"
              fill="#1f2937"
            >
              {score}%
            </text>
          </svg>
        </div>
        <p className="mt-2 font-medium" style={{ color }}>
          {status}
        </p>
      </div>
    );
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${
                entry.dataKey === "progress" ? "%" : ""
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
           <img
                  src={data.profile?.profileImage || 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg'}
                  alt={data.profile?.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {data.profile?.name || data.name || "Student"}
              </h1>
              <p className="text-sm md:text-normal text-gray-600 mt-1">
                Student Profile and Progress Overview
              </p>
            </div>
          </div>
          <div>
            <a href={`mailto:${data.profile?.email || data.email || ""}`}
              className="text-sm font-semibold text-gray-600 hover:underline">
              {data.profile?.email || data.email || "email"}
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              className={`cursor-pointer transition-all duration-300 border-0 shadow-sm hover:shadow-md ${
                hoveredCard === stat.id ? "scale-105 ring-2 ring-gray-200" : ""
              }`}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.change && (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600 font-medium">
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            last month
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Learning Streak & Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Streak Card */}
        <Card className="lg:col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Activity className="w-5 h-5 mr-2 text-orange-500" />
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{learningStreak}</div>
              <p className="text-sm text-gray-600">days in a row</p>

              <div className="mt-6 flex justify-between">
                {weeklyStreakData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        day.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {day.completed ? "✓" : day.day.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Weekly goal: 5 days</span>
                  <span>{weeklyStreakData.filter((d) => d.completed).length}/5</span>
                </div>
                <Progress
                  value={(weeklyStreakData.filter((d) => d.completed).length / 5) * 100}
                  className={`h-2 ${weeklyStreakData.filter((d) => d.completed).length === 0 ? "bg-gray-200" : "bg-green-500"}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Courses Card */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center text-lg font-semibold">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Continue Learning
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/courses")}>
                View all
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{course.course?.title}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress || 0}%</span>
                        </div>
                        <Progress
                          value={course.progress || 0}
                          className={`h-2 ${course.progress === 0 ? "bg-gray-200" : "bg-green-500"}`}
                        />
                      </div>
                      <Button
                        size="sm"
                        className="ml-4"
                        onClick={() => navigate(`/courses/${course.course?._id}`)}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900">No courses yet</h3>
                <p className="text-gray-600 mt-1">Enroll in your first course to start learning</p>
                <Button className="mt-4" onClick={() => navigate("/student/courses")}>
                  Browse Courses
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Score */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <TargetIcon className="w-5 h-5 mr-2 text-purple-500" />
              Engagement Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <EngagementGauge score={engagementScore} />
            <div className="mt-4 max-w-md text-sm text-gray-600 text-center">
              <p>Engagement score is calculated based on: Course progress, Quiz score, Streak, & Activity</p>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <Award className="w-5 h-5 text-green-600" />
              <span>Recent Quiz Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={quizData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="quiz"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="score"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center text-lg font-semibold">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Earned Badges
            </div>
            <Button variant="ghost" size="sm">View all</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md ${
                  badge.earned
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                    : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              >
                <img
                  src={badge.png}
                  alt={badge.name}
                  className={`w-10 h-10 mb-2 ${badge.earned ? "" : "grayscale opacity-50"}`}
                />
                <h4 className="font-medium text-sm">{badge.name}</h4>
                <p className="text-xs mt-1">{badge.earned ? "Earned" : "Locked"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    
    </div>
  );
};

export default StudentProfile;