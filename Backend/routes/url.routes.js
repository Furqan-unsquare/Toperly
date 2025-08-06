import express from 'express'
import { createUrl, getAllUrl, redirectToUrl, uploadMedia } from '../controllers/url.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'
import { getAllBunnyFiles } from "../controllers/bunny.controller.js";

const router = express.Router()

router.route('/').post(verifyToken,createUrl).get(verifyToken,getAllUrl)
router.route("/upload").post(upload.single("file"), uploadMedia);
router.get('/bunny-files', getAllBunnyFiles);


router.route("/:shortId").get(redirectToUrl)

export const urlRouter = router