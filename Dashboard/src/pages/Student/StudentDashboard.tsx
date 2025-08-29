import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, TrendingUp, User, Activity,BarChart3,TargetIcon, ChevronRight,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

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

  const totalCourses = data.enrolledCourses?.length;
  const completedCourses = data.enrolledCourses?.filter((c: any) => c.progress >= 100).length || 0;
  const totalCertificates = data.certificates?.length;
  const totalScore = data.quizAttempts?.reduce(
    (acc: number, q: any) => acc + (q.score || 0),
    0
  );
  const avgScore = data.quizAttempts?.length
    ? (totalScore / data.quizAttempts?.length).toFixed(1)
    : "0";

  // Calculate learning streak (days with activity)
  const calculateLearningStreak = () => {
    const enrollmentDate = new Date(data.enrolledCourses[0]?.enrolledAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - enrollmentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 7);
  };

  const learningStreak = calculateLearningStreak();

  // Engagement Score Calculation
  const calculateEngagementScore = () => {
    let score = 0;
    
    const progressScore = data.enrolledCourses?.reduce(
      (acc: number, c: any) => acc + (c.progress || 0),
      0
    ) / (data.enrolledCourses?.length || 1);
    score += progressScore * 0.6;
    
    const quizScore = data.quizAttempts?.length * 10;
    score += Math.min(quizScore, 30);
    
    const reviewScore = data.reviews?.length * 10;
    score += Math.min(reviewScore, 10);
    
    const recentActivityScore = learningStreak * (20/7);
    score += Math.min(recentActivityScore, 20);
    
    return Math.round(score);
  };

  const engagementScore = calculateEngagementScore();

  // Get the most recent course
  const recentCourse = data.enrolledCourses?.length 
    ? data.enrolledCourses.reduce((latest: any, current: any) => {
        const latestDate = new Date(latest.enrolledAt);
        const currentDate = new Date(current.enrolledAt);
        return currentDate > latestDate ? current : latest;
      })
    : null;

  // Updated badges data with PNG images and criteria
  // Assume PNG files are in /assets/badges/ folder, e.g., first-quiz.png, course-completer.png, etc.
  // Adjust paths as needed. If no PNGs, fallback to icons.
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

  // GitHub-style contribution data (mock)
  const contributionData = [
    { day: 'Mon', contributions: 3 },
    { day: 'Tue', contributions: 1 },
    { day: 'Wed', contributions: 4 },
    { day: 'Thu', contributions: 2 },
    { day: 'Fri', contributions: 0 },
    { day: 'Sat', contributions: 6 },
    { day: 'Sun', contributions: 2 },
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
      id: "streak",
      title: "Learning Streak",
      value: `${learningStreak} days`,
      icon: Activity,
      color: "bg-orange-50 text-orange-600",
      change: "+2 days",
      changeType: "increase",
    },
    {
      id: "engagement",
      title: "Engagement Score",
      value: `${engagementScore}/100`,
      icon: TargetIcon,
      color: "bg-purple-50 text-purple-600",
      change: "+15%",
      changeType: "increase",
    },
  ];

  const EngagementGauge = ({ score }: { score: number }) => {
    let status, color;
    
    if (score >= 80) {
      status = "Highly Engaged";
      color = "#10b981";
    } else if (score >= 60) {
      status = "Moderately Engaged";
      color = "#f59e0b";
    } else {
      status = "Needs Improvement";
      color = "#ef4444";
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

  // Contribution heatmap cell component
  const ContributionCell = ({ count }: { count: number }) => {
    let intensity = "bg-gray-100 ";
    if (count > 0) intensity = "bg-green-100";
    if (count > 2) intensity = "bg-green-300";
    if (count > 4) intensity = "bg-green-500";
    
    return (
      <div className={`w-4 h-4 text-center mx-auto mt-2 flex rounded-sm ${intensity} border border-gray-200`} />
    );
  };

  // Function to handle certificate download (mock - implement actual download logic)
  const handleDownloadCertificate = (certId: string) => {
    // Replace with actual API call or link to download
    window.open(`${API_BASE}/api/certificates/${certId}/download`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 min-h-screen">
      {/* Header with Bio */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome back, <br className="block md:hidden"/>{data.profile?.name || "Student"}!
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {data.profile?.bio || "Passionate learner exploring new skills and technologie."}
              </p>
            </div>
          </div>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800 w-full sm:w-auto"
            onClick={() => {
              navigate("/student/user-profile");
            }}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards?.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              className={`cursor-pointer transition-all duration-300 border-0 shadow-sm hover:shadow-md ${
                hoveredCard === stat.id ? "ring-2 ring-gray-200" : ""
              }`}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {stat?.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs sm:text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 ml-1">
                        from last week
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${stat.color} transition-all duration-300 ${
                      hoveredCard === stat.id ? "scale-110" : ""
                    }`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

       {/* Call to Action */}
   <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
  <CardContent className="p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Continue your learning journey</h3>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Pick up where you left off or explore new courses</p>
      </div>
      <Button 
        className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
        onClick={() => navigate("/student/courses")}
      >
        Explore Courses
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  </CardContent>
  
  {/* Recent Course Info */}
  {recentCourse && (
    <div className="mt-6 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 mx-4 sm:mx-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-lg">Recently Enrolled</h4>
          <p className="text-sm text-gray-600 mt-1">{recentCourse.course?.title}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{recentCourse.progress || 0}%</span>
            </div>
            <Progress value={recentCourse.progress || 0} className="h-2 w-full" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          {recentCourse.progress >= 100 && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 w-full sm:w-auto"
              onClick={async () => {
                try {
                  // Find certificate for this course
                  const cert = data.certificates?.find((c: any) => c.course === recentCourse.course?._id);
                  
                  if (cert) {
                    // If certificate already exists, open it
                    window.open(cert.certificateUrl, "_blank");
                  } else {
                    // Generate new certificate
                    const res = await fetch(
                      `${API_BASE}/certificates/issue/${recentCourse.course?._id}/${data._id}`,
                      {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    const certificateData = await res.json();

                    if (!res.ok) {
                      throw new Error(certificateData?.message || "Certificate generation failed");
                    }

                    // Open the certificate in new tab
                    window.open(certificateData.data?.certificateUrl, "_blank");
                    
                    // Refresh user data to include the new certificate
                    const userRes = await fetch(`${API_BASE}/api/auth/me`, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    });
                    const userData = await userRes.json();
                    setData(userData);
                  }
                } catch (err) {
                  console.error("Certificate error:", err);
                  alert(err?.message || "Certificate generation failed");
                }
              }}
            >
              <FileText className="w-4 h-4" />
              View Certificate
            </Button>
          )}
          
          <Button 
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => navigate(`/courses/${recentCourse.course?._id}`)}
          >
            {recentCourse.progress >= 100 ? 'Review Course' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )}
</Card>

        {/* Main Charts Grid (Badges and Engagement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Badges Section - Updated with PNGs and beautiful styling */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>Earned Badges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md ${
                    badge.earned 
                      ? `${badge.color} border-transparent shadow-sm` 
                      : "bg-gray-50 text-gray-400 border-gray-100"
                  }`}
                >
                  <div className={`w-16 h-16 mb-3 relative`}>
                    <img 
                      src={badge.png} 
                      alt={badge.name}
                      className={`w-full h-full object-contain transition-opacity duration-300 ${
                        badge.earned ? "opacity-100" : "opacity-50 grayscale"
                      }`}
                    />
                  </div>
                  <h4 className="font-medium text-sm">{badge.name}</h4>
                  <p className="text-xs mt-1">
                    {badge.earned ? "Earned" : "Locked"}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Badges
            </Button>
          </CardContent>
        </Card>

        {/* Engagement Score - It works as is; the gauge is a circular SVG progress indicator. If it's not rendering correctly, ensure Recharts is installed and imported properly, and check console for errors. If Y-axis issues in other charts, specify domain in YAxis like <YAxis domain={[0, 100]} />. */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Learning Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px] sm:h-80">
            <EngagementGauge score={engagementScore} />
            <p className="mt-4 text-sm text-gray-600 text-center max-w-md">
              Your engagement score is based on course progress, quiz attempts, 
              reviews, and consistent learning activity.
            </p>
          </CardContent>
        </Card> 
      </div>    

      {/* GitHub-style Stats (moved lower) */}
      <Card className="border-0 shadow-sm bg-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
            <span>Learning Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{data.quizAttempts?.length || 0}</h3>
              <p className="text-sm text-gray-600">contributions in last year</p>
            </div>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>Less</span>
              <div className="flex space-x-1 items-center">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`w-3 h-3 rounded-sm ${
                      level === 0 ? "bg-gray-100" : 
                      level === 1 ? "bg-green-100" : 
                      level === 2 ? "bg-green-300" : 
                      level === 3 ? "bg-green-500" : "bg-green-700"
                    }`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
              <div key={day} className="text-center text-xs text-gray-500 font-medium">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {contributionData.map((day, index) => (
              <ContributionCell key={index} count={day.contributions} />
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Learning activity from the last 7 days</p>
          </div>
        </CardContent>
      </Card>      
    </div>
  );
};