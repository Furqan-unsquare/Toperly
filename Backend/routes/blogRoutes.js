import express from 'express';
import { createBlog, deleteBlog, getBlogById, getBlogs, updateBlog } from '../controllers/blogController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();
// Unprotected GET routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Protected routes (require authentication)
router.post('/', verifyToken, createBlog);
router.put('/:id', verifyToken, updateBlog);
router.delete('/:id', verifyToken, deleteBlog);

export default router;