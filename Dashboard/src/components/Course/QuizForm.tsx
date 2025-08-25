import { useState, useCallback, useEffect } from "react";
import axios from "axios";

interface QuizFormProps {
  courseId: string;
  courseName: string;
  videoId: any[];
  isOpen: boolean;
  quiz?: Quiz | null;
  onClose: () => void;
  onSuccess: () => void;
}

const QuizForm = ({
  courseId,
  courseName,
  isOpen,
  quiz,
  onClose,
  onSuccess,
}: QuizFormProps) => {
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""], // Start with 4 options
      correctAnswer: 0,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title || "");
      setVideoId(quiz.videoId || "");
      setQuestions(
        Array.isArray(quiz.questions) && quiz.questions.length
          ? quiz.questions
          : [
              {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
              },
            ]
      );
    } else {
      resetForm();
    }
  }, [quiz]);

  useEffect(() => {
    if (isOpen && courseId) {
      const fetchLessons = async () => {
        try {
          console.log("Making API call to:", `/api/courses/${courseId}`);

          const token = localStorage.getItem("token");
          const config = token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : {};

          const res = await axios.get(
            `${API_BASE}/api/courses/${courseId}`,
            config
          );

          console.log("=== API RESPONSE ===");
          console.log("Full response:", res.data);

          // Based on your console output, try these paths:
          let courseVideos = [];

          // Check multiple possible response structures
          if (res.data && res.data.data && res.data.data.videos) {
            courseVideos = res.data.data.videos;
          } else if (res.data && res.data.course && res.data.course.videos) {
            courseVideos = res.data.course.videos;
          } else if (res.data && res.data.videos) {
            courseVideos = res.data.videos;
          } else if (Array.isArray(res.data)) {
            // If the response is directly an array
            courseVideos = res.data;
          } else {
            // Look for any property that contains an array of videos
            Object.keys(res.data).forEach((key) => {
              if (Array.isArray(res.data[key]) && res.data[key].length > 0) {
                const firstItem = res.data[key][0];
                if (
                  firstItem &&
                  (firstItem.title || firstItem.name || firstItem.video)
                ) {
                  courseVideos = res.data[key];
                }
              }
            });
          }

          console.log("Extracted courseVideos:", courseVideos);
          console.log("courseVideos length:", courseVideos.length);

          setLessons(courseVideos);
        } catch (err) {
          console.error("Failed to fetch course", err);
          setLessons([]);
        }
      };

      fetchLessons();
    }
  }, [isOpen, courseId]);

  // ✅ Memoize handlers to prevent unnecessary re-renders
  const handleQuestionChange = useCallback((index: number, value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index].question = value;
      return newQuestions;
    });
  }, []);

  const handleOptionChange = useCallback(
    (qIndex: number, oIndex: number, value: string) => {
      setQuestions((prev) => {
        const newQuestions = [...prev];
        newQuestions[qIndex].options[oIndex] = value;
        return newQuestions;
      });
    },
    []
  );

  const handleCorrectToggle = useCallback((qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIndex].correctAnswer = oIndex;
      return newQuestions;
    });
  }, []);

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  }, []);

  const removeQuestion = useCallback(
    (index: number) => {
      if (questions.length > 1) {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [questions.length]
  );

  const addOption = useCallback((qIndex: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIndex].options.push("");
      return newQuestions;
    });
  }, []);

  const removeOption = useCallback((qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      if (newQuestions[qIndex].options.length > 2) {
        newQuestions[qIndex].options.splice(oIndex, 1);
        // Adjust correct answer if necessary
        if (
          newQuestions[qIndex].correctAnswer >=
          newQuestions[qIndex].options.length
        ) {
          newQuestions[qIndex].correctAnswer = 0;
        }
      }
      return newQuestions;
    });
  }, []);

  // ✅ Reset form function
  const resetForm = useCallback(() => {
    setTitle("");
    setVideoId("");
    setQuestions([
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        course: courseId,
        videoId: videoId || null,
        title,
        questions,
      };

      let response;
      if (quiz?._id) {
        // Update Quiz
        response = await axios.put(
          `${API_BASE}/api/quizzes/${quiz._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // Create Quiz
        response = await axios.post(
          `${API_BASE}/api/quizzes`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      onSuccess();
      onClose();
      resetForm();

      alert(
        quiz?._id ? "Quiz updated successfully!" : "Quiz created successfully!"
      );
      console.log(response.data);
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          (quiz?._id ? "Failed to update quiz" : "Failed to create quiz")
      );
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Create New Quiz</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              ✕
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Course:</strong> {courseName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Lesson (Optional)
            </label>
            <select
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Select a lesson (optional)</option>
              {lessons?.map((lesson, index) => (
                <option key={lesson._id || index} value={lesson._id}>
                  {lesson.title} {/* This will show "Intro to AIML" etc. */}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Question
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border border-gray-200 rounded-lg p-4 mb-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Question {qIndex + 1}</h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Question
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder={`Enter question ${qIndex + 1}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />

                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswer === oIndex}
                        onChange={() => handleCorrectToggle(qIndex, oIndex)}
                        className="w-4 h-4"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="text-red-600 hover:text-red-800 text-sm px-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Option
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {quiz?._id ? "Updating..." : "Creating..."}
                </>
              ) : quiz?._id ? (
                "Update Quiz"
              ) : (
                "Create Quiz"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
