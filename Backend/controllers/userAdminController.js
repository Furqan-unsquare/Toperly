import Student from "../models/Student.js";
import Instructor from "../models/Instructor.js";


export const updateUserSuspension = async (req, res) => {
  try {
    const { userId, userType, isSuspended } = req.body;

    if (!userId || !userType || typeof isSuspended !== "boolean") {
      return res.status(400).json({ error: "Invalid request data" });
    }

    if (userType === "student") {
      const student = await Student.findById(userId);
      if (!student) return res.status(404).json({ error: "Student not found" });

      student.isSuspended = isSuspended;
      await student.save();

      return res.status(200).json({ message: "Student suspension status updated" });
    }

    if (userType === "instructor") {
      const instructor = await Instructor.findById(userId);
      if (!instructor) return res.status(404).json({ error: "Instructor not found" });

      instructor.isSuspended = isSuspended;
      await instructor.save();

      return res.status(200).json({ message: "Instructor suspension status updated" });
    }

    return res.status(400).json({ error: "Invalid userType" });
  } catch (err) {
    console.error("Error updating suspension:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


export const getUsers = async (req, res) => {
    try {
        const students = await Student.find();
        const instructors = await Instructor.find();
        res.json({students, instructors});
    } catch (err) {
        console.error("Error updating suspension:", err);
        return res.status(500).json({ error: "Server error" });
    }
}