import Instructor from '../models/Instructor.js';

// CREATE Instructor (admin use)
export const createInstructor = async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// READ all instructors (admin use)
export const getAllInstructors = async (req, res) => {
  const instructors = await Instructor.find();
  res.json(instructors);
};

// READ instructor by ID
export const getInstructorById = async (req, res) => {
  const instructor = await Instructor.findById(req.params.id);
  if (!instructor) return res.status(404).json({ message: 'Instructor Not Found' });
  res.json(instructor);
};

// UPDATE instructor (admin use)
export const updateInstructor = async (req, res) => {
  const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!instructor) return res.status(404).json({ message: 'Instructor Not Found' });
  res.json(instructor);
};

// DELETE instructor (admin use)
export const deleteInstructor = async (req, res) => {
  const instructor = await Instructor.findByIdAndDelete(req.params.id);
  if (!instructor) return res.status(404).json({ message: 'Instructor Not Found' });
  res.json({ message: "Instructor deleted" });
};
