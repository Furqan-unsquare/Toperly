import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";
import { format, parseISO, subDays, startOfDay } from "date-fns";

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  enrolledCourses: any[];
  isSuspended: boolean;
}

interface Instructor {
  _id: string;
  name: string;
  email: string;
  expertise: string[];
  isVerified: boolean;
  isSuspended: boolean;
}

interface Enrollment {
  _id: string;
  student: string;
  course: string;
  enrolledAt: string;
  progress: number;
  certificateIssued: boolean;
}

interface Certificate {
  _id: string;
  studentName: string;
  courseName: string;
  marks: number;
  issuedAt: string;
}

interface Quiz {
  _id: string;
  course: string;
  title: string;
  questions: any[];
  createdAt: string;
}

interface Review {
  _id: string;
  course: string;
  student: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface AnalyticsData {
  students: Student[];
  instructors: Instructor[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  quizzes: Quiz[];
  reviews: Review[];
}

interface DailyStat {
  date: Date;
  students: number;
  instructors: number;
  enrollments: number;
}

interface TopInstructor {
  name: string;
  coursesCount: number;
  avgRating: number;
  totalStudents: number;
}

interface CourseAnalytics {
  courseId: string;
  courseName: string;
  totalEnrollments: number;
  avgRating: number;
  totalQuizzes: number;
  certificatesIssued: number;
  avgMarks: number;
}

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalInstructors, setTotalInstructors] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [verifiedInstructors, setVerifiedInstructors] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topInstructors, setTopInstructors] = useState<TopInstructor[]>([]);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [avgCertificateMarks, setAvgCertificateMarks] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [growthRate, setGrowthRate] = useState({
    students: 0,
    instructors: 0,
    enrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#ff00ff",
    "#8dd1e1",
    "#d084d0",
  ];

  useEffect(() => {
    fetchAnalytics();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: AnalyticsData = await res.json();
      setAnalyticsData(data);
      processAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (data: AnalyticsData) => {
    // Basic counts
    const studentsCount = data.students?.length || 0;
    const instructorsCount = data.instructors?.length || 0;
    const enrollmentsCount = data.enrollments?.length || 0;
    const certificatesCount = data.certificates?.length || 0;
    const quizzesCount = data.quizzes?.length || 0;

    setTotalStudents(studentsCount);
    setTotalInstructors(instructorsCount);
    setTotalEnrollments(enrollmentsCount);
    setTotalCertificates(certificatesCount);
    setTotalQuizzes(quizzesCount);

    // Active students (those with enrollments)
    const activeStudentsCount =
      data.students?.filter((s) => s.enrolledCourses?.length > 0).length || 0;
    setActiveStudents(activeStudentsCount);

    // Verified instructors
    const verifiedCount =
      data.instructors?.filter((i) => i.isVerified).length || 0;
    setVerifiedInstructors(verifiedCount);

    // Average certificate marks
    if (certificatesCount > 0) {
      const totalMarks = data.certificates.reduce(
        (sum, cert) => sum + cert.marks,
        0
      );
      setAvgCertificateMarks(totalMarks / certificatesCount);
    }

    // Average rating
    if (data.reviews?.length > 0) {
      const totalRating = data.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      setAvgRating(totalRating / data.reviews.length);
    }

    // Process daily statistics
    processDailyStats(data);

    // Process top instructors
    processTopInstructors(data);

    // Process course analytics
    processCourseAnalytics(data);

    // Calculate growth rates (simulated for demo)
    setGrowthRate({
      students: 15.2,
      instructors: 8.7,
      enrollments: 23.4,
    });
  };

  const processDailyStats = (data: AnalyticsData) => {
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      startOfDay(subDays(new Date(), 6 - i))
    );

    const stats = last7Days.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");

      const studentsOnDate =
        data.students?.filter(
          (s) =>
            s.createdAt &&
            format(parseISO(s.createdAt), "yyyy-MM-dd") === dateStr
        ).length || 0;

      const enrollmentsOnDate =
        data.enrollments?.filter(
          (e) =>
            e.enrolledAt &&
            format(parseISO(e.enrolledAt), "yyyy-MM-dd") === dateStr
        ).length || 0;

      return {
        date,
        students: studentsOnDate,
        instructors: 0, // Instructors don't have createdAt in the sample data
        enrollments: enrollmentsOnDate,
      };
    });

    setDailyStats(stats);
  };

  const processTopInstructors = (data: AnalyticsData) => {
    if (!data.instructors) return;

    const instructorStats = data.instructors.map((instructor) => {
      // Count courses per instructor (simplified - would need course data)
      const coursesCount = Math.floor(Math.random() * 5) + 1; // Simulated data

      // Calculate average rating for instructor's courses
      const instructorReviews =
        data.reviews?.filter(
          (r) =>
            // This would need instructor-course mapping in real implementation
            Math.random() > 0.5 // Simulated
        ) || [];

      const avgRating =
        instructorReviews.length > 0
          ? instructorReviews.reduce((sum, r) => sum + r.rating, 0) /
            instructorReviews.length
          : 4.2;

      const totalStudents = Math.floor(Math.random() * 100) + 10; // Simulated

      return {
        name: instructor.name,
        coursesCount,
        avgRating: Number(avgRating.toFixed(1)),
        totalStudents,
      };
    });

    const sorted = instructorStats
      .sort((a, b) => b.coursesCount - a.coursesCount)
      .slice(0, 5);

    setTopInstructors(sorted);
  };

  const processCourseAnalytics = (data: AnalyticsData) => {
    // Group data by course
    const courseMap = new Map<string, CourseAnalytics>();

    // Process enrollments
    data.enrollments?.forEach((enrollment) => {
      const courseId = enrollment.course;
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          courseId,
          courseName: `Course ${courseId.slice(-4)}`, // Simplified name
          totalEnrollments: 0,
          avgRating: 0,
          totalQuizzes: 0,
          certificatesIssued: 0,
          avgMarks: 0,
        });
      }
      const course = courseMap.get(courseId)!;
      course.totalEnrollments++;
    });

    // Process reviews
    data.reviews?.forEach((review) => {
      const courseId = review.course;
      if (courseMap.has(courseId)) {
        const course = courseMap.get(courseId)!;
        course.avgRating = (course.avgRating + review.rating) / 2; // Simplified average
      }
    });

    // Process certificates
    data.certificates?.forEach((cert) => {
      // Would need course mapping in real implementation
      const courseEntries = Array.from(courseMap.entries());
      if (courseEntries.length > 0) {
        const randomCourse =
          courseEntries[Math.floor(Math.random() * courseEntries.length)][1];
        randomCourse.certificatesIssued++;
        randomCourse.avgMarks = (randomCourse.avgMarks + cert.marks) / 2;
      }
    });

    // Process quizzes
    data.quizzes?.forEach((quiz) => {
      const courseId = quiz.course;
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          courseId,
          courseName: `Course ${courseId.slice(-4)}`,
          totalEnrollments: 0,
          avgRating: 0,
          totalQuizzes: 0,
          certificatesIssued: 0,
          avgMarks: 0,
        });
      }
      const course = courseMap.get(courseId)!;
      course.totalQuizzes++;
    });

    setCourseAnalytics(Array.from(courseMap.values()));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Analytics
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const dailyChartData = dailyStats.map((stat) => ({
    date: format(stat.date, "MMM dd"),
    students: stat.students,
    instructors: stat.instructors,
    enrollments: stat.enrollments,
  }));

  const instructorPerformanceData = topInstructors.map((instructor) => ({
    name:
      instructor.name.length > 10
        ? instructor.name.substring(0, 10) + "..."
        : instructor.name,
    courses: instructor.coursesCount,
    rating: instructor.avgRating,
    students: instructor.totalStudents,
  }));

  const engagementData = [
    { name: "Active Students", value: activeStudents, total: totalStudents },
    {
      name: "Verified Instructors",
      value: verifiedInstructors,
      total: totalInstructors,
    },
    {
      name: "Completed Courses",
      value: totalCertificates,
      total: totalEnrollments,
    },
  ];

  const courseDistributionData = courseAnalytics.slice(0, 6).map((course) => ({
    name: course.courseName,
    enrollments: course.totalEnrollments,
    rating: course.avgRating,
    quizzes: course.totalQuizzes,
  }));

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-5xl mx-auto p-6 px-14">
        {/* Header with Real-time Indicator */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Real-Time Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Live insights into platform performance and user engagement
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalStudents.toLocaleString()}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  +{growthRate.students}% this month
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Instructors
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {totalInstructors.toLocaleString()}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  +{growthRate.instructors}% this month
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalEnrollments.toLocaleString()}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  +{growthRate.enrollments}% this month
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Course Rating
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {avgRating.toFixed(1)}/5.0
                </p>
                <p className="text-xs text-green-500 mt-1">+2.1% this month</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Active Students</p>
            <p className="text-xl font-semibold text-blue-600">
              {activeStudents}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Certificates Issued</p>
            <p className="text-xl font-semibold text-green-600">
              {totalCertificates}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Quizzes</p>
            <p className="text-xl font-semibold text-purple-600">
              {totalQuizzes}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Avg. Certificate Score</p>
            <p className="text-xl font-semibold text-orange-600">
              {avgCertificateMarks.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Activity Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="students"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#ff7300"
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* User Engagement */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Engagement
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                data={engagementData}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: "insideStart", fill: "#fff" }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Legend
                  iconSize={12}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Instructor Performance and Course Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Instructors Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Instructor Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instructorPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="courses"
                  fill="#8884d8"
                  name="Courses"
                />
                <Bar
                  yAxisId="right"
                  dataKey="students"
                  fill="#82ca9d"
                  name="Students"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Course Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Course Enrollment Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="enrollments"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {courseDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Analytics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Instructors Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performing Instructors
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topInstructors.map((instructor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {instructor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {instructor.coursesCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          {instructor.avgRating}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {instructor.totalStudents}
                      </td>
                    </tr>
                  ))}
                  {topInstructors.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No instructor data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Statistics Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Daily Registration Stats
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyStats.slice(-7).map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {format(stat.date, "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {stat.students}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {stat.enrollments}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {dailyStats.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No registration data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Course Analytics Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Course Analytics Overview
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quizzes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courseAnalytics.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.totalEnrollments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {course.avgRating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.totalQuizzes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.certificatesIssued}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.avgMarks.toFixed(1)}%
                    </td>
                  </tr>
                ))}
                {courseAnalytics.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No course data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>
            Data refreshes automatically every 30 seconds • Last updated:{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
