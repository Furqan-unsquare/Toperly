
import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';

// Create Quiz
export const createQuiz = async (req, res) => {
  try {
    const { course, videoId, title, questions } = req.body;

    // Validate required fields
    if (!course || !videoId || !title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Course, videoId, title, and questions are required'
      });
    }

    // Verify course exists
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if videoId exists in the course's videos array
    const video = courseDoc.videos.id(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found in the selected course'
      });
    }

    // Validate questions format
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.options || q.options.length < 2 || q.correctAnswer === undefined) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1} is invalid. Each question must have text, at least 2 options, and a correct answer index.`
        });
      }

      if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1} has invalid correct answer index.`
        });
      }
    }

    const quiz = new Quiz({
      course,
      videoId, // Use videoId to match the schema
      title,
      questions
    });

    await quiz.save();

    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate('course', 'title');

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: populatedQuiz
    });

  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create quiz',
      error: error.message
    });
  }
};

// Get All Quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const { course, video, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (course) filter.course = course;
    if (video) filter.videoId = video; // Use videoId to match the schema

    const skip = (page - 1) * limit;

    const quizzes = await Quiz.find(filter)
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quiz.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: quizzes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
};

// Get Quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id)
      .populate('course', 'title');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });

  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz',
      error: error.message
    });
  }
};

// Update Quiz
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, videoId, title, questions } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Validate questions if provided
    if (questions) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.options || q.options.length < 2 || q.correctAnswer === undefined) {
          return res.status(400).json({
            success: false,
            message: `Question ${i + 1} is invalid.`
          });
        }

        if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
          return res.status(400).json({
            success: false,
            message: `Question ${i + 1} has invalid correct answer index.`
          });
        }
      }
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { course, videoId, title, questions },
      { new: true, runValidators: true }
    ).populate('course', 'title');

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: updatedQuiz
    });

  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quiz',
      error: error.message
    });
  }
};

// Delete Quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await Quiz.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz',
      error: error.message
    });
  }
};

// Get Quizzes by Course ID (without pagination)
export const getQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const quizzes = await Quiz.find({ course: courseId })
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    console.error('Get quizzes by course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes for the course',
      error: error.message
    });
  }
};

