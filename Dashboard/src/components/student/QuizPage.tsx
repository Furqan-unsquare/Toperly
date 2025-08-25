import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext"; // or wherever you store user info

const QuizPage = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Assumes user has ._id and .customId (student)

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [attempted, setAttempted] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL;


  // Fetch quiz + check if already attempted 
  useEffect(() => {
    const loadQuizAndAttempt = async () => {
      try {
        const quizRes = await axios.get(`${API_BASE_URL}/api/quizzes/${quizId}`);
        const attemptRes = await axios.get
         (`${API_BASE_URL}/api/quiz-attempts`, 
          {
            params: {
              studentId: user.id,
              quizId: quizId,
            },
          }
        );

        setQuiz(quizRes.data.data);
        setAttempted(attemptRes.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // Quiz not yet attempted
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
  console.log(quiz);
  const handleOptionSelect = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const formattedAnswers = Object.keys(answers).map((key) => ({
      questionIndex: Number(key),
      selectedOption: answers[key],
    }));

    try {
      const res = await axios.post(`${API_BASE_URL}/api/quiz-attempts`, {
          student: user.id,
          studentCustomId: user.id,
          course: courseId,
          lesson: quiz.videoId, // using videoId as lesson
          quiz: quiz._id,
          answers: formattedAnswers,
        }
      );

      setAttempted(res.data.data);
    } catch (error) {
      console.error("Submit error:", error);
      alert(error?.response?.data?.message || "Submission failed");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading quiz...</div>;
  if (!quiz)
    return <div className="p-6 text-center text-red-500">Quiz not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">{quiz.title}</h2>

      {quiz.questions.map((q, index) => (
        <div key={index} className="mb-6">
          <h4 className="font-medium mb-2">
            {index + 1}. {q.question}
          </h4>
          <div className="space-y-2">
            {q.options.map((opt, optIndex) => {
              const isSelected = answers[index] === optIndex;
              const isCorrect = attempted && q.correctAnswer === optIndex;
              const wasChosen =
                attempted &&
                attempted.answers?.find((a) => a.questionIndex === index)
                  ?.selectedOption === optIndex;

              return (
                <label
                  key={optIndex}
                  className={`block px-3 py-2 rounded border
                    ${
                      attempted
                        ? isCorrect
                          ? "border-green-500 bg-green-100"
                          : wasChosen
                          ? "border-red-500 bg-red-100"
                          : "border-gray-300"
                        : "border-gray-300 hover:bg-gray-100 cursor-pointer"
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optIndex}
                    disabled={!!attempted}
                    checked={attempted ? wasChosen : isSelected}
                    onChange={() => handleOptionSelect(index, optIndex)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {!attempted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-6">
          <p className="text-lg font-semibold text-green-600">
            You scored {attempted.score}% (
            {Math.round((quiz.questions.length * attempted.score) / 100)} out of{" "}
            {quiz.questions.length})
          </p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mt-4 text-sm text-blue-600 underline"
          >
            Back to Course
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
