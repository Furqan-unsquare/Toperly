import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Plus, X } from "lucide-react";

const LearningPointsForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [points, setPoints] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [fetchingPoints, setFetchingPoints] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = "http://localhost:5000/api";

  // Fetch current user's courses from /api/auth/me
  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = response.data;
        setCourses(userData.courses || []);
      } catch (error) {
        console.error("Error fetching user courses:", error);
      }
    };
    fetchUserCourses();
  }, []);

  // Fetch existing learning points when course is selected
  useEffect(() => {
    const fetchExistingPoints = async () => {
      if (!selectedCourse) {
        setPoints([""]);
        setSelectedCourseTitle("");
        return;
      }

      // Set course title
      const course = courses.find((c) => c._id === selectedCourse);
      setSelectedCourseTitle(course?.title || "");

      setFetchingPoints(true);
      try {
        const { data } = await axios.get(
          `${API_BASE}/learning-points/course/${selectedCourse}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.points && data.points.length > 0) {
          setPoints(data.points);
          setMessage("Existing learning points loaded for editing.");
        } else {
          setPoints([""]);
          setMessage("");
        }
      } catch (error) {
        // No existing points found, start fresh
        setPoints([""]);
        setMessage("");
      } finally {
        setFetchingPoints(false);
      }
    };

    fetchExistingPoints();
  }, [selectedCourse, courses]);

  const addPointField = () => {
    setPoints([...points, ""]);
  };

  const removePointField = (index) => {
    if (points.length > 1) {
      const updatedPoints = points.filter((_, i) => i !== index);
      setPoints(updatedPoints);
    }
  };

  const handlePointChange = (index, value) => {
    const updatedPoints = [...points];
    updatedPoints[index] = value;
    setPoints(updatedPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      setMessage("Please select a course.");
      return;
    }

    const filteredPoints = points.filter((point) => point.trim() !== "");
    if (filteredPoints.length === 0) {
      setMessage("Please add at least one learning point.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/learning-points`,
        {
          courseId: selectedCourse,
          points: filteredPoints,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Learning points saved successfully!");
      setPoints(filteredPoints);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to save learning points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 shadow-lg rounded-lg">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Manage Learning Points
          </h2>

          {message && (
            <div
              className={`mb-4 p-3 rounded ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Course Dropdown */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Select Course
              </label>
              <select
                className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={fetchingPoints}
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Points Fields */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Learning Points
              </label>

              {fetchingPoints ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">
                    Loading existing points...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {points.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handlePointChange(index, e.target.value)}
                        placeholder={`Enter learning point ${index + 1}`}
                        className="border border-gray-300 rounded-lg flex-1 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePointField(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addPointField}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add More Points
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || fetchingPoints}
            >
              {loading ? "Saving..." : "Save Learning Points"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Preview</h3>

          {selectedCourseTitle && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                {selectedCourseTitle}
              </h4>

              <div className="mb-4">
                <h5 className="text-lg font-medium text-gray-900 mb-3">
                  What you'll learn
                </h5>

                {points.filter((point) => point.trim() !== "").length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {points
                      .filter((point) => point.trim() !== "")
                      .map((point, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No learning points added yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {!selectedCourse && (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-500">
                Select a course to see the preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPointsForm;
