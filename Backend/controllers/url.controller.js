import { Url } from "../models/url.model.js";
import { nanoid } from "nanoid";
import { asyncWrapper } from "../middlewares/asyncWrapper.middleware.js";
import { ApiRes } from "../utils/ApiRes.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadFileOnBunny } from "../cdn/bunnycdn.js";
import fs from "fs/promises";
import path from "path";

export const createUrl = asyncWrapper(async (req, res, next) => {
  const { url } = req.body;
  if (!url) {
    throw new ApiError(400, "URL is required");
  }
  const shortId = nanoid(5);
  const shortedUrl = `ttp://localhost:${
    process.env.PORT || 5000
  }/api/${shortId}`;

  // Create URL document for MongoDB
  const urlObj = new Url({
    shortId,
    redirectUrl: url,
    user: req.user._id,
    shortedUrl,
  });
  await urlObj.save();
  console.log("URL saved to MongoDB:", urlObj);

  // Create JSON file for Bunny CDN
  const jsonData = JSON.stringify({
    shortId,
    redirectUrl: url,
    user: req.user._id.toString(),
    shortedUrl,
    createdAt: urlObj.createdAt,
  });
  const tempFilePath = path.join(process.cwd(), `temp-${shortId}.json`);
  await fs.writeFile(tempFilePath, jsonData);
  console.log("Temp JSON file created:", tempFilePath);

  // Upload JSON file to Bunny CDN
  const file = {
    path: tempFilePath,
    filename: `url-${shortId}.json`,
    originalname: `url-${shortId}.json`,
  };
  console.log("Prepared file for Bunny upload:", file);

  const uploadResult = await uploadFileOnBunny("urls", file);
  if (!uploadResult) {
    await fs
      .unlink(tempFilePath)
      .catch((err) => console.warn("Failed to delete temp file:", err.message));
    throw new ApiError(500, "Failed to upload URL metadata to Bunny CDN");
  }
  console.log("Bunny CDN upload result:", uploadResult);

  // Update MongoDB with Bunny CDN URL and file ID
  urlObj.bunnyUrl = uploadResult.url;
  urlObj.bunnyFileId = uploadResult.public_id;
  await urlObj.save();
  console.log("URL updated with Bunny CDN details:", urlObj);

  // Clean up temp file
  await fs
    .unlink(tempFilePath)
    .catch((err) => console.warn("Failed to delete temp file:", err.message));

  return res
    .status(201)
    .json(new ApiRes(201, urlObj, "URL shortened and uploaded to Bunny CDN"));
});

export const getAllUrl = asyncWrapper(async (req, res, next) => {
  const urls = await Url.find({ user: req.user._id }).populate(
    "user",
    "username email"
  );
  return res
    .status(200)
    .json(new ApiRes(200, urls, "All shortened URLs retrieved"));
});

export const redirectToUrl = asyncWrapper(async (req, res, next) => {
  const { shortId } = req.params;
  if (!shortId) {
    throw new ApiError(400, "Short ID required");
  }
  const url = await Url.findOne({ shortId });
  if (!url) {
    throw new ApiError(404, "URL not found");
  }
  url.visited += 1;
  await url.save();
  return res.redirect(url.redirectUrl);
});
console.log("uploadPhoto route triggered");

// Replace uploadPhoto with a generic uploadMedia function
export const uploadMedia = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  console.log("Uploading file to Bunny CDN:", req.file);

  const uploadResult = await uploadFileOnBunny("images", req.file); // Store all media under folder
  if (!uploadResult) {
    throw new ApiError(500, "Failed to upload file to Bunny CDN");
  }

  return res
    .status(201)
    .json(
      new ApiRes(201, { url: uploadResult.url }, "Media uploaded successfully")
    );
});
