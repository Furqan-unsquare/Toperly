import express from 'express';
import {
  enrollStudent,
  getMyEnrolledCourses,
  saveVideoProgress,
  getVideoProgress,
  getAllEnrollments
} from '../controllers/enrollController.js';
import { isStudent, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:courseId', verifyToken, isStudent, enrollStudent);
router.get('/my-courses', verifyToken, isStudent, getMyEnrolledCourses);
router.post('/:courseId/progress', verifyToken, isStudent, saveVideoProgress);
router.get('/:courseId/progress/:videoTitle', verifyToken, isStudent, getVideoProgress);
router.get('/', verifyToken, getAllEnrollments);

export default router; 