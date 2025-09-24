import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const QuizPage = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [attempted, setAttempted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadQuizAndAttempt = async () => {
      try {
        const quizRes = await axios.get(`${API_BASE_URL}/api/quizzes/${quizId}`);
        const attemptRes = await axios.get(`${API_BASE_URL}/api/quiz-attempts`, {
          params: { studentId: user.id, quizId: quizId },
        });

        setQuiz(quizRes.data.data);
        setAttempted(attemptRes.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          const quizRes = await axios.get(`${API_BASE_URL}/api/quizzes/${quizId}`);
          setQuiz(quizRes.data.data);
        } else {
          console.error("Error loading quiz or attempt:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && quizId) loadQuizAndAttempt();
  }, [quizId, user]);

  const handleOptionSelect = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    const formattedAnswers = Object.keys(answers).map((key) => ({
      questionIndex: Number(key),
      selectedOption: answers[key],
    }));

    try {
      const res = await axios.post(`${API_BASE_URL}/api/quiz-attempts`, {
        student: user.id,
        studentCustomId: user.id,
        course: courseId,
        lesson: quiz.videoId,
        quiz: quiz._id,
        answers: formattedAnswers,
        timeTaken: 0,
      });

      setAttempted(res.data.data);
    } catch (error) {
      console.error("Submit error:", error);
      alert(error?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = async () => {
    setAnswers({});
    setAttempted(null);
    setCurrentQuestion(0);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        <p className="mt-4 text-gray-600">Loading quiz...</p>
      </div>
    </div>
  );

  if (!quiz) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Quiz Not Found</h2>
        <p className="mb-4 text-gray-600">The requested quiz could not be loaded.</p>
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Course
        </button>
      </div>
    </div>
  );

  const progress = attempted ? 100 : (Object.keys(answers).length / quiz.questions.length) * 100;
  const q = quiz.questions[currentQuestion];
  const isAnswered = answers.hasOwnProperty(currentQuestion);
  const userAns = attempted
    ? attempted.answers?.find((a) => a.questionIndex === currentQuestion)?.selectedOption
    : answers[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">{quiz.title}</h1>
          <div className="flex items-center">
            <p className="text-gray-600 mr-4">
              {attempted ? "Quiz Completed" : `Q${currentQuestion + 1} of ${quiz.questions.length}`}
            </p>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
            >
              Back
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow flex flex-col md:flex-row h-full">
          {/* Main content */}
          <main className="flex-1 p-4">
            {!attempted ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{q.question}</h3>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center p-3 rounded border cursor-pointer ${
                          userAns === optIndex
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={optIndex}
                          checked={userAns === optIndex}
                          onChange={() => handleOptionSelect(optIndex)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => setCurrentQuestion((prev) => prev - 1)}
                    disabled={currentQuestion === 0}
                    className={`px-4 py-2 rounded ${
                      currentQuestion === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={
                      currentQuestion < quiz.questions.length - 1
                        ? () => setCurrentQuestion((prev) => prev + 1)
                        : handleSubmit
                    }
                    disabled={submitting || (!isAnswered && currentQuestion === quiz.questions.length - 1)}
                    className={`px-4 py-2 rounded text-white ${
                      submitting || (!isAnswered && currentQuestion === quiz.questions.length - 1)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {submitting ? "Submitting..." : currentQuestion < quiz.questions.length - 1 ? "Next" : "Submit"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Question Review</h4>
                  <div className="py-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{Math.round(progress)}% Complete</p>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-700 mb-3">
                      Q{currentQuestion + 1}: {q.question}
                    </h5>
                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = userAns === optIndex;
                        const isCorrect = q.correctAnswer === optIndex;
                        const wasWrong = !isCorrect && isSelected;

                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded border ${
                              isCorrect
                                ? "border-green-500"
                                : wasWrong
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <span className="text-gray-700">{opt}</span>
                            {isCorrect && <span className="ml-2 text-green-600">✓</span>}
                            {wasWrong && <span className="ml-2 text-red-600">✗</span>}
                          </div>
                        );
                    })}
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    {currentQuestion > 0 && (
                      <button
                        onClick={() => setCurrentQuestion((prev) => prev - 1)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      >
                        Previous
                      </button>
                    )}
                    {currentQuestion < quiz.questions.length - 1 && (
                      <button
                        onClick={() => setCurrentQuestion((prev) => prev + 1)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 ml-auto"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-full md:w-64 p-4">
            {attempted && (
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{attempted.score}%</h3>
                <p className="text-gray-600">
                  {attempted.score >= 70 ? "Well Done!" : "Keep Practicing!"}
                </p>
                <p className="text-gray-600 mt-1">
                  {Math.round((quiz.questions.length * attempted.score) / 100)}/
                  {quiz.questions.length} correct
                </p>
                {attempted.score < 70 && (
                  <button
                    onClick={handleRetake}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 w-full"
                  >
                    Retake
                  </button>
                )}
              </div>
            )}
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="font-medium text-gray-700 mb-3">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((_, index) => {
                  let bgClass = "bg-gray-300";
                  let textClass = "text-white";

                  if (attempted) {
                    const userAns = attempted.answers?.find((a) => a.questionIndex === index)
                      ?.selectedOption;
                    const correctAns = quiz.questions[index].correctAnswer;

                    if (userAns === correctAns) bgClass = "bg-green-500";
                    else if (userAns !== undefined) bgClass = "bg-red-500";
                  } else if (answers.hasOwnProperty(index)) {
                    bgClass = "bg-blue-500";
                  }

                  const isCurrent = index === currentQuestion;
                  if (isCurrent) bgClass = "bg-orange-500";

                  return (
                    <button
                      key={index}
                      onClick={() => !attempted && setCurrentQuestion(index)}
                      disabled={!!attempted}
                      className={`w-10 h-10 rounded flex items-center justify-center text-sm ${
                        attempted ? "cursor-default" : "hover:opacity-80"
                      } ${bgClass} ${textClass}`}
                      title={`Question ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              {attempted && (
                <div className="mt-4 pt-2 border-t border-gray-200">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Correct</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Incorrect</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded bg-gray-300 mr-2"></div>
                    <span className="text-sm text-gray-600">Not attempted</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;