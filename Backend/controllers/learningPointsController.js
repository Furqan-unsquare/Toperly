// controllers/learningPointsController.js
import LearningPoints from '../models/LearningPoints.js';
import Course from '../models/Course.js';

// Upsert Learning Points - create or update existing
export const upsertLearningPoints = async (req, res) => {
  try {
    const { courseId, points } = req.body;

    if (!courseId || !points || points.length === 0) {
      return res.status(400).json({ message: 'Course ID and points are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Filter out empty points
    const filteredPoints = points.filter(point => point.trim() !== '');

    // Find and update if exists, create new if doesn't exist
    const updatedPoints = await LearningPoints.findOneAndUpdate(
      { course: courseId },
      { points: filteredPoints },
      { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true 
      }
    );

    res.status(200).json({ 
      message: 'Learning points saved successfully', 
      data: updatedPoints 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Learning Points by course
export const getLearningPointsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const learningPoints = await LearningPoints.findOne({ course: courseId });

    if (!learningPoints) return res.status(404).json({ message: 'No learning points found for this course' });

    res.status(200).json(learningPoints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Learning Points
export const updateLearningPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    const updatedPoints = await LearningPoints.findByIdAndUpdate(
      id,
      { points },
      { new: true }
    );

    if (!updatedPoints) return res.status(404).json({ message: 'Learning points not found' });

    res.status(200).json({ message: 'Learning points updated successfully', data: updatedPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Learning Points
export const deleteLearningPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPoints = await LearningPoints.findByIdAndDelete(id);

    if (!deletedPoints) return res.status(404).json({ message: 'Learning points not found' });

    res.status(200).json({ message: 'Learning points deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
