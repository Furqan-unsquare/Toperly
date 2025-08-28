import React, { useEffect, useState } from "react";
import {
  Lock,
  Play,
  FileText,
  Clock,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CourseContentList = ({
  course,
  currentVideo,
  setCurrentVideo,
  isEnrolled,
  showToast,
}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/quizzes/course/${course._id}`
        );
        if (res.data.success) {
          setQuizzes(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    };

    if (course?._id) fetchQuizzes();
  }, [course, API_BASE]);

  const videoToQuizMap = quizzes.reduce((map, quiz) => {
    map[quiz.videoId] = quiz._id;
    return map;
  }, {});

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  // Group videos by section title and calculate section stats
  const groupVideosBySection = (videos) => {
    if (!videos || videos.length === 0) return [];

    const grouped = videos.reduce((acc, video) => {
      const sectionTitle = video.title || "Untitled Section";
      if (!acc[sectionTitle]) {
        acc[sectionTitle] = [];
      }
      acc[sectionTitle].push(video);
      return acc;
    }, {});

    // Convert to array format with section stats
    return Object.entries(grouped).map(([title, lectures]) => {
      // Sort lectures by order
      const sortedLectures = lectures.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Calculate total duration for section
      const totalDuration = sortedLectures.reduce((sum, video) => {
        return sum + (video.duration || 0);
      }, 0);

      return {
        title,
        lectures: sortedLectures,
        duration: totalDuration > 0 ? `${totalDuration} min` : "Duration not set",
        lectureCount: sortedLectures.length,
      };
    });
  };

  // Create dummy sections for courses without real content
  const createDummySections = () => {
    return [
      {
        title: "Getting Started",
        lectures: Array.from({ length: 3 }, (_, i) => ({
          _id: `dummy-${i + 1}`,
          description: `Introduction Lesson ${i + 1}`,
          order: i + 1,
          duration: Math.floor(Math.random() * 20) + 10,
          isDummy: true,
        })),
        duration: "45 min",
        lectureCount: 3,
      },
      {
        title: "Core Concepts",
        lectures: Array.from({ length: 4 }, (_, i) => ({
          _id: `dummy-${i + 4}`,
          description: `Core Concept ${i + 1}`,
          order: i + 4,
          duration: Math.floor(Math.random() * 20) + 10,
          isDummy: true,
        })),
        duration: "60 min",
        lectureCount: 4,
      },
    ];
  };

  const hasRealContent = course?.videos && course.videos.length > 0;
  const sections = hasRealContent 
    ? groupVideosBySection(course.videos)
    : createDummySections();

  // Initialize expanded state for all sections
  useEffect(() => {
    const initialExpanded = {};
    sections.forEach((_, index) => {
      initialExpanded[index] = index === 0; // Only first section expanded by default
    });
    setExpandedSections(initialExpanded);
  }, [sections.length]);

  const getTotalStats = () => {
    const totalLectures = sections.reduce((sum, section) => sum + section.lectureCount, 0);
    const totalDuration = hasRealContent ? course.duration || 0 : 2;
    return { totalLectures, totalDuration };
  };

  const { totalLectures, totalDuration } = getTotalStats();

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Course Content
        </h3>
        <div className="text-sm text-gray-600">
          {sections.length} sections • {totalLectures} lectures •{" "}
          {totalDuration}h total
        </div>
      </div>

      {/* Accordion Content */}
      <div className="divide-y divide-gray-200">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-gray-900">{section.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {section.lectureCount} lectures • {section.duration}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  expandedSections[sectionIndex] ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Section Content */}
            {expandedSections[sectionIndex] && (
              <div className="bg-white">
                {section.lectures.map((video, lectureIndex) => {
                  // Calculate global index for locking logic
                  const globalIndex = sections
                    .slice(0, sectionIndex)
                    .reduce((sum, s) => sum + s.lectureCount, 0) + lectureIndex;
                  
                  const isLocked = !hasRealContent || (!isEnrolled && globalIndex > 0);
                  const isActive = currentVideo?._id === video._id;

                  return (
                    <div
                      key={video._id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                        isActive
                          ? "border-l-blue-500 bg-blue-50"
                          : "border-l-transparent"
                      } ${isLocked ? "opacity-60" : ""}`}
                      onClick={() => {
                        if (!hasRealContent) {
                          showToast("Course content coming soon!", "info");
                          return;
                        }

                        if (isEnrolled || globalIndex === 0) {
                          setCurrentVideo(video);
                        } else {
                          showToast(
                            "Please enroll to access all videos",
                            "info"
                          );
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Play className="w-4 h-4 text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 truncate">
                            {video.description}
                          </h5>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <span>Lesson {video.order}</span>
                            {video.duration && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{video.duration} min</span>
                                </div>
                              </>
                            )}
                            {(globalIndex === 0 || !hasRealContent) && (
                              <>
                                <span>•</span>
                                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
                                  {!hasRealContent ? "Coming Soon" : "Preview"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Progress indicator */}
                        {isEnrolled && hasRealContent && !isLocked && (
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                      </div>

                      {/* Quiz button */}
                      {isEnrolled &&
                        hasRealContent &&
                        videoToQuizMap[video._id] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/student/courses/${course._id}/quiz/${
                                  videoToQuizMap[video._id]
                                }`
                              );
                            }}
                            className="ml-3 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded"
                          >
                            Quiz
                          </button>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isEnrolled && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Enroll to access all {totalLectures} lectures
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseContentList;
