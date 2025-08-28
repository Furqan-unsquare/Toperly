// routes/learningPointsRoutes.js
import express from 'express';
import {
  upsertLearningPoints,
  getLearningPointsByCourse,
  updateLearningPoints,
  deleteLearningPoints
} from '../controllers/learningPointsController.js';

const router = express.Router();

router.post('/', upsertLearningPoints); // Create or update points
router.get('/course/:courseId', getLearningPointsByCourse);
router.put('/:id', updateLearningPoints);
router.delete('/:id', deleteLearningPoints);

export default router;
