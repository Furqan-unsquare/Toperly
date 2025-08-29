import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  Video,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  X,
  Save,
  Loader,
} from "lucide-react";

interface Quiz {
  _id: string;
  title: string;
  course: {
    _id: string;
    title: string;
  };
  videoId?: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  _id: string;
  title: string;
  videos?: Array<{
    _id: string;
    title: string;
  }>;
}

interface AuthMeResponse {
  profile: {
    _id: string;
    [key: string]: any;
  };
  courses: Course[];
}

const API_BASE = import.meta.env.VITE_API_URL;

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    videoId: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [courseLessons, setCourseLessons] = useState<
    Array<{ _id: string; title: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const usedVideoIds = new Set<string>(
    quizzes
      .filter((q) => q.videoId)
      .map((q) => q.videoId as string)
  );

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token missing. Please log in.");
      }

      // Fetch instructor data and courses
      const userResponse = await axios.get<AuthMeResponse>(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { profile, courses } = userResponse.data;
      if (!profile?._id) {
        throw new Error("Instructor ID not found in user profile.");
      }

      setInstructorId(profile._id);
      setCourses(Array.isArray(courses) ? courses : []);

      // Fetch quizzes
      await fetchQuizzes(profile._id, token);
    } catch (err: any) {
      console.error("Failed to fetch instructor data:", err);
      setError(err.message || "Failed to load data. Please try again.");
      setQuizzes([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async (instructorId: string, token: string) => {
    try {
      const response = await axios.get(`${API_BASE}/api/quizzes?instructorId=${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quizData = response.data;
      if (Array.isArray(quizData)) {
        setQuizzes(quizData);
      } else if (quizData && Array.isArray(quizData.data)) {
        setQuizzes(quizData.data);
      } else if (quizData && Array.isArray(quizData.quizzes)) {
        setQuizzes(quizData.quizzes);
      } else {
        console.warn("Unexpected quiz data structure:", quizData);
        setQuizzes([]);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      setQuizzes([]);
      throw error;
    }
  };

  const fetchCourseLessons = async (courseId: string) => {
    if (!courseId || !instructorId) {
      setCourseLessons([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing.");
      }

      // Try to get lessons from cached courses first
      const course = courses.find((c) => c._id === courseId);
      if (course?.videos) {
        setCourseLessons(course.videos);
        return;
      }

      // Fallback to API if videos not in cached course
      const response = await axios.get(`${API_BASE}/api/courses/${courseId}?instructorId=${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let lessons = [];
      const data = response.data;
      if (data?.data?.videos) {
        lessons = data.data.videos;
      } else if (data?.course?.videos) {
        lessons = data.course.videos;
      } else if (data?.videos) {
        lessons = data.videos;
      } else if (Array.isArray(data)) {
        lessons = data;
      }

      setCourseLessons(Array.isArray(lessons) ? lessons : []);
    } catch (error) {
      console.error("Failed to fetch course lessons:", error);
      setCourseLessons([]);
    }
  };

  const handleCourseChange = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      courseId,
      videoId: "",
    }));
    fetchCourseLessons(courseId);
  };

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setFormData({
      title: "",
      courseId: "",
      videoId: "",
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
    setCourseLessons([]);
    setShowCreateForm(true);
  };

  const handleEditQuiz = async (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowCreateForm(true);

    await fetchCourseLessons(quiz.course._id);

    setFormData({
      title: quiz.title,
      courseId: quiz.course._id,
      videoId: quiz.videoId || "",
      questions: quiz.questions,
    });
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token || !instructorId) {
        throw new Error("Authentication token or instructor ID missing.");
      }

      await axios.delete(`${API_BASE}/api/quizzes/${quizId}?instructorId=${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchQuizzes(instructorId, token);
      alert("Quiz deleted successfully!");
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      alert("Failed to delete quiz");
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, question: value } : q
      ),
    }));
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === oIndex ? value : opt)),
            }
          : q
      ),
    }));
  };

  const handleCorrectAnswerChange = (qIndex: number, oIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex ? { ...q, correctAnswer: oIndex } : q
      ),
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    }
  };

  const addOption = (qIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, ""] } : q
      ),
    }));
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === qIndex && q.options.length > 2) {
          const newOptions = q.options.filter((_, j) => j !== oIndex);
          const newCorrectAnswer =
            q.correctAnswer >= newOptions.length ? 0 : q.correctAnswer;
          return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
        }
        return q;
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const { title, courseId, videoId, questions } = formData;

    if (!title.trim() || !courseId || !videoId) {
      alert("Please fill in all required fields: Title, Course, and Lesson.");
      setFormLoading(false);
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1} is empty.`);
        setFormLoading(false);
        return;
      }

      const validOptions = q.options.filter((opt) => opt.trim() !== "");
      if (validOptions.length < 2) {
        alert(`Question ${i + 1} must have at least 2 valid options.`);
        setFormLoading(false);
        return;
      }

      if (
        q.correctAnswer < 0 ||
        q.correctAnswer >= q.options.length ||
        !q.options[q.correctAnswer].trim()
      ) {
        alert(`Please select a valid correct answer for Question ${i + 1}.`);
        setFormLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token || !instructorId) {
        throw new Error("Authentication token or instructor ID missing.");
      }

      const payload = {
        course: courseId,
        videoId,
        title,
        questions,
        instructorId,
      };

      if (editingQuiz) {
        await axios.put(`${API_BASE}/api/quizzes/${editingQuiz._id}?instructorId=${instructorId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Quiz updated successfully!");
      } else {
        await axios.post(`${API_BASE}/api/quizzes?instructorId=${instructorId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Quiz created successfully!");
      }

      setShowCreateForm(false);
      await fetchQuizzes(instructorId, token);
    } catch (error: any) {
      console.error("Failed to save quiz:", error);
      alert(error.response?.data?.message || "Failed to save quiz");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const groupedQuizzes = Array.isArray(quizzes)
    ? quizzes.reduce((acc, quiz) => {
        const courseId = quiz.course?._id;
        if (!acc[courseId]) {
          acc[courseId] = {
            course: quiz.course,
            quizzes: [],
          };
        }
        acc[courseId].quizzes.push(quiz);
        return acc;
      }, {} as Record<string, { course: { _id: string; title: string }; quizzes: Quiz[] }>)
    : {};

  const filteredGroupedQuizzes = Object.entries(groupedQuizzes).filter(
    ([courseId, data]) => {
      if (selectedCourse && courseId !== selectedCourse) return false;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          data.course.title.toLowerCase().includes(searchLower) ||
          data.quizzes.some((quiz) =>
            quiz.title.toLowerCase().includes(searchLower)
          )
        );
      }

      return true;
    }
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchInstructorData}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Loader className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Quiz Management
                  </h1>
                  <p className="text-sm text-gray-500">
                    Create and manage course quizzes
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreateQuiz}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                disabled={!instructorId}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search quizzes or courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  >
                    <option value="">All Courses</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quizzes.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Courses with Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.keys(groupedQuizzes).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(quizzes)
                      ? quizzes.reduce(
                          (total, quiz) =>
                            total + (quiz.questions?.length || 0),
                          0
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading quizzes...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGroupedQuizzes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No quizzes found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by creating your first quiz
                  </p>
                  <button
                    onClick={handleCreateQuiz}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    disabled={!instructorId}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                  </button>
                </div>
              ) : (
                filteredGroupedQuizzes.map(([courseId, data]) => (
                  <div
                    key={courseId}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleCourseExpansion(courseId)}
                    >
                      <div className="flex items-center">
                        {expandedCourses.has(courseId) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {data.course?.title}
                        </h3>
                        <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          {data.quizzes.length} quiz
                          {data.quizzes.length !== 1 ? "es" : ""}
                        </span>
                      </div>
                    </div>

                    {expandedCourses.has(courseId) && (
                      <div className="divide-y divide-gray-200">
                        {data.quizzes.map((quiz) => (
                          <div
                            key={quiz._id}
                            className="p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-gray-900 mb-1">
                                  {quiz.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>
                                    {quiz.questions?.length || 0} questions
                                  </span>
                                  {quiz.videoId && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center gap-1">
                                        <Video className="w-4 h-4" />
                                      </div>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>
                                    Created{" "}
                                    {new Date(
                                      quiz.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditQuiz(quiz)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Quiz"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuiz(quiz._id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Quiz"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Quiz Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter quiz title"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course *
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      required
                      disabled={!instructorId}
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    {!instructorId && (
                      <p className="text-sm text-red-500 mt-1">
                        Instructor data not loaded. Please try again.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson *
                  </label>
                  <select
                    value={formData.videoId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        videoId: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    disabled={!formData.courseId}
                  >
                    <option value="">Select a lesson</option>
                    {courseLessons
                      .filter((lesson) => {
                        if (lesson._id === formData.videoId) return true;
                        return !usedVideoIds.has(lesson._id);
                      })
                      .map((lesson) => (
                        <option key={lesson._id} value={lesson._id}>
                          {lesson.title}
                        </option>
                      ))}
                  </select>
                  {!formData.courseId && (
                    <p className="text-sm text-gray-500 mt-1">
                      Select a course first to choose a lesson
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Questions
                    </h3>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900">
                            Question {qIndex + 1}
                          </h4>
                          {formData.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove Question
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) =>
                            handleQuestionChange(qIndex, e.target.value)
                          }
                          placeholder={`Enter question ${qIndex + 1}`}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none mb-4"
                          required
                        />

                        <div className="space-y-3">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={question.correctAnswer === oIndex}
                                onChange={() =>
                                  handleCorrectAnswerChange(qIndex, oIndex)
                                }
                                className="w-4 h-4 text-purple-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    qIndex,
                                    oIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                required
                              />
                              {question.options.length > 2 && (
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
                          className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          + Add Option
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || !instructorId}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {formLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        {editingQuiz ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingQuiz ? "Update Quiz" : "Create Quiz"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;