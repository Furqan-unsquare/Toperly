// routes/requirementsRoutes.js
import express from 'express';
import {
  upsertRequirements,
  getRequirementsByCourse,
  updateRequirements,
  deleteRequirements
} from '../controllers/requirementsController.js';

const router = express.Router();

router.post('/', upsertRequirements); // Create or update requirements
router.get('/course/:courseId', getRequirementsByCourse);
router.put('/:id', updateRequirements);
router.delete('/:id', deleteRequirements);

export default router;