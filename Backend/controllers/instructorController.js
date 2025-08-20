import mongoose from 'mongoose';
import Instructor from '../models/Instructor.js';

// Middleware to validate ObjectId
export const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid instructor ID', success: false });
  }
  next();
};

// CREATE Instructor (admin use)
export const createInstructor = async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json({ data: instructor, message: 'Instructor created', success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
};

// READ all instructors (admin use)
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.json({ data: instructors, success: true });
  } catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
};

// READ instructor by ID
export const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found', success: false });
    }
    res.json({ data: instructor, success: true });
  } catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
};

// UPDATE instructor (admin use)
export const updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found', success: false });
    }
    res.json({ data: instructor, message: 'Instructor updated', success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
};

// DELETE instructor (admin use)
export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found', success: false });
    }
    res.json({ message: 'Instructor deleted', success: true });
  } catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
};

// READ instructor verification details (admin only)
export const getInstructorVerification = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).select('name email isVerified');
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found', success: false });
    }
    res.json({ data: instructor, success: true });
  } catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
};

// UPDATE instructor verification status (admin only)
export const updateInstructorVerification = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found', success: false });
    }

    instructor.isVerified = req.body.isVerified ?? true;
    await instructor.save();

    res.json({
      message: 'Verification status updated',
      data: {
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        isVerified: instructor.isVerified,
      },
      success: true,
    });
  } catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
};