import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentCustomId: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    questionIndex: { type: Number, required: true },
    selectedOption: { type: Number, required: true }
  }],
  score: { type: Number, required: true, min: 0, max: 100 },
  attemptNumber: { type: Number, required: true, default: 1 }, // Track attempt count
  createdAt: { type: Date, default: Date.now }
});

const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt;