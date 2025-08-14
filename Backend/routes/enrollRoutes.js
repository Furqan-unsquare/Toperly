import express from "express";
import {
  enrollStudent,
  getMyEnrolledCourses,
  saveVideoProgress,
  getVideoProgress,
  getAllEnrollments,
} from "../controllers/enrollController.js";
import { isStudent, verifyAuth0Token } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:courseId", verifyAuth0Token, isStudent, enrollStudent);
router.get("/my-courses", verifyAuth0Token, isStudent, getMyEnrolledCourses);
router.post(
  "/:courseId/progress",
  verifyAuth0Token,
  isStudent,
  saveVideoProgress
);
router.get(
  "/:courseId/progress/:videoTitle",
  verifyAuth0Token,
  isStudent,
  getVideoProgress
);
router.get("/", verifyAuth0Token, getAllEnrollments);

export default router;
