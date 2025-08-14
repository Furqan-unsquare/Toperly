import express from "express";
import {
  createUrl,
  getAllUrl,
  redirectToUrl,
  uploadMedia,
} from "../controllers/url.controller.js";
import { verifyAuth0Token } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { getAllBunnyFiles } from "../controllers/bunny.controller.js";

const router = express.Router();

router
  .route("/")
  .post(verifyAuth0Token, createUrl)
  .get(verifyAuth0Token, getAllUrl);
router.route("/upload").post(upload.single("file"), uploadMedia);
router.get("/bunny-files", getAllBunnyFiles);

router.route("/:shortId").get(redirectToUrl);

export const urlRouter = router;
