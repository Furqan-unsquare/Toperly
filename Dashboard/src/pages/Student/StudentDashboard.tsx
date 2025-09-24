import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, TrendingUp, User, Activity, BarChart3, TargetIcon, ChevronRight, Calendar, Edit3, Trophy, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const StudentDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setData);
  }, [API_BASE]);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen">
        {/* Skeleton loading state */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="w-14 h-14 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalCourses = data.enrolledCourses?.length || 0;
  const completedCourses = data.enrolledCourses?.filter((c: any) => c.progress >= 100).length || 0;
  const totalCertificates = data.certificates?.length || 0;
  const totalQuizAttempts = data.quizAttempts?.length || 0;
  const averageQuizScore = totalQuizAttempts > 0 ? Math.round(data.quizAttempts.reduce((acc: number, q: any) => acc + (q.score || 0), 0) / totalQuizAttempts) : 0;
  
  // Assume data.activityDates is an array of 'YYYY-MM-DD' strings representing days with course watching/activity
  const activityDates = data.activityDates || [];
  const activityDateSet = new Set(activityDates);
  const uniqueActivityDates = [...activityDateSet].sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());

  // Calculate learning streak based on consecutive days with activity
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

  // Calculate top category based on total progress
  const categoryProgress: { [key: string]: number } = {};
  data.enrolledCourses?.forEach((c: any) => {
    const cat = c.course?.category || 'Unknown';
    if (!categoryProgress[cat]) categoryProgress[cat] = 0;
    categoryProgress[cat] += c.progress || 0;
  });
  const topCategoryEntries = Object.entries(categoryProgress).sort((a: any, b: any) => b[1] - a[1]);
  const topCategory = topCategoryEntries.length > 0 ? topCategoryEntries[0][0] : 'None';

  // Engagement Score Calculation
  const calculateEngagementScore = () => {
    let score = 0;
    
    // Progress contribution (60%)
    const progressScore = data.enrolledCourses?.reduce(
      (acc: number, c: any) => acc + (c.progress || 0),
      0
    ) / (data.enrolledCourses?.length || 1);
    score += progressScore * 0.6;
    
    // Quiz score contribution (30%)
    score += (averageQuizScore / 100) * 30;
    
    // Reviews contribution (10%)
    const reviewScore = data.reviews?.length * 10;
    score += Math.min(reviewScore, 10);
    
    // Recent activity contribution (20%)
    const recentActivityScore = learningStreak * (20 / 7);
    score += Math.min(recentActivityScore, 20);
    
    return Math.round(score);
  };

  const engagementScore = calculateEngagementScore();

  // Get recent courses (at least 2)
  const recentCourses = data.enrolledCourses?.length 
    ? [...data.enrolledCourses]
        .sort((a: any, b: any) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
        .slice(0, 2)
    : [];

  // Badges data with image URLs
  const badges = [
      { 
        id: 1, 
        name: "First Quiz", 
        png: "https://www.pngarts.com/files/4/Golden-Badge-PNG-Free-Download.png", // Replace with actual PNG path
        earned: data.quizAttempts?.length >= 1, 
        color: "bg-yellow-100 text-yellow-800" 
      },
      { 
        id: 2, 
        name: "Course Completer", 
        png: "https://static.vecteezy.com/system/resources/previews/023/654/780/original/golden-logo-template-it-s-finisher-concept-free-png.png", 
        earned: completedCourses >= 1, 
        color: "bg-purple-100 text-purple-800" 
      },
      { 
        id: 3, 
        name: "5 Courses Master", 
        png: "https://apexlegendsstatus.com/assets/badges/badges_new/you_re_tiering_me_apart_master_rs11.png", 
        earned: completedCourses >= 5, 
        color: "bg-green-100 text-green-800" 
      },
      { 
        id: 4, 
        name: "Perfect Quiz", 
        png: "https://halo.wiki.gallery/images/a/ac/HINF_Medal_Perfect.png", 
        earned: data.quizAttempts?.some((q: any) => q.score >= 100), 
        color: "bg-blue-100 text-blue-800" 
      },
      { 
        id: 5, 
        name: "Streak Master", 
        png: "https://cdn2.iconfinder.com/data/icons/gamification-badges-1/300/streak_7d1-1024.png", 
        earned: learningStreak >= 7, 
        color: "bg-orange-100 text-orange-800" 
      },
      { 
        id: 6, 
        name: "High Scorer", 
        png: "https://cdn-icons-png.flaticon.com/512/7960/7960322.png", 
        earned: data.quizAttempts?.some((q: any) => q.score >= 90), 
        color: "bg-red-100 text-red-800" 
      },
    ];

  // Weekly streak data based on activity
  const weeklyStreakData = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

  // Stats cards data
  const statCards = [
    {
      id: "courses",
      title: "Courses Progress",
      value: `${totalCourses}/${totalCourses}`,
      subtitle: "Courses Completed",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "certificates",
      title: "Certificates",
      value: `${totalCertificates}/${totalCourses}`,
      subtitle: "Certificates Earned",
      icon: Award,
      color: "bg-green-50 text-green-600",
    },
    {
      id: "quizzes",
      title: "Average Quiz Score",
      value: `${averageQuizScore}%`,
      subtitle: "Average across all attempts",
      icon: BarChart3,
      color: "bg-orange-50 text-orange-600",
    },
    {
      id: "categories",
      title: "Top Category",
      value: topCategory,
      // subtitle: "Category with most progress",
      icon: TargetIcon,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  // Engagement gauge component
  const EngagementGauge = ({ score }: { score: number }) => {
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

  // GitHub-style contribution grid based on activity dates
  const ContributionGrid = () => {
    // Generate contribution data for the past 12 weeks (84 days)
    const contributions = (() => {
      const contrib = [];
      const today = new Date();
      for (let i = 83; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dayStr = day.toISOString().slice(0, 10);
        const count = activityDateSet.has(dayStr) ? 1 : 0;
        contrib.push(count);
      }
      return contrib;
    })();

    const activeDays = contributions.filter(c => c > 0).length;
    
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{activeDays} active days in the last 12 weeks</span>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Less</span>
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span className="text-xs text-gray-500">More</span>
          </div>
        </div>
        
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {contributions.map((count, index) => (
            <div 
              key={index}
              className={`w-3 h-3 rounded-sm ${count === 0 ? "bg-gray-100" : "bg-green-500"}`}
              title={`${count > 0 ? "Active" : "No activity"} on this day`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 min-h-screen">
      {/* Header with User Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome Back, {data.profile?.name || "Student"}! 🌟
              </h1>
              <p className="text-gray-600 mt-1">
                {data.profile?.bio || "Continue your learning to achieve your target!"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => navigate("/student/user-profile")}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              className="cursor-pointer transition-all duration-300 border-0 shadow-sm hover:shadow-md"
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} transition-all duration-300 ${
                      hoveredCard === stat.id ? "scale-110" : ""
                    }`}
                  >
                    <Icon className="w-6 h-6" />
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
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      day.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      {day.completed ? "✓" : day.day.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Weekly goal: 5 days</span>
                  <span>{weeklyStreakData.filter(d => d.completed).length}/5</span>
                </div>
                <Progress 
                  value={(weeklyStreakData.filter(d => d.completed).length / 5) * 100} 
                  className={`h-2 ${weeklyStreakData.filter(d => d.completed).length === 0 ? "bg-gray-200" : "bg-green-500"}`} 
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
            {recentCourses.length > 0 ? recentCourses.map((course: any) => (
              <div key={course._id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
            )) : (
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

      {/* Badges Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center text-lg font-semibold">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Earned Badges
            </div>
            <Button variant="ghost" size="sm">
              View all
            </Button>
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
                <p className="text-xs mt-1">
                  {badge.earned ? badge.description : "Locked"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Engagement score is calculated based on: Course progress, Quiz score, Streak, & Activity </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};