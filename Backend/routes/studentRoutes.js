import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  enrollCourse,
  getMyStudents
} from '../controllers/studentController.js';
import { isInstructor, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', createStudent);      // admin: create student
router.get('/', getAllStudents);      // admin: list all
router.get('/:id', getStudentById);   // get by id
router.put('/:id', updateStudent);    // admin: update
router.delete('/:id', deleteStudent); // admin: delete
router.post('/enroll-course/:courseId', verifyToken,  enrollCourse);
router.post('/get-mystudents', verifyToken, isInstructor, getMyStudents);

export default router;
