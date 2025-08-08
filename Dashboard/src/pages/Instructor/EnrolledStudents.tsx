import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Play,
  CheckCircle,
  Search,
  Filter,
  Download,
  Eye,
  BarChart3,
  Calendar,
} from "lucide-react";
import axios from "axios";

const EnrolledStudents = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Using axios would require import, simulating the API call structure
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        // Simulating your existing API call structure
        const res = await axios.post(
          "http://192.168.1.29:5000/api/students/get-mystudents",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data.data);
        setStudentsData(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Calculate analytics
  const calculateAnalytics = () => {
    if (studentsData.length === 0)
      return {
        totalStudents: 0,
        totalCourses: 0,
        avgProgress: 0,
        certificatesIssued: 0,
      };

    const totalStudents = new Set(
      studentsData.map((s) => s.student?._id || s.student?.id)
    ).size;
    const totalCourses = new Set(
      studentsData.map((s) => s.course?._id || s.course?.id)
    ).size;
    const avgProgress = (
      studentsData.reduce((acc, cur) => acc + (cur.progress || 0), 0) /
      studentsData.length
    ).toFixed(1);
    const certificatesIssued = studentsData.filter(
      (s) => s.certificateIssued
    ).length;

    return { totalStudents, totalCourses, avgProgress, certificatesIssued };
  };

  const analytics = calculateAnalytics();

  // Filter data
  const filteredData = studentsData.filter((entry) => {
    const matchesSearch =
      entry.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" || entry.course?._id === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const uniqueCourses = [
    ...new Set(
      studentsData.map((s) => ({ id: s.course?._id, title: s.course?.title }))
    ),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">
            Loading student analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className=" border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Student Analytics Dashboard
                </h1>
                <p className="text-slate-600 mt-1">
                  Monitor student progress and course performance
                </p>
              </div>
              <div className="flex items-center space-x-3"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {analytics.totalStudents}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-4">↗ Active learners</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Courses Taught
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {analytics.totalCourses}
                  </p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-xs text-emerald-600 mt-4">↗ Active courses</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Avg Progress
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {analytics.avgProgress}%
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-4">
                ↗ Overall completion
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Certificates
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {analytics.certificatesIssued}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-4">
                ↗ Achievements earned
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search students, courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                  >
                    <option value="all">All Courses</option>
                    {uniqueCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <div className="w-5 h-5 grid grid-cols-2 gap-1">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "table"
                      ? "bg-blue-100 text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <div className="w-5 h-5 flex flex-col space-y-1">
                    <div className="h-1 bg-current rounded"></div>
                    <div className="h-1 bg-current rounded"></div>
                    <div className="h-1 bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {studentsData.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Students Found
              </h3>
              <p className="text-slate-600">
                There are no enrolled students to display at the moment.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredData.map((entry) => (
                <StudentCard key={entry._id} data={entry} />
              ))}
            </div>
          ) : (
            <StudentTable data={filteredData} />
          )}
        </div>
      </div>
    </div>
  );
};

const StudentCard = ({ data }) => {
  const { student, course, progress, certificateIssued, videoProgress } = data;
  const completedVideos =
    videoProgress?.filter((vp) => vp.completed).length || 0;
  const totalVideos = videoProgress?.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {student?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "NA"}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {student?.name || "Unknown"}
            </h3>
            <p className="text-sm text-slate-500">{student?.email}</p>
          </div>
        </div>
        {certificateIssued && (
          <div className="bg-emerald-100 p-2 rounded-full">
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-slate-600 mb-1">Course</p>
        <p className="text-slate-900">{course?.title || "Unknown Course"}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Progress</span>
          <span className="text-sm font-semibold text-slate-900">
            {progress || 0}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 text-slate-600">
          <Play className="w-4 h-4" />
          <span>
            {completedVideos}/{totalVideos} videos
          </span>
        </div>
        <div className="flex items-center space-x-1 text-slate-600">
          <Clock className="w-4 h-4" />
          <span>Active</span>
        </div>
      </div>

      {videoProgress && videoProgress.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600 mb-2">
            Recent Activity
          </p>
          <div className="space-y-2">
            {videoProgress.slice(0, 2).map((vp, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-600 truncate">{vp.videoTitle}</span>
                <span
                  className={`font-medium ${
                    vp.completed ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {vp.progressPercentage?.toFixed(0) || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StudentTable = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">
                Student
              </th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">
                Course
              </th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">
                Progress
              </th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">
                Certificate
              </th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">
                Videos
              </th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((entry) => (
              <tr
                key={entry._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {entry.student?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "NA"}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {entry.student?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {entry.student?.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-slate-900">
                    {entry.course?.title || "Unknown Course"}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${entry.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {entry.progress || 0}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {entry.certificateIssued ? (
                    <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      <span>Issued</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      <span>Pending</span>
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-slate-600">
                    {entry.videoProgress?.filter((vp) => vp.completed).length ||
                      0}{" "}
                    / {entry.videoProgress?.length || 0}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrolledStudents;
