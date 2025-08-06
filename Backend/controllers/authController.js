import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import EnrolledCourse from '../models/EnrolledCourse.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Review from '../models/Review.js';
import Transaction from '../models/Transaction.js';
import Wishlist from '../models/Wishlist.js';

// JWT secret from env
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register handler (shared)
export const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, expertise, phone, language } = req.body;
    console.log(name);
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "student" or "instructor"' });
    }

    // Check if user already exists in either collection by email
    const existingInstructor = await Instructor.findOne({ email });
    const existingStudent = await Student.findOne({ email });
    if (existingInstructor || existingStudent) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === 'instructor') {
      newUser = new Instructor({
        name,
        email,
        password: hashedPassword,
        bio: bio || '',
        expertise: expertise || [],
        role
      });
    } else {
      // role == student
      newUser = new Student({
        name,
        email,
        passwordHash: hashedPassword,
        phone: phone || '',
        language: language || 'en',
        role
      });
    }

    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      message: `${role} registered successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login handler (shared)
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required' });
    }

    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "student" or "instructor"' });
    }

    let user;

    if (role === 'instructor') {
      user = await Instructor.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Instructor not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      if (user.isSuspended) {
        return res.status(403).json({ message: 'Your account has been suspended. Contact support.' });
      }

    } else {
      // student
      user = await Student.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Student not found' });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      if (user.isSuspended) {
        return res.status(403).json({ message: 'Your account has been suspended. Contact support.' });
      }
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};


// logout handler
export const logout = async (req, res) => {
  // If using cookies for JWT, clear them. Otherwise, instruct client to remove locally stored token.
  res.status(200).json({ message: 'Logout successful' });
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id, role } = req.user; // set by verifyToken middleware

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    let user;
    if (role === 'student') {
      user = await Student.findById(id);
      if (!user) return res.status(404).json({ message: 'Student not found' });

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

      const hashedNew = await bcrypt.hash(newPassword, 10);
      user.passwordHash = hashedNew;

    } else if (role === 'instructor') {
      user = await Instructor.findById(id);
      if (!user) return res.status(404).json({ message: 'Instructor not found' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

      const hashedNew = await bcrypt.hash(newPassword, 10);
      user.password = hashedNew;

    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await user.save();
    res.json({ message: 'Password changed successfully' });

  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error during password change' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === 'student') {
      const student = await Student.findById(id).lean();
      if (!student) return res.status(404).json({ message: 'Student not found' });

      const [
        enrolledCourses,
        certificates,
        quizAttempts,
        reviews,
        transactions,
        wishlist
      ] = await Promise.all([
        EnrolledCourse.find({ student: id }).populate('course').lean(),
        Certificate.find({ student: id }).populate('course').lean(),
        QuizAttempt.find({ student: id }).populate('quiz course').lean(),
        Review.find({ student: id }).populate('course').lean(),
        Transaction.find({ student: id }).populate('course').lean(),
        Wishlist.find({ student: id }).populate('course').lean()
      ]);

      return res.json({
        profile: student,
        enrolledCourses,
        certificates,
        quizAttempts,
        reviews,
        transactions,
        wishlist
      });

    } else if (role === 'instructor') {
      const instructor = await Instructor.findById(id).lean();
      if (!instructor) return res.status(404).json({ message: 'Instructor not found' });

      const courses = await Course.find({ instructor: id }).lean();

      const courseIds = courses.map(c => c._id);

      const [reviews, certificates] = await Promise.all([
        Review.find({ course: { $in: courseIds } }).populate('student course').lean(),
        Certificate.find({ course: { $in: courseIds } }).lean()
      ]);

      return res.json({
        profile: instructor,
        courses,
        reviews,
        certificatesIssued: certificates
      });

    } else {
      return res.status(400).json({ message: 'Invalid user role' });
    }

  } catch (err) {
    console.error('getUserDetails error:', err);
    res.status(500).json({ message: 'Server error fetching user details', error: err.message });
  }
};

export const updateUserInfo = async (req, res) => {
  
}