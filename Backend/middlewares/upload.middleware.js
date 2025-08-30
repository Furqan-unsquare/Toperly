import multer from "multer";
import path from "path";

// Set storage location and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

// Accept only images or videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/mpeg", "video/webm","application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"));
  }
};

// Limits (optional, can tweak maxSize)
const limits = {
  fileSize: 1024 * 1024 * 1024, // 1GB max
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});
