import express from "express";
import {
  addReview,
  getReviewsForCourse,
  deleteReview,
  getAllReviewsWithCourseDetails,
} from "../controllers/reviewController.js";
import { verifyAuth0Token } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /reviews/all should be defined before dynamic routes to avoid conflict
router.get("/all", getAllReviewsWithCourseDetails); // Fetch all reviews

// POST /reviews/:courseId
router.post("/:courseId", verifyAuth0Token, addReview);

// GET /reviews/:courseId
router.get("/:courseId", getReviewsForCourse);

// DELETE /reviews/:courseId/:reviewId
router.delete("/:courseId/:reviewId", verifyAuth0Token, deleteReview);

export default router;
