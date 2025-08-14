import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  enrollCourse,
  getMyStudents,
} from "../controllers/studentController.js";
import {
  isInstructor,
  verifyAuth0Token,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createStudent); // admin: create student
router.get("/", getAllStudents); // admin: list all
router.get("/:id", getStudentById); // get by id
router.put("/:id", updateStudent); // admin: update
router.delete("/:id", deleteStudent); // admin: delete
router.post("/enroll-course/:courseId", verifyAuth0Token, enrollCourse);
router.post("/get-mystudents", verifyAuth0Token, isInstructor, getMyStudents);

export default router;
