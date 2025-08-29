import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Users, BookOpen, Award } from "lucide-react";

const InstructorProfile = ({ instructorId }) => {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/api/instructors/${instructorId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch instructor: ${response.statusText}`);
        }

        const data = await response.json();
        setInstructor(data.data); // Changed from data.instructor to data.data
      } catch (err) {
        console.error("Error fetching instructor:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="mt-6 h-16 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        Instructor not found
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          About the Instructor
        </h3>
      </div>

      {/* Instructor Profile */}
      <div className="p-6">
        <div className="flex flex-col gap-6">
          {/* Top Section - Avatar and Basic Info */}
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            <img
              src={instructor.profileImage || "https://via.placeholder.com/96"}
              alt={instructor.name || "Instructor"}
              className="w-24 h-24 rounded-full"
            />
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-blue-600 mb-1">
                {instructor.name || "Unknown Instructor"}
              </h4>
              <p className="text-gray-600 font-medium mb-2">
                {instructor.title || "Instructor"}
              </p>
              <p className="text-gray-500 text-sm">
                {instructor.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Bottom Section - Bio and Expertise (Full Width) */}
          <div className="space-y-4">
            {/* Bio */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Bio</h5>
              <p className="text-gray-700 leading-relaxed">
                {instructor.bio || "No bio available"}
              </p>
            </div>

            {/* Detailed Bio */}
            <div
              className={`space-y-3 text-sm text-gray-600 transition-all duration-300 overflow-hidden ${
                showFullBio ? "max-h-none opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {instructor.detailedBio ? (
                <>
                  <p>{instructor.detailedBio.paragraph1}</p>
                  <p>{instructor.detailedBio.paragraph2}</p>
                  <p>{instructor.detailedBio.paragraph3}</p>
                </>
              ) : (
                <p>No detailed bio available</p>
              )}
            </div>

            {/* Expertise */}
            {showFullBio && instructor.expertise && (
              <div className="pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">
                  Areas of Expertise
                </h5>
                <div className="flex flex-wrap gap-2">
                  {instructor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Experience */}
            {showFullBio && (instructor.education || instructor.experience) && (
              <div className="pt-4 border-t border-gray-200 grid md:grid-cols-2 gap-4">
                {instructor.education && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Education
                    </h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      {instructor.education.map((edu, index) => (
                        <div key={index}>{edu}</div>
                      ))}
                    </div>
                  </div>
                )}
                {instructor.experience && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Experience
                    </h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      {instructor.experience.map((exp, index) => (
                        <div key={index}>{exp}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show More/Less Button */}
            <div className="pt-4">
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center transition-colors"
              >
                {showFullBio ? "Show less" : "Show more"}
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    showFullBio ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;

