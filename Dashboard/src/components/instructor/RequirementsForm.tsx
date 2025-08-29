import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, X } from "lucide-react";

const RequirementsForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [requirements, setRequirements] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [fetchingRequirements, setFetchingRequirements] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

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

  // Fetch existing requirements when course is selected
  useEffect(() => {
    const fetchExistingRequirements = async () => {
      if (!selectedCourse) {
        setRequirements([""]);
        setSelectedCourseTitle("");
        return;
      }

      // Set course title
      const course = courses.find((c) => c._id === selectedCourse);
      setSelectedCourseTitle(course?.title || "");

      setFetchingRequirements(true);
      try {
        const { data } = await axios.get(
          `${API_BASE}/requirements/course/${selectedCourse}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.requirements && data.requirements.length > 0) {
          setRequirements(data.requirements);
          setMessage("Existing requirements loaded for editing.");
        } else {
          setRequirements([""]);
          setMessage("");
        }
      } catch (error) {
        // No existing requirements found, start fresh
        setRequirements([""]);
        setMessage("");
      } finally {
        setFetchingRequirements(false);
      }
    };

    fetchExistingRequirements();
  }, [selectedCourse, courses]);

  const addRequirementField = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirementField = (index) => {
    if (requirements.length > 1) {
      const updatedRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(updatedRequirements);
    }
  };

  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      setMessage("Please select a course.");
      return;
    }

    const filteredRequirements = requirements.filter(
      (req) => req.trim() !== ""
    );
    if (filteredRequirements.length === 0) {
      setMessage("Please add at least one requirement.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/requirements`,
        {
          courseId: selectedCourse,
          requirements: filteredRequirements,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Requirements saved successfully!");
      setRequirements(filteredRequirements);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to save requirements.");
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
            Manage Course Requirements
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
                disabled={fetchingRequirements}
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Requirements Fields */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Course Requirements
              </label>

              {fetchingRequirements ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">
                    Loading existing requirements...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) =>
                          handleRequirementChange(index, e.target.value)
                        }
                        placeholder={`Enter requirement ${index + 1}`}
                        className="border border-gray-300 rounded-lg flex-1 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirementField(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addRequirementField}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add More Requirements
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || fetchingRequirements}
            >
              {loading ? "Saving..." : "Save Requirements"}
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
                  Requirements
                </h5>

                {requirements.filter((req) => req.trim() !== "").length > 0 ? (
                  <ul className="space-y-2">
                    {requirements
                      .filter((req) => req.trim() !== "")
                      .map((requirement, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-700 text-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {requirement}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No requirements added yet.
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

export default RequirementsForm;
