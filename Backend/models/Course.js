import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  customId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number }, // in hours
  thumbnail: { filename: String, url: String, bunnyFileId: String },
  videos: [{
    title: String,
    description: String,
    filename: String,
    url: String,
    bunnyFileId: String,
    duration: Number,
    order: Number, 
    chapters: [{
      title: { type: String, required: true },
      startTime: {
        hours: { type: Number, min: 0, default: 0 },
        minutes: { type: Number, min: 0, max: 59, default: 0 },
        seconds: { type: Number, min: 0, max: 59, default: 0 }
      },
      endTime: {
        hours: { type: Number, min: 0, default: 0 },
        minutes: { type: Number, min: 0, max: 59, default: 0 },
        seconds: { type: Number, min: 0, max: 59, default: 0 }
      }
    }]
  }],
  materials: [{
    title: String,
    filename: String,
    url: String,
    bunnyFileId: String,
    type: { type: String, enum: ['pdf', 'image', 'document'] }
  }],
  isPublished: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending',
},
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate customId
courseSchema.pre('save', async function (next) {
  if (this.isNew && !this.customId) {
    try {
      const Counter = (await import('./Counter.js')).default;
      const counter = await Counter.findOneAndUpdate(
        { model: 'Course' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      const serialNo = counter.seq.toString().padStart(4, '0');
      const sanitizedTitle = this.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      this.customId = `CRS-${sanitizedTitle.substring(0, 10)}-${serialNo}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Validation for chapter times within videos
courseSchema.pre('save', function (next) {
  if (this.videos && this.videos.length > 0) {
    for (const video of this.videos) {
      if (video.chapters && video.chapters.length > 0) {
        for (let i = 0; i < video.chapters.length; i++) {
          const chapter = video.chapters[i];
          const startSeconds = (chapter.startTime.hours * 3600) + (chapter.startTime.minutes * 60) + chapter.startTime.seconds;
          const endSeconds = (chapter.endTime.hours * 3600) + (chapter.endTime.minutes * 60) + chapter.startTime.seconds;
          
          if (endSeconds <= startSeconds) {
            return next(new Error(`End time must be greater than start time for chapter: ${chapter.title} in video: ${video.title}`));
          }
          
          // Ensure chapters don't overlap within the same video
          for (let j = i + 1; j < video.chapters.length; j++) {
            const nextChapter = video.chapters[j];
            const nextStartSeconds = (nextChapter.startTime.hours * 3600) + (nextChapter.startTime.minutes * 60) + nextChapter.startTime.seconds;
            if (nextStartSeconds <= endSeconds) {
              return next(new Error(`Chapter ${nextChapter.title} overlaps with ${chapter.title} in video: ${video.title}`));
            }
          }
          
          // Optional: Validate chapter times against video duration if available
          if (video.duration && endSeconds > video.duration) {
            return next(new Error(`Chapter ${chapter.title} end time exceeds video duration in video: ${video.title}`));
          }
        }
      }
    }
  }
  next();
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;