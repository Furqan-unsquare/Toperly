// routes/quizRoutes.js
import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizByCourse
} from '../controllers/quizController.js';

const router = express.Router();

// Quiz routes
router.post('/', createQuiz);
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);
router.get('/course/:courseId', getQuizByCourse);

export default router;