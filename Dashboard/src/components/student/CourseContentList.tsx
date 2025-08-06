import React, { useEffect, useState } from "react";
import { Lock, Play } from "lucide-react";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/course/${course._id}`
        );
        if (res.data.success) {
          console.log(res);
          setQuizzes(res.data.data); // array of quizzes
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    };

    if (course?._id) fetchQuizzes();
  }, [course]);

  if (!course?.videos || course.videos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No lessons available yet
      </div>
    );
  }

  // Create a map for quick videoId -> quizId lookup
  const videoToQuizMap = quizzes.reduce((map, quiz) => {
    map[quiz.videoId] = quiz._id;
    return map;
  }, {});

  console.log(quizzes);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Course Content</h3>
      <div className="space-y-2">
        {course.videos.map((video) => (
          <div
            key={video._id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg cursor-pointer ${
              currentVideo?._id === video._id
                ? "bg-blue-100 border border-blue-300"
                : isEnrolled
                ? "hover:bg-gray-100"
                : "cursor-not-allowed opacity-75"
            }`}
            onClick={() => {
              if (isEnrolled) setCurrentVideo(video);
              else showToast("Please enroll to access the videos", "info");
            }}
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div>
                {isEnrolled ? (
                  <Play size={16} className="text-blue-600" />
                ) : (
                  <Lock size={16} />
                )}
              </div>
              <div>
                <div className="text-sm font-medium">{video.title}</div>
                <div className="text-xs text-gray-500">
                  Lesson {video.order}
                </div>
              </div>
            </div>

            {isEnrolled && videoToQuizMap[video._id] && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent video click
                  navigate(
                    `/courses/${course._id}/quiz/${videoToQuizMap[video._id]}`
                  );
                }}
                className="mt-2 sm:mt-0 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded"
              >
                Take Quiz
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContentList;
