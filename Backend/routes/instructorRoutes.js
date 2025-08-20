import express from 'express';
import {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
  getInstructorVerification,
  updateInstructorVerification,
} from '../controllers/instructorController.js';

const router = express.Router();

// CRUD Operations for Instructors
router.post('/', createInstructor); // Create instructor 
router.get('/', getAllInstructors); // Read all instructors 
router.get('/:id', getInstructorById); // Read instructor by ID
router.put('/:id', updateInstructor); // Update instructor 
router.delete('/:id', deleteInstructor); // Delete instructor (

// Verification Routes 
router.get('/verification/:id', getInstructorVerification); // Read verification details
router.put('/verification/:id', updateInstructorVerification); // Update verification status

export default router;