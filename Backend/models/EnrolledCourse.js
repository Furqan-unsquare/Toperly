import mongoose from 'mongoose';

const enrolledCourseSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  completedLessons: [String],
  certificateIssued: { type: Boolean, default: false },
  enrolledAt: { type: Date, default: Date.now },
  
  // Payment details for paid courses
  paymentDetails: {
    paymentId: String,
    orderId: String,
    signature: String,
    amount: Number,
    currency: String,
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


enrolledCourseSchema.index({ student: 1, course: 1 }, { unique: true });

const EnrolledCourse = mongoose.models.EnrolledCourse || mongoose.model('EnrolledCourse', enrolledCourseSchema);

export default EnrolledCourse;