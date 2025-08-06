import express from 'express';
import { addToWishlist, removeFromWishlist, getUserWishlist, getMywishlist } from '../controllers/wishlist.controller.js';
import { isStudent, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, isStudent, getUserWishlist);
router.post('/:courseId', verifyToken, isStudent, addToWishlist);
router.delete('/:courseId', verifyToken, isStudent, removeFromWishlist);
router.get('/my-wishlist', verifyToken, isStudent, getMywishlist);

export default router;
