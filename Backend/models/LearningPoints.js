// models/LearningPoints.js
import mongoose from 'mongoose';

const learningPointsSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  points: [{ type: String, trim: true }] // "What you will learn" points
}, {
  timestamps: true
});

const LearningPoints = mongoose.models.LearningPoints || mongoose.model('LearningPoints', learningPointsSchema);
export default LearningPoints;
