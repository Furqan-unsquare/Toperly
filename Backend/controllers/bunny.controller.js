// controllers/bunny.controller.js
import { listFilesOnBunny } from "../utils/bunnycdnListFiles.js";
import { asyncWrapper } from "../middlewares/asyncWrapper.middleware.js";
import { ApiRes } from "../utils/ApiRes.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllBunnyFiles = asyncWrapper(async (req, res) => {
  const folder = req.query.folder || "urls"; // Default to 'urls' if not provided

  const files = await listFilesOnBunny(folder);
  if (!files) {
    throw new ApiError(500, "Failed to fetch files from BunnyCDN");
  }

  const BUNNY_PULL_ZONE = process.env.BUNNY_PULL_ZONE;

  const formatted = files.map((file) => ({
    filename: file.ObjectName,
    size: file.Length,
    lastModified: file.LastChanged,
    url: `https://${BUNNY_PULL_ZONE}/${folder}/${file.ObjectName}`,
  }));

  return res.status(200).json(new ApiRes(200, formatted, "BunnyCDN files fetched successfully"));
});
