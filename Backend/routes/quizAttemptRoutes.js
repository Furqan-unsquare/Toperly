import express from 'express';
import { submitQuizAttempt, getQuizAttempt } from '../controllers/quizAttemptController.js';

const router = express.Router();

router.post('/', submitQuizAttempt);
router.get('/', getQuizAttempt); // e.g. /api/quiz-attempts?studentId=xxx&quizId=yyy

export default router;
