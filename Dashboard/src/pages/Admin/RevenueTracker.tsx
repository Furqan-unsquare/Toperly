import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { format, parseISO, eachMonthOfInterval, subMonths } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface Course {
  _id: string;
  title: string;
  price: number;
  instructor: { _id: string; name: string; email: string; bio: string; expertise: string[] };
  category: string;
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
  enrolledAt?: string;
  progress?: number;
  certificateIssued?: boolean;
  paymentDetails?: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
  };
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

interface InstructorRevenue {
  [instructorId: string]: {
    name: string;
    totalRevenue: number;
    enrollCount: number;
    courseTitles: string[];
  };
}

interface CategoryRevenue {
  [category: string]: {
    category: string;
    totalRevenue: number;
    enrollCount: number;
    courseTitles: string[];
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  enrollments: number;
}

const AdminRevenueTracker = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueSummary>({});
  const [instructorRevenue, setInstructorRevenue] = useState<InstructorRevenue>({});
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue>({});
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalInstructorsRevenue, setTotalInstructorsRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [topCourse, setTopCourse] = useState<{ title: string; revenue: number } | null>(null);
  const [topInstructor, setTopInstructor] = useState<{ name: string; revenue: number } | null>(null);
  const [topCategory, setTopCategory] = useState<{ category: string; revenue: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff"];

  useEffect(() => {
    fetchData();
  }, [API_BASE]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [enrollRes, coursesRes] = await Promise.all([
        fetch(`${API_BASE}/api/enroll`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }),
        fetch(`${API_BASE}/api/courses`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }),
      ]);

      if (!enrollRes.ok || !coursesRes.ok) {
        throw new Error(`HTTP error! Enroll: ${enrollRes.status}, Courses: ${coursesRes.status}`);
      }

      const enrollData = await enrollRes.json();
      const coursesData = await coursesRes.json();

      console.log("Enrollments Data:", enrollData);
      console.log("Courses Data:", coursesData);

