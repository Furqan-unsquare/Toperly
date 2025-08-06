import express from 'express';
import {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
} from '../controllers/instructorController.js';

const router = express.Router();

router.post('/', createInstructor);  // admin: create instructor
router.get('/', getAllInstructors);  // admin: list all
router.get('/:id', getInstructorById);  // get by id
router.put('/:id', updateInstructor);   // admin: update
router.delete('/:id', deleteInstructor); // admin: delete

export default router;
