import EnrolledCourse from '../models/EnrolledCourse.js';
import Course from '../models/Course.js';
import mongoose from 'mongoose';

export const enrollStudent = async (req, res) => {
  const studentId = req.user.id;
  const courseId = req.params.courseId;
  const { paymentId, orderId, signature } = req.body; // For paid courses

  try {
    // Check if already enrolled
    const existing = await EnrolledCourse.findOne({ 
      student: studentId, 
      course: courseId 
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // For paid courses, verify payment details
    if (course.price > 0) {
      if (!paymentId || !orderId || !signature) {
        return res.status(400).json({ 
          message: 'Payment verification required for paid courses' 
        });
      }
      
      // Here you can add additional payment verification logic
      // For now, we'll assume the payment verification happens in the payment endpoint
    }

    // Create enrollment
    const enrollment = new EnrolledCourse({ 
      student: studentId, 
      course: courseId,
      paymentDetails: course.price > 0 ? {
        paymentId,
        orderId,
        signature,
        method: paymentMethod,
        amount: course.price,
        currency: 'INR',
        status: 'completed'
      } : null
    });
    
    await enrollment.save();

    // Update course enrolled students count
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: studentId }
    });

    res.status(201).json({ 
      message: 'Enrollment successful',
      enrollment: {
        id: enrollment._id,
        courseId: courseId,
        studentId: studentId,
        enrolledAt: enrollment.enrolledAt
      }
    });
  } catch (err) {
    console.error('Enrollment Error:', err);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await EnrolledCourse.find()
      .populate({
        path: 'student',
        select: 'name email'
      })
      .populate({
        path: 'course',
        select: 'title price'
      })
       .select('student course paymentDetails');

    res.status(200).json(enrollments);
  } catch (err) {
    console.error("Error fetching enrollments:", err);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

export const getMyEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrollments = await EnrolledCourse.find({ student: studentId })
      .populate({
        path: 'course',
        populate: { path: 'instructor' }
      });

    const result = enrollments.map(enroll => ({
      ...enroll.toObject(),
      course: enroll.course
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

export const saveVideoProgress = async (req, res) => {
  const { videoTitle, currentTime, duration, progressPercentage, completed, watchTime, chaptersCompleted, quality, playbackRate } = req.body;
  const studentId = req.user.id;
  const courseId = req.params.courseId;

  try {
    let enrollment = await EnrolledCourse.findOne({ 
      student: studentId, 
      course: courseId 
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (!enrollment.videoProgress) {
      enrollment.videoProgress = [];
    }

    const progressIndex = enrollment.videoProgress.findIndex(
      progress => progress.videoTitle === videoTitle
    );

    const progressData = {
      videoTitle,
      currentTime,
      duration,
      progressPercentage,
      completed,
      watchTime,
      chaptersCompleted: chaptersCompleted || [],
      quality,
      playbackRate,
      lastWatched: new Date()
    };

    if (progressIndex >= 0) {
      enrollment.videoProgress[progressIndex] = {
        ...enrollment.videoProgress[progressIndex],
        ...progressData
      };
    } else {
      enrollment.videoProgress.push(progressData);
    }

    await enrollment.save();
    
    res.status(200).json({ 
      message: 'Progress saved successfully',
      progress: progressData 
    });
  } catch (err) {
    console.error('Save Progress Error:', err);
    res.status(500).json({ message: 'Failed to save video progress' });
  }
};

export const getVideoProgress = async (req, res) => {
  const studentId = req.user.id;
  const { courseId, videoTitle } = req.params;

  try {
    const enrollment = await EnrolledCourse.findOne({ 
      student: studentId, 
      course: courseId 
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const progress = enrollment.videoProgress?.find(
      p => p.videoTitle === videoTitle
    );

    if (!progress) {
      return res.status(200).json({ message: 'No progress found' });
    }

    res.status(200).json(progress);
  } catch (err) {
    console.error('Get Progress Error:', err);
    res.status(500).json({ message: 'Failed to fetch video progress' });
  }
};

// Get all notes for a student's enrollment
export const getNotes = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const courseId = req.params.courseId;
    const enrollment = await EnrolledCourse.findOne({ student: studentId, course: courseId }).lean();
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    return res.status(200).json({ success: true, data: enrollment.notes || [] });
  } catch (err) {
    console.error('Get Notes Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new note
export const createNote = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const courseId = req.params.courseId;
    const { title = '', desc = '' } = req.body;

    if (!title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const enrollment = await EnrolledCourse.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    const newNote = {
      _id: new mongoose.Types.ObjectId(),
      title,
      desc,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    enrollment.notes.push(newNote);
    await enrollment.save();

    return res.status(201).json({ success: true, data: newNote });
  } catch (err) {
    console.error('Create Note Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const courseId = req.params.courseId;
    const noteId = req.params.noteId;
    const { title, desc } = req.body;

    if (typeof title !== 'undefined' && !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const enrollment = await EnrolledCourse.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    const note = enrollment.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (typeof title !== 'undefined') note.title = title;
    if (typeof desc !== 'undefined') note.desc = desc;
    note.updatedAt = new Date();

    await enrollment.save();

    return res.status(200).json({ success: true, data: note });
  } catch (err) {
    console.error('Update Note Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const courseId = req.params.courseId;
    const noteId = req.params.noteId;

    const enrollment = await EnrolledCourse.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Use $pull to remove the note from the notes array
    const updateResult = await EnrolledCourse.updateOne(
      { _id: enrollment._id, 'notes._id': noteId },
      { $pull: { notes: { _id: noteId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    return res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (err) {
    console.error('Delete Note Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};