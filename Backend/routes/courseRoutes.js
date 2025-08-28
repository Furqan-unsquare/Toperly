import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  addVideoToCourse,
  addThumbnailToCourse,
  deleteCourse,
  updateMaterial,
  deleteMaterial,
  getInstructorsCourses,
  addMaterialToCourse,
  addChapterToVideo,
  updateChapter,
  deleteChapter,
  updateVideoInCourse,
  deleteVideoFromCourse,
  updateCourseStatus,
  addCourseInclude,
  updateCourseInclude,
  deleteCourseInclude,
} from "../controllers/courseController.js";
import {
  verifyAuth0Token,
  isInstructor,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.post('/', verifyAuth0Token, isInstructor, createCourse);
router.post("/", verifyAuth0Token,isInstructor, createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/instructor/myCourses", verifyAuth0Token, isInstructor, getInstructorsCourses);
router.put("/:id", verifyAuth0Token, isInstructor, updateCourse);
router.post("/:id/videos", verifyAuth0Token, isInstructor, addVideoToCourse);
router.put(
  "/:id/videos/:videoId",
  verifyAuth0Token,
  isInstructor,
  updateVideoInCourse
);
router.delete(
  "/:id/videos/:videoId",
  verifyAuth0Token,
  isInstructor,
  deleteVideoFromCourse
);
router.post(
  "/:id/thumbnail",
  verifyAuth0Token,
  isInstructor,
  addThumbnailToCourse
);
router.delete("/:id", verifyAuth0Token, isInstructor, deleteCourse);
router.post(
  "/:id/materials",
  verifyAuth0Token,
  isInstructor,
  addMaterialToCourse
);
router.put(
  "/:id/materials/:materialId",
  verifyAuth0Token,
  isInstructor,
  updateMaterial
);
router.delete(
  "/:id/materials/:materialId",
  verifyAuth0Token,
  isInstructor,
  deleteMaterial
);
router.post("/:id/videos/:videoId/chapters", addChapterToVideo);
router.put(
  "/:id/videos/:videoId/chapters/:chapterId",
  verifyAuth0Token,
  isInstructor,
  updateChapter
);
router.delete(
  "/:id/videos/:videoId/chapters/:chapterId",
  verifyAuth0Token,
  isInstructor,
  deleteChapter
);
router.put("/:id/status", verifyAuth0Token, updateCourseStatus);
router.post("/:id/includes", verifyAuth0Token, isInstructor, addCourseInclude);
router.put(
  "/:id/includes/:index",
  verifyAuth0Token,
  isInstructor,
  updateCourseInclude
);
router.delete(
  "/:id/includes/:index",
  verifyAuth0Token,
  isInstructor,
  deleteCourseInclude
);

export default router;
