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
} from "lucide-react";
import { useParams } from "react-router-dom";

const StudentProfile = () => {
  const { id } = useParams(); // Get student _id from URL
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

      const response = await fetch(`${API_BASE}/api/students/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData.data); // Use data field from response
    } catch (error) {
      console.error('Error fetching student data:', error);
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

  // Course Status Distribution
  const courseStatusData = [
    {
      name: "In Progress",
      value: data.enrolledCourses?.filter((c) => c.progress < 100)?.length || 0,
      color: "#6366f1",
    },
    {
      name: "Completed",
      value: data.enrolledCourses?.filter((c) => c.progress >= 100)?.length || 0,
      color: "#10b981",
    },
    {
      name: "Not Started",
      value: data.enrolledCourses?.filter((c) => c.progress === 0)?.length || 0,
      color: "#f59e0b",
    },
  ];

  // Monthly Activity Data (mock data - replace with real data if available)
  const monthlyActivity = [
    { month: "Jan", courses: 2, certificates: 0, quizzes: 3 },
    { month: "Feb", courses: 1, certificates: 1, quizzes: 5 },
    { month: "Mar", courses: 3, certificates: 2, quizzes: 8 },
    { month: "Apr", courses: 1, certificates: 1, quizzes: 4 },
    { month: "May", courses: 2, certificates: 3, quizzes: 6 },
    { month: "Jun", courses: 1, certificates: 1, quizzes: 7 },
  ];

  const statCards = [
    {
      id: "courses",
      title: "Enrolled Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      change: "+12%",
      changeType: "increase",
    },
    {
      id: "certificates",
      title: "Certificates Earned",
      value: totalCertificates,
      icon: Award,
      color: "bg-green-50 text-green-600",
      change: "+8%",
      changeType: "increase",
    },
    {
      id: "score",
      title: "Avg Quiz Score",
      value: `${avgScore}%`,
      icon: Trophy,
      color: "bg-purple-50 text-purple-600",
      change: "+15%",
      changeType: "increase",
    },
  ];

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
    <div className="max-w-5xl mx-auto p-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {data.name || "Student"}
            </h1>
            <p className="text-gray-600 mt-1">
              Student Profile and Progress
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards?.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              className={`cursor-pointer transition-all duration-300 border-0 shadow-sm ${
                hoveredCard === stat.id ? "scale-105 ring-2 ring-gray-200" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        last month
                      </span>
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

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Course Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={progressChartData}>
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#progressGradient)"
                  dot={{ r: 6, fill: "#6366f1" }}
                  activeDot={{ r: 8, fill: "#4f46e5" }}
                />
              </AreaChart>
            </ResponsiveContainer>
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
                  onMouseEnter={(data, index) => {
                    // Add hover effects
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;