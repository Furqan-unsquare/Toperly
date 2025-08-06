import EnrolledCourse from '../models/EnrolledCourse.js';
import Course from '../models/Course.js';

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
      });

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
