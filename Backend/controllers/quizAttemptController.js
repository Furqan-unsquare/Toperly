import QuizAttempt from '../models/QuizAttempt.js';
import Quiz from '../models/Quiz.js';

export const submitQuizAttempt = async (req, res) => {
  try {
    const { student, studentCustomId, course, lesson, quiz, answers } = req.body;

    // Validate required fields
    if (!student || !studentCustomId || !course || !lesson || !quiz || !answers === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Get correct quiz data
    const quizDoc = await Quiz.findById(quiz);
    if (!quizDoc) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Calculate score
    let correctCount = 0;
    quizDoc.questions.forEach((q, index) => {
      const userAnswer = answers.find((a) => a.questionIndex === index);
      if (userAnswer && userAnswer.selectedOption === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / quizDoc.questions.length) * 100);

    // Check if previous attempts exist
    const previousAttempts = await QuizAttempt.find({ student, quiz }).sort({ attemptNumber: -1 });
    const attemptNumber = previousAttempts.length > 0 ? previousAttempts[0].attemptNumber + 1 : 1;

    // Save attempt
    const attempt = new QuizAttempt({
      student,
      studentCustomId,
      course,
      lesson,
      quiz,
      answers,
      score: percentage,
      attemptNumber
    });

    await attempt.save();

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: attempt
    });

  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
};

export const getQuizAttempt = async (req, res) => {
  try {
    const { studentId, quizId } = req.query;

    if (!studentId || !quizId) {
      return res.status(400).json({ success: false, message: 'studentId and quizId required' });
    }

    const attempts = await QuizAttempt.find({ student: studentId, quiz: quizId })
      .sort({ attemptNumber: -1 })
      .limit(1); // Get the latest attempt

    if (!attempts || attempts.length === 0) {
      return res.status(404).json({ success: false, message: 'No attempt found' });
    }

    res.status(200).json({ success: true, data: attempts[0] });

  } catch (error) {
    console.error('Get quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz attempt',
      error: error.message
    });
  }
};