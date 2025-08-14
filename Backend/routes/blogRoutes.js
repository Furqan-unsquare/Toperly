import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import { verifyAuth0Token } from "../middlewares/auth.middleware.js";

const router = express.Router();
// Unprotected GET routes
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Protected routes (require authentication)
router.post("/", verifyAuth0Token, createBlog);
router.put("/:id", verifyAuth0Token, updateBlog);
router.delete("/:id", verifyAuth0Token, deleteBlog);

export default router;
