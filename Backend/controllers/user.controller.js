import { asyncWrapper } from "../middlewares/asyncWrapper.middleware.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { ApiRes } from "../utils/ApiRes.js";
import { uploadFileOnBunny } from "../cdn/bunnycdn.js";

export const signup = asyncWrapper(async (req, res, next) => {
  const { fullname, email, username, password, confirmPassword } = req.body;
  if (!(fullname && email && username && password && confirmPassword))
    throw new ApiError(400, "All fields are required");

  if (password !== confirmPassword)
    throw new ApiError(400, "Passwords do not match");

  // Check for existing user to avoid duplicate errors
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  const query = { fullname, email, username, password };
  if (req.file) {
  
    const uploadResult = await uploadFileOnBunny("images", req.file);
    if (!uploadResult) throw new ApiError(400, "Failed to upload image");
    query.profilePhoto = uploadResult.url;
    query.profilePhotoID = uploadResult.public_id;
  }

  const user = new User(query);
  await user.save();
  return res
    .status(201)
    .json(
      new ApiRes(201, { username: user.username, email: user.email }, "User created successfully")
    );
});

export const login = asyncWrapper(async (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) throw new ApiError(400, "Username and password are required");

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.domain = ".example.com";
  }

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(200).json(
    new ApiRes(
      200,
      {
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        accessToken,
      },
      "Login successful"
    )
  );
});

export const logout = asyncWrapper(async (req, res, next) => {
  const cookieOptions = {
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.domain = ".example.com";
  }
  res.cookie("accessToken", "", cookieOptions);
  res.cookie("refreshToken", "", cookieOptions);

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = "";
  await user.save();
  return res.status(200).json(new ApiRes(200, null, "Logout successful"));
});

export const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find({}, { username: 1, email: 1, fullname: 1, profilePhoto: 1, createdAt: 1 });
  return res.status(200).json(new ApiRes(200, users, "All users retrieved successfully"));
});

export const getUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id, { username: 1, email: 1, fullname: 1, profilePhoto: 1, createdAt: 1 });
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiRes(200, user, "User retrieved successfully"));
});

export const updateUser = asyncWrapper(async (req, res, next) => {
  const { fullname, email, password } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (fullname) user.fullname = fullname;
  if (email) user.email = email;
  if (password) user.password = password; // Will be hashed by pre("save") hook
  if (req.file) {
    const uploadResult = await uploadFileOnBunny("images", req.file);
    if (!uploadResult) throw new ApiError(400, "Failed to upload image");
    user.profilePhoto = uploadResult.url;
    user.profilePhotoID = uploadResult.public_id;
  }

  await user.save();
  return res
    .status(200)
    .json(new ApiRes(200, { username: user.username, email: user.email, fullname: user.fullname }, "User updated successfully"));
});

export const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiRes(200, null, "User deleted successfully"));
});