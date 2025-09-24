import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import axios from "axios";

const LearningObjectives = ({ courseId }) => {
  const [learningPoints, setLearningPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    const fetchLearningPoints = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE}/learning-points/course/${courseId}`
        );
        
        if (response.data && response.data.points) {
          setLearningPoints(response.data.points);
        } else {
          setLearningPoints([]);
        }
      } catch (err) {
        console.error("Error fetching learning points:", err);
        // If no learning points found (404), show empty state instead of error
        if (err.response?.status === 404) {
          setLearningPoints([]);
        } else { 
          setError("Failed to load learning objectives");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPoints();
  }, [courseId, API_BASE]);

  // Loading state
  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          What you'll learn
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-start animate-pulse">
              <div className="w-4 h-4 bg-gray-300 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
              <div className="h-4 bg-gray-300 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          What you'll learn
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Main content with dynamic learning points
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        What you'll learn
      </h3>      

        <div>
          <ul>
            <li>A Course that teach you everything at one place</li>
          </ul>
        </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {learningPoints.map((point, index) => (
          <div key={index} className="flex items-start">
            <CheckCircle
              size={16}
              className="text-green-600 mr-3 mt-0.5 flex-shrink-0"
            />
            <span className="text-gray-700 text-sm">{point}</span>
          </div>
        ))}
      </div> */}
      
    </div>
  );
};

export default LearningObjectives;
