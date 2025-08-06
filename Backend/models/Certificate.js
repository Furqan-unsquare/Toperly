// models/Certificate.js
import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true, trim: true },
  studentCustomId: { type: String, required: true, trim: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseName: { type: String, required: true, trim: true }, // Added
  author: { type: String, required: true, trim: true }, // Added (instructor name)
  certificateUrl: { type: String, required: true },
  marks: { type: Number, required: true, min: 80 },
  issuedAt: { type: Date, default: Date.now }
}, {
  indexes: [
    { key: { student: 1, course: 1 }, unique: true }
  ]
});

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

export default Certificate;
