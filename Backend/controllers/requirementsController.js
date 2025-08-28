// controllers/requirementsController.js
import Requirements from '../models/Requirements.js';
import Course from '../models/Course.js';

// Upsert Requirements - create or update existing
export const upsertRequirements = async (req, res) => {
  try {
    const { courseId, requirements } = req.body;

    if (!courseId || !requirements || requirements.length === 0) {
      return res.status(400).json({ message: 'Course ID and requirements are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Filter out empty requirements
    const filteredRequirements = requirements.filter(req => req.trim() !== '');

    // Find and update if exists, create new if doesn't exist
    const updatedRequirements = await Requirements.findOneAndUpdate(
      { course: courseId },
      { requirements: filteredRequirements },
      { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true 
      }
    );

    res.status(200).json({ 
      message: 'Requirements saved successfully', 
      data: updatedRequirements 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Requirements by course
export const getRequirementsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const requirements = await Requirements.findOne({ course: courseId });

    if (!requirements) {
      return res.status(404).json({ message: 'No requirements found for this course' });
    }

    res.status(200).json(requirements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Requirements
export const updateRequirements = async (req, res) => {
  try {
    const { id } = req.params;
    const { requirements } = req.body;

    const updatedRequirements = await Requirements.findByIdAndUpdate(
      id,
      { requirements },
      { new: true }
    );

    if (!updatedRequirements) return res.status(404).json({ message: 'Requirements not found' });

    res.status(200).json({ 
      message: 'Requirements updated successfully', 
      data: updatedRequirements 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Requirements
export const deleteRequirements = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequirements = await Requirements.findByIdAndDelete(id);

    if (!deletedRequirements) return res.status(404).json({ message: 'Requirements not found' });

    res.status(200).json({ message: 'Requirements deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
