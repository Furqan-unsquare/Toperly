import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getMywishlist,
} from "../controllers/wishlist.controller.js";
import { isStudent, verifyAuth0Token } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyAuth0Token, isStudent, getUserWishlist);
router.post("/:courseId", verifyAuth0Token, isStudent, addToWishlist);
router.delete("/:courseId", verifyAuth0Token, isStudent, removeFromWishlist);
router.get("/my-wishlist", verifyAuth0Token, isStudent, getMywishlist);

export default router;
