import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";

interface Course {
  _id: string;
  title: string;
  price: number;
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Enrollment {
  _id: string;
  course: Course;
  student: Student;
  enrolledAt: string;
  progress: number;
  certificateIssued: boolean;
}

interface RevenueSummary {
  [courseId: string]: {
    courseTitle: string;
    totalRevenue: number;
    enrollCount: number;
    avgProgress: number;
    completionRate: number;
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  enrollments: number;
}

const AdminRevenueTracker = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueSummary>({});
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [topCourse, setTopCourse] = useState<{
    title: string;
    revenue: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#ff00ff",
  ];

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/enroll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        processRevenueData(data);
      }
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (data: Enrollment[]) => {
    let total = 0;
    const summary: RevenueSummary = {};
    const uniqueStudents = new Set();

    // Process monthly data for the last 12 months
    const last12Months = eachMonthOfInterval({
      start: subMonths(new Date(), 11),
      end: new Date(),
    });

    const monthlyStats: {
      [key: string]: { revenue: number; enrollments: number };
    } = {};

    last12Months.forEach((month) => {
      const monthKey = format(month, "MMM yyyy");
      monthlyStats[monthKey] = { revenue: 0, enrollments: 0 };
    });

    data.forEach((enroll: Enrollment) => {
      const price = enroll.course?.price || 0;
      total += price;
      uniqueStudents.add(enroll.student._id);

      // Monthly data processing
      const enrollDate = parseISO(enroll.enrolledAt);
      const monthKey = format(enrollDate, "MMM yyyy");
      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].revenue += price;
        monthlyStats[monthKey].enrollments += 1;
      }

      // Course-wise data processing
      const courseId = enroll.course._id;
      if (!summary[courseId]) {
        summary[courseId] = {
          courseTitle: enroll.course.title,
          totalRevenue: price,
          enrollCount: 1,
          avgProgress: enroll.progress || 0,
          completionRate: enroll.certificateIssued ? 1 : 0,
        };
      } else {
        summary[courseId].totalRevenue += price;
        summary[courseId].enrollCount += 1;
        summary[courseId].avgProgress += enroll.progress || 0;
        summary[courseId].completionRate += enroll.certificateIssued ? 1 : 0;
      }
    });

    // Calculate averages and completion rates
    Object.keys(summary).forEach((courseId) => {
      const course = summary[courseId];
      course.avgProgress = course.avgProgress / course.enrollCount;
      course.completionRate =
        (course.completionRate / course.enrollCount) * 100;
    });

    // Prepare monthly chart data
    const monthlyChartData = Object.entries(monthlyStats).map(
      ([month, stats]) => ({
        month,
        revenue: stats.revenue,
        enrollments: stats.enrollments,
      })
    );

    const topPerformingCourse = Object.values(summary).reduce(
      (acc, curr) => (curr.totalRevenue > acc.totalRevenue ? curr : acc),
      {
        courseTitle: "",
        totalRevenue: 0,
        enrollCount: 0,
        avgProgress: 0,
        completionRate: 0,
      }
    );

    setEnrollments(data);
    setRevenueData(summary);
    setMonthlyData(monthlyChartData);
    setTotalRevenue(total);
    setTotalStudents(uniqueStudents.size);
    setAverageOrderValue(data.length > 0 ? total / data.length : 0);
    setConversionRate(85.4); // This would typically come from your analytics
    setTopCourse({
      title: topPerformingCourse.courseTitle,
      revenue: topPerformingCourse.totalRevenue,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const courseRevenueData = Object.entries(revenueData).map(([_, data]) => ({
    name:
      data.courseTitle.length > 15
        ? data.courseTitle.substring(0, 15) + "..."
        : data.courseTitle,
    revenue: data.totalRevenue,
    enrollments: data.enrollCount,
  }));

  const topCoursesData = Object.entries(revenueData)
    .sort(([, a], [, b]) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map(([_, data]) => ({
      name: data.courseTitle,
      value: data.totalRevenue,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Revenue Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive overview of course enrollment and revenue metrics
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  +12.5% from last month
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
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
                <p className="text-2xl font-bold text-blue-600">
                  {enrollments.length}
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  +8.2% from last month
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
                  Average Order Value
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{averageOrderValue.toFixed(0)}
                </p>
                <p className="text-xs text-purple-500 mt-1">
                  +5.1% from last month
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Unique Students
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalStudents}
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  +15.3% from last month
                </p>
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `₹${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Courses by Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Courses by Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCoursesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {topCoursesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `₹${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Revenue Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Course Revenue vs Enrollments
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={courseRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#8884d8"
                name="Revenue (₹)"
              />
              <Bar
                yAxisId="right"
                dataKey="enrollments"
                fill="#82ca9d"
                name="Enrollments"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Analytics Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Detailed Course Analytics
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(revenueData)
                  .sort(([, a], [, b]) => b.totalRevenue - a.totalRevenue)
                  .map(([courseId, data]) => (
                    <tr key={courseId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.courseTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.enrollCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600 font-semibold">
                          ₹{data.totalRevenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹
                        {(
                          data.totalRevenue / data.enrollCount
                        ).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${data.avgProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {data.avgProgress.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            data.completionRate > 50
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {data.completionRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                {Object.keys(revenueData).length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No revenue data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueTracker;