      if (Array.isArray(enrollData) && Array.isArray(coursesData)) {
        const enrichedEnrollments = enrollData.map((enroll: Enrollment) => {
          const fullCourse = coursesData.find((c: Course) => c._id === enroll.course._id) || enroll.course;
          return {
            ...enroll,
            course: {
              ...enroll.course,
              instructor: fullCourse.instructor || {
                _id: "unknown",
                name: "Unknown",
                email: "",
                bio: "",
                expertise: [],
              },
              category: fullCourse.category || "General",
              price: fullCourse.price || 0,
            },
            enrolledAt: enroll.enrolledAt || new Date().toISOString(),
            progress: enroll.progress || 0,
            certificateIssued: enroll.certificateIssued || false,
          };
        });
        processRevenueData(enrichedEnrollments);
        setCourses(coursesData);
      } else {
        console.error("Invalid data format:", { enrollData, coursesData });
        setError("Invalid data format");
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (data: Enrollment[]) => {
    let total = 0;
    const summary: RevenueSummary = {};
    const instructorSummary: InstructorRevenue = {};
    const categorySummary: CategoryRevenue = {};
    const uniqueStudents = new Set();

    const last12Months = eachMonthOfInterval({
      start: subMonths(new Date(), 11),
      end: new Date(),
    });
    const monthlyStats: { [key: string]: { revenue: number; enrollments: number } } = {};
    last12Months.forEach((month) => {
      const monthKey = format(month, "MMM yyyy");
      monthlyStats[monthKey] = { revenue: 0, enrollments: 0 };
    });

    data.forEach((enroll: Enrollment) => {
      const price = enroll.paymentDetails?.amount || enroll.course?.price || 0;
      if (typeof price !== "number" || isNaN(price)) {
        console.warn(`Invalid price for enrollment ${enroll._id}:`, price);
        return;
      }
      total += price;
      uniqueStudents.add(enroll.student._id);

      try {
        const enrollDate = parseISO(enroll.enrolledAt!);
        const monthKey = format(enrollDate, "MMM yyyy");
        if (monthlyStats[monthKey]) {
          monthlyStats[monthKey].revenue += price;
          monthlyStats[monthKey].enrollments += 1;
        } else {
          console.warn(`Month ${monthKey} not initialized, adding to current month`);
          const currentMonth = format(new Date(), "MMM yyyy");
          monthlyStats[currentMonth].revenue += price;
          monthlyStats[currentMonth].enrollments += 1;
        }
      } catch (err) {
        console.warn(`Invalid enrolledAt for enrollment ${enroll._id}:`, enroll.enrolledAt);
        const currentMonth = format(new Date(), "MMM yyyy");
        monthlyStats[currentMonth].revenue += price;
        monthlyStats[currentMonth].enrollments += 1;
      }

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

      const instructorName = enroll.course.instructor?.name || "Unknown";
      const instructorId = enroll.course.instructor?._id || "unknown";
      if (!instructorSummary[instructorId]) {
        instructorSummary[instructorId] = {
          name: instructorName,
          totalRevenue: price,
          enrollCount: 1,
          courseTitles: [enroll.course.title],
        };
      } else {
        instructorSummary[instructorId].totalRevenue += price;
        instructorSummary[instructorId].enrollCount += 1;
        if (!instructorSummary[instructorId].courseTitles.includes(enroll.course.title)) {
          instructorSummary[instructorId].courseTitles.push(enroll.course.title);
        }
      }

      const category = enroll.course.category || "General";
      if (!categorySummary[category]) {
        categorySummary[category] = {
          category,
          totalRevenue: price,
          enrollCount: 1,
          courseTitles: [enroll.course.title],
        };
      } else {
        categorySummary[category].totalRevenue += price;
        categorySummary[category].enrollCount += 1;
        if (!categorySummary[category].courseTitles.includes(enroll.course.title)) {
          categorySummary[category].courseTitles.push(enroll.course.title);
        }
      }
    });

    Object.keys(summary).forEach((courseId) => {
      const course = summary[courseId];
      course.avgProgress = course.avgProgress / course.enrollCount;
      course.completionRate = (course.completionRate / course.enrollCount) * 100;
    });

    const monthlyChartData = Object.entries(monthlyStats).map(([month, stats]) => ({
      month,
      revenue: stats.revenue,
      enrollments: stats.enrollments,
    }));

    const topPerformingCourse = Object.values(summary).reduce(
      (acc, curr) => (curr.totalRevenue > acc.totalRevenue ? curr : acc),
      { courseTitle: "", totalRevenue: 0, enrollCount: 0, avgProgress: 0, completionRate: 0 },
    );

    const topPerformingInstructor = Object.values(instructorSummary).reduce(
      (acc, curr) => (curr.totalRevenue > acc.totalRevenue ? curr : acc),
      { name: "", totalRevenue: 0, enrollCount: 0, courseTitles: [] },
    );

    const topPerformingCategory = Object.values(categorySummary).reduce(
      (acc, curr) => (curr.totalRevenue > acc.totalRevenue ? curr : acc),
      { category: "", totalRevenue: 0, enrollCount: 0, courseTitles: [] },
    );

    console.log("Processed Data:", {
      summary,
      instructorSummary,
      categorySummary,
      monthlyChartData,
      total,
      uniqueStudents: uniqueStudents.size,
    });

    setEnrollments(data);
    setRevenueData(summary);
    setInstructorRevenue(instructorSummary);
    setCategoryRevenue(categorySummary);
    setMonthlyData(
      monthlyChartData.length
        ? monthlyChartData
        : [{ month: "Sep 2025", revenue: 8498, enrollments: 2 }],
    );
    setTotalRevenue(total);
    setTotalInstructorsRevenue(total);
    setTotalStudents(uniqueStudents.size);
    setAverageOrderValue(data.length > 0 ? total / data.length : 0);
    setConversionRate(85.4); // Placeholder
    setTopCourse({
      title: topPerformingCourse.courseTitle,
      revenue: topPerformingCourse.totalRevenue,
    });
    setTopInstructor({
      name: topPerformingInstructor.name,
      revenue: topPerformingInstructor.totalRevenue,
    });
    setTopCategory({
      category: topPerformingCategory.category,
      revenue: topPerformingCategory.totalRevenue,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const courseRevenueData = Object.entries(revenueData).map(([_, data]) => ({
    name: data.courseTitle.length > 15 ? data.courseTitle.substring(0, 15) + "..." : data.courseTitle,
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

  const instructorRevenueData = Object.entries(instructorRevenue).map(([_, data]) => ({
    name: data.name,
    revenue: data.totalRevenue,
    enrollments: data.enrollCount,
  }));

  const topInstructorsData = Object.entries(instructorRevenue)
    .sort(([, a], [, b]) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map(([_, data]) => ({
      name: data.name,
      value: data.totalRevenue,
    }));

  const categoryRevenueData = Object.entries(categoryRevenue).map(([_, data]) => ({
    name: data.category,
    revenue: data.totalRevenue,
    enrollments: data.enrollCount,
  }));

  const topCategoriesData = Object.entries(categoryRevenue)
    .sort(([, a], [, b]) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map(([_, data]) => ({
      name: data.category,
      value: data.totalRevenue,
    }));

  // Chart.js configurations
  const monthlyChartData = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthlyData.map((item) => item.revenue),
        fill: true,
        backgroundColor: "rgba(136, 132, 216, 0.2)",
        borderColor: "#8884d8",
        tension: 0.4,
      },
    ],
  };

  const topCoursesChartData = {
    labels: topCoursesData.map((item) => item.name),
    datasets: [
      {
        data: topCoursesData.map((item) => item.value),
        backgroundColor: COLORS,
      },
    ],
  };

  const topInstructorsChartData = {
    labels: topInstructorsData.map((item) => item.name),
    datasets: [
      {
        data: topInstructorsData.map((item) => item.value),
        backgroundColor: COLORS,
      },
    ],
  };

  const categoryChartData = {
    labels: categoryRevenueData.map((item) => item.name),
    datasets: [
      {
        label: "Revenue (₹)",
        data: categoryRevenueData.map((item) => item.revenue),
        backgroundColor: "#ffc658",
      },
    ],
  };

  const instructorRevenueChartData = {
    labels: instructorRevenueData.map((item) => item.name),
    datasets: [
      {
        label: "Revenue (₹)",
        data: instructorRevenueData.map((item) => item.revenue),
        backgroundColor: "#8884d8",
        yAxisID: "y",
      },
      {
        label: "Enrollments",
        data: instructorRevenueData.map((item) => item.enrollments),
        backgroundColor: "#82ca9d",
        yAxisID: "y1",
      },
    ],
  };

  const courseRevenueChartData = {
    labels: courseRevenueData.map((item) => item.name),
    datasets: [
      {
        label: "Revenue (₹)",
        data: courseRevenueData.map((item) => item.revenue),
        backgroundColor: "#8884d8",
        yAxisID: "y",
      },
      {
        label: "Enrollments",
        data: courseRevenueData.map((item) => item.enrollments),
        backgroundColor: "#82ca9d",
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y || context.parsed;
            return context.dataset.label === "Revenue (₹)"
              ? `₹${value.toLocaleString()}`
              : `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Category",
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue (₹)",
        },
        beginAtZero: true,
      },
      y1: {
        title: {
          display: true,
          text: "Enrollments",
        },
        beginAtZero: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `₹${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Revenue Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive overview of course enrollment, revenue, instructor performance, and category insights
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-500 mt-1">+12.5% from last month</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-blue-600">{enrollments.length}</p>
                <p className="text-xs text-blue-500 mt-1">+8.2% from last month</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-purple-600">₹{averageOrderValue.toFixed(0)}</p>
                <p className="text-xs text-purple-500 mt-1">+5.1% from last month</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-orange-600">{totalStudents}</p>
                <p className="text-xs text-orange-500 mt-1">+15.3% from last month</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <div style={{ width: "100%", height: "300px" }}>
              <Line data={monthlyChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Categories</h3>
            <div style={{ width: "100%", height: "300px" }}>
              <Bar data={categoryChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor Revenue vs Enrollments</h3>
            <div style={{ width: "100%", height: "300px" }}>
              <Bar data={instructorRevenueChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Revenue vs Enrollments</h3>
          <div style={{ width: "100%", height: "400px" }}>
            <Bar data={courseRevenueChartData} options={chartOptions} />
          </div>
        </div>

    
       
      </div>
    </div>
  );
};

export default AdminRevenueTracker;