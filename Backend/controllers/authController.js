import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Instructor from "../models/Instructor.js";
import Course from "../models/Course.js";
import Certificate from "../models/Certificate.js";
import EnrolledCourse from "../models/EnrolledCourse.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Review from "../models/Review.js";
import Transaction from "../models/Transaction.js";
import Wishlist from "../models/Wishlist.js";
import { ManagementClient } from "auth0";
import Admin from "../models/Admin.js";

const auth0Management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MACHINE_CLIENT_ID,
  clientSecret: process.env.AUTH0_MACHINE_CLIENT_SECRET,
  scope: "read:users update:users",
});

// JWT secret from env
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const syncAuth0User = async (req, res) => {
  try {
    const { auth0Id, email, name, profileImage } = req.body;
    const { sub: userSub, role } = req.auth; // From token, sub is auth0Id

    if (auth0Id !== userSub) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let userModel = role ? (role === "student" ? Student : Instructor) : null; // If role in token
    let existingUser;

    if (userModel) {
      existingUser = await userModel.findOne({ $or: [{ auth0Id }, { email }] });
    } else {
      // Check both models if no role yet
      existingUser =
        (await Student.findOne({ $or: [{ auth0Id }, { email }] })) ||
        (await Instructor.findOne({ $or: [{ auth0Id }, { email }] }));
    }

    if (existingUser) {
      // Update profile
      existingUser.name = name || existingUser.name;
      existingUser.profileImage = profileImage || existingUser.profileImage;
      await existingUser.save();
      return res.json({ user: existingUser, needsRole: false });
    } else {
      // New user, needs role
      return res.json({ needsRole: true });
    }
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignRole = async (req, res) => {
  try {
    const {
      auth0Id,
      role,
      name,
      email,
      phone,
      language,
      bio,
      expertise,
      profileImage,
    } = req.body;
    const { sub } = req.auth;

    console.log("Assign role request body:", req.body); // Debug log

    if (auth0Id !== sub) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if user already exists
    const existingUser =
      (await Student.findOne({ $or: [{ auth0Id }, { email }] })) ||
      (await Instructor.findOne({ $or: [{ auth0Id }, { email }] })) ||
      (await Admin.findOne({ $or: [{ auth0Id }, { email }] }));
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email or Auth0 ID" });
    }
    console.log(req.body);
    let newUser;
    if (role === "student") {
      newUser = new Student({
        auth0Id,
        name,
        email,
        profileImage: profileImage || "",
        phone: phone || "",
        language: language || "en",
        role,
      });
    } else if (role === "instructor") {
      newUser = new Instructor({
        auth0Id,
        name,
        email,
        profileImage: profileImage || "",
        bio: bio || "",
        expertise: expertise || [],
        role,
      });
    } else if (role === "admin" || role === "subadmin") {
      newUser = new Admin({
        auth0Id,
        email,
        name, // Include name if required by Admin schema
        role,
      });
    } else {
      return res.status(400).json({ message: "Unsupported role" });
    }

    await newUser.save();

    // Update Auth0 metadata
    try {
      await auth0Management.users.update(
        { id: auth0Id },
        { user_metadata: { role } }
      );
    } catch (auth0Error) {
      console.error("Auth0 metadata update error:", auth0Error);
      return res
        .status(500)
        .json({
          message: "Failed to update Auth0 metadata",
          error: auth0Error.message,
        });
    }

    res.json({ user: newUser });
  } catch (err) {
    console.error("Assign role error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Register handler (shared)
export const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, expertise, phone, language } =
      req.body;
    console.log(name);
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, password and role are required" });
    }

    if (!["student", "instructor"].includes(role)) {
      return res
        .status(400)
        .json({ message: 'Role must be either "student" or "instructor"' });
    }

    // Check if user already exists in either collection by email
    const existingInstructor = await Instructor.findOne({ email });
    const existingStudent = await Student.findOne({ email });
    if (existingInstructor || existingStudent) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "instructor") {
      newUser = new Instructor({
        name,
        email,
        password: hashedPassword,
        bio: bio || "",
        expertise: expertise || [],
        role,
      });
    } else {
      // role == student
      newUser = new Student({
        name,
        email,
        passwordHash: hashedPassword,
        phone: phone || "",
        language: language || "en",
        role,
      });
    }

    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      message: `${role} registered successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

// Login handler (shared)
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password and role are required" });
    }

    if (!["student", "instructor"].includes(role)) {
      return res
        .status(400)
        .json({ message: 'Role must be either "student" or "instructor"' });
    }

    let user;

    if (role === "instructor") {
      user = await Instructor.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "Instructor not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      if (user.isSuspended) {
        return res
          .status(403)
          .json({
            message: "Your account has been suspended. Contact support.",
          });
      }
    } else {
      // student
      user = await Student.findOne({ email });
      if (!user) return res.status(404).json({ message: "Student not found" });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      if (user.isSuspended) {
        return res
          .status(403)
          .json({
            message: "Your account has been suspended. Contact support.",
          });
      }
    }

    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// logout handler
export const logout = async (req, res) => {
  // If using cookies for JWT, clear them. Otherwise, instruct client to remove locally stored token.
  res.status(200).json({ message: "Logout successful" });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id, role } = req.user; // set by verifyAuth0Token middleware

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    let user;
    if (role === "student") {
      user = await Student.findById(id);
      if (!user) return res.status(404).json({ message: "Student not found" });

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch)
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });

      const hashedNew = await bcrypt.hash(newPassword, 10);
      user.passwordHash = hashedNew;
    } else if (role === "instructor") {
      user = await Instructor.findById(id);
      if (!user)
        return res.status(404).json({ message: "Instructor not found" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });

      const hashedNew = await bcrypt.hash(newPassword, 10);
      user.password = hashedNew;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error during password change" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { sub: auth0Id, role } = req.auth;

    if (role === "student") {
      const student = await Student.findOne({ auth0Id }).lean();
      if (!student)
        return res.status(404).json({ message: "Student not found" });

      const [
        enrolledCourses,
        certificates,
        quizAttempts,
        reviews,
        transactions,
        wishlist,
      ] = await Promise.all([
        EnrolledCourse.find({ student: id }).populate("course").lean(),
        Certificate.find({ student: id }).populate("course").lean(),
        QuizAttempt.find({ student: id }).populate("quiz course").lean(),
        Review.find({ student: id }).populate("course").lean(),
        Transaction.find({ student: id }).populate("course").lean(),
        Wishlist.find({ student: id }).populate("course").lean(),
      ]);

      return res.json({
        profile: student,
        enrolledCourses,
        certificates,
        quizAttempts,
        reviews,
        transactions,
        wishlist,
      });
    } else if (role === "instructor") {
      const instructor = await Instructor.findOne({ auth0Id }).lean();
      if (!instructor)
        return res.status(404).json({ message: "Instructor not found" });

      const courses = await Course.find({ instructor: id }).lean();

      const courseIds = courses.map((c) => c._id);

      const [reviews, certificates] = await Promise.all([
        Review.find({ course: { $in: courseIds } })
          .populate("student course")
          .lean(),
        Certificate.find({ course: { $in: courseIds } }).lean(),
      ]);

      return res.json({
        profile: instructor,
        courses,
        reviews,
        certificatesIssued: certificates,
      });
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }
  } catch (err) {
    console.error("getUserDetails error:", err);
    res
      .status(500)
      .json({
        message: "Server error fetching user details",
        error: err.message,
      });
  }
};

// For updateUserInfo, add sync to Auth0 if role changes
export const updateUserInfo = async (req, res) => {
  try {
    const { sub: auth0Id, role: currentRole } = req.auth;
    const updateData = req.body;

    let user;
    if (currentRole === "student") {
      user = await Student.findOne({ auth0Id });
    } else if (currentRole === "instructor") {
      user = await Instructor.findOne({ auth0Id });
    } // Handle others

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    Object.assign(user, updateData);

    if (updateData.role && updateData.role !== currentRole) {
      // Handle role change if allowed, migrate data if needed
      // For simplicity, assume not changing role here
    }

    await user.save();

    // Sync role to Auth0 if changed
    if (updateData.role) {
      await auth0Management.users.update(
        { id: auth0Id },
        { user_metadata: { role: updateData.role } }
      );
    }

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
