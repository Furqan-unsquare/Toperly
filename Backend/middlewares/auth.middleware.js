import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";
dotenv.config();
import Student from "../models/Student.js";
import Instructor from "../models/Instructor.js";
import Admin from "../models/Admin.js";

export const verifyAuth0Token = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

export const commonVerification = async (req, res, next) => {
  try {
    const auth0Id = req.auth.sub;

    // Check for user in collections
    const student = await Student.findOne({ auth0Id });
    if (student) {
      req.user = { ...student.toObject(), id: student._id.toString(), role: "student" };
      return next();
    }

    const instructor = await Instructor.findOne({ auth0Id });
    if (instructor) {
      req.user = { ...instructor.toObject(), id: instructor._id.toString(), role: "instructor" };
      return next();
    }

    const admin = await Admin.findOne({ auth0Id });
    if (admin) {
      req.user = { ...admin.toObject(), id: admin._id.toString(), role: admin.role || "admin" };
      return next();
    }

    // If no user found
    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("commonVerification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const isStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ auth0Id: req.auth.sub });
    if (!student) {
      return res.status(403).json({ message: "Access denied. Not a student." });
    }
    req.user = { ...student.toObject(), id: student._id.toString(), role: "student" };
    next();
  } catch (err) {
    console.error("isStudent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const isInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.findOne({ auth0Id: req.auth.sub });
    if (!instructor) {
      return res.status(403).json({ message: "Access denied. Not an instructor." });
    }
    req.user = { ...instructor.toObject(), id: instructor._id.toString(), role: "instructor" };
    next();
  } catch (err) {
    console.error("isInstructor error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ auth0Id: req.auth.sub });
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }
    req.user = { ...admin.toObject(), id: admin._id.toString(), role: admin.role || "admin" };
    next();
  } catch (err) {
    console.error("isAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};