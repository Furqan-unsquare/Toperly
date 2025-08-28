// models/Requirements.js
import mongoose from 'mongoose';

const requirementsSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  requirements: [{ type: String, trim: true }] // Array of requirement strings
}, {
  timestamps: true
});

const Requirements = mongoose.models.Requirements || mongoose.model('Requirements', requirementsSchema);
export default Requirements;
