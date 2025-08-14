import mongoose from 'mongoose';
import Course from './Course.js'; // Adjust the path as needed

const enrolledCourseSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  category: { type: String}, // New field to store course category
  progress: { type: Number, default: 0 },
  completedLessons: [String],
  certificateIssued: { type: Boolean, default: false },
  enrolledAt: { type: Date, default: Date.now },
  paymentDetails: {
    paymentId: String,
    orderId: String,
    signature: String,
    amount: Number,
    currency: String,
    method: String, 
    bank: String, 
    wallet: String, 
    vpa: String,  
    card: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
  },
  videoProgress: [{
    videoTitle: { type: String, required: true },
    currentTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    watchTime: { type: Number, default: 0 },
    chaptersCompleted: [Number],
    quality: { type: String, default: 'auto' },
    playbackRate: { type: Number, default: 1 },
    lastWatched: { type: Date },
  }]
}, {
  timestamps: true
});

// Ensure unique student-course enrollment
enrolledCourseSchema.index({ student: 1, course: 1 }, { unique: true });

// Pre-save hook to populate category from Course
enrolledCourseSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('course')) {
    try {
      const course = await Course.findById(this.course);
      if (!course) {
        return next(new Error('Referenced course not found'));
      }
      this.category = course.category || 'Uncategorized';
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const EnrolledCourse = mongoose.models.EnrolledCourse || mongoose.model('EnrolledCourse', enrolledCourseSchema);

export default EnrolledCourse;