import React, { useEffect, useState } from "react";
import {
  Clock,
  Users,
  BookOpen,
  Calendar,
  Check,
  X,
  Clock3,
} from "lucide-react";

const AdminCourseApprovalList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCourseStatus = async (courseId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update course status");

      setCourses(
        courses.map((course) =>
          course._id === courseId
            ? { ...course, isPublished: newStatus }
            : course
        )
      );
    } catch (err) {
      console.error("Error updating course status:", err);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "approved":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <Check className="w-4 h-4 mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <X className="w-4 h-4 mr-1" /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            <Clock3 className="w-4 h-4 mr-1" /> Pending
          </span>
        );
    }
  };

  const getActionButtons = (course) => {
    return (
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
        {course.isPublished !== "approved" && (
          <button
            onClick={() => updateCourseStatus(course._id, "approved")}
            className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approve
          </button>
        )}
        {course.isPublished !== "rejected" && (
          <button
            onClick={() => updateCourseStatus(course._id, "rejected")}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reject
          </button>
        )}
        {course.isPublished !== "pending" && (
          <button
            onClick={() => updateCourseStatus(course._id, "pending")}
            className="px-4 py-2 text-sm font-medium bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Set Pending
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Course Approval
          </h1>
          <p className="text-gray-600">
            Approve, reject, or reset course status
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Check className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter((c) => c.isPublished === "approved").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Clock3 className="w-8 h-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter((c) => c.isPublished === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <X className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter((c) => c.isPublished === "rejected").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-80 lg:flex-shrink-0">
                  <img
                    src={course.thumbnail?.url}
                    alt={course.title}
                    className="w-full h-48 lg:h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-gray-600">
                            by {course.instructor?.name}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-4">
                          {getStatusBadge(course.isPublished)}
                        </div>
                      </div>

                      <p
                        className="text-gray-700 mb-4 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                      ></p>

                      <div className="flex flex-wrap gap-6 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {course.duration} hours
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {course.students || 0} students
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {course.videos?.length || 0} lessons
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="lg:ml-6 lg:flex-shrink-0">
                      {getActionButtons(course)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCourseApprovalList;
