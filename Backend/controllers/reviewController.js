import Review from '../models/Review.js';
import Course from '../models/Course.js';

export const addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const studentId = req.user._id; // From auth middleware
    console.log(req.user)
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existing = await Review.findOne({ course: courseId, student: studentId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this course' });

    const review = await Review.create({
      course: courseId,
      student: studentId,
      rating,
      comment,
    });

    // Update course average rating & totalReviews
    const reviews = await Review.find({ course: courseId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    course.rating = avgRating;
    course.totalReviews = reviews.length;
    await course.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getReviewsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId }).populate('student', 'name profileImage');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { courseId, reviewId } = req.params;
    const studentId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, student: studentId, course: courseId });
    if (!review) return res.status(404).json({ message: 'Review not found or not authorized' });

    await review.deleteOne();

    // Update course rating
    const reviews = await Review.find({ course: courseId });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const course = await Course.findById(courseId);
    course.rating = avgRating;
    course.totalReviews = reviews.length;
    await course.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
};

// New function to fetch all reviews with course details
export const getAllReviewsWithCourseDetails = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'course',
        select: 'title thumbnail.url description', // Only fetch title, thumbnail.url, and description
      })
      .populate('student', 'name profileImage');

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found' });
    }

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching all reviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};