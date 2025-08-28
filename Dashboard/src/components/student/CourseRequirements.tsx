// components/student/CourseRequirements.jsx
import React, { useEffect, useState } from "react";
import { Edit3, Plus } from "lucide-react";
import axios from "axios";

const CourseRequirements = ({ courseId, isAdmin = false }) => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editRequirements, setEditRequirements] = useState([]);

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchRequirements();
  }, [courseId]);

  const fetchRequirements = async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/requirements/course/${courseId}`
      );
      
      if (response.data && response.data.requirements) {
        setRequirements(response.data.requirements);
      } else {
        setRequirements([]);
      }
    } catch (err) {
      console.error("Error fetching requirements:", err);
      if (err.response?.status === 404) {
        setRequirements([]);
      } else {
        setError("Failed to load requirements");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditRequirements([...requirements]);
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const filteredRequirements = editRequirements.filter(req => req.trim() !== '');
      await axios.post(`${API_BASE}/requirements`, {
        courseId,
        requirements: filteredRequirements
      });
      
      setRequirements(filteredRequirements);
      setEditMode(false);
    } catch (err) {
      console.error("Error saving requirements:", err);
    }
  };

  const handleCancel = () => {
    setEditRequirements([]);
    setEditMode(false);
  };

  const addRequirement = () => {
    setEditRequirements([...editRequirements, ""]);
  };

  const updateRequirement = (index, value) => {
    const updated = [...editRequirements];
    updated[index] = value;
    setEditRequirements(updated);
  };

  const removeRequirement = (index) => {
    const updated = editRequirements.filter((_, i) => i !== index);
    setEditRequirements(updated);
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Requirements
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start animate-pulse">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 mt-2 flex-shrink-0"></div>
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
          Requirements
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Default requirements if none set
  const defaultRequirements = [
    "No prior experience necessary",
    "A computer with internet access",
    "Willingness to learn and practice",
    "Basic understanding of computers",
  ];

  const displayRequirements = requirements.length > 0 ? requirements : defaultRequirements;
  const showDefaultNote = requirements.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Requirements
        </h3>
        {isAdmin && !editMode && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Edit3 size={14} />
            Edit
          </button>
        )}
      </div>

      {editMode ? (
        <div className="space-y-4">
          {editRequirements.map((requirement, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Requirement ${index + 1}`}
              />
              <button
                onClick={() => removeRequirement(index)}
                className="px-3 py-2 text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          
          <button
            onClick={addRequirement}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus size={14} />
            Add requirement
          </button>
          
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {displayRequirements.map((requirement, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700 text-sm"
              >
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                {requirement}
              </li>
            ))}
          </ul>
          
          {/* {showDefaultNote && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-xs">
                <strong>Note:</strong> Specific requirements for this course are being updated.
              </p>
            </div>
          )} */}
          
          
        </>
      )}
    </div>
  );
};

export default CourseRequirements;
