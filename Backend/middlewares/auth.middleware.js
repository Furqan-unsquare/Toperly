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
    const student = await Student.find({auth0Id: req.auth.sub});
    const instructor = await Instructor.find({auth0Id: req.auth.sub});
    const admin = await Admin.find({auth0Id: req.auth.sub});
    console.log(student)
    if (student[0]) {
      req.user = student[0];
      next();
    }
    if (instructor[0]) {
      req.user = instructor[0];
      next();
    }
    if (admin[0]) {
      req.user = admin[0];
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export const isStudent = async (req, res, next) => {
  try {
    const student = await Student.find({auth0Id: req.auth.sub});
    if (!student) {
      return res.status(403).json({ message: "Access denied. Not a student." });
    }
    req.user = student[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// For instructors
export const isInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.find({auth0Id: req.auth.sub});
    if (!instructor) {
      return res.status(403).json({ message: "Access denied. Not an instructor." });
    }
    req.user = instructor[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// For admins
export const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.find({auth0Id: req.auth.sub});
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }
    req.user = admin[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
