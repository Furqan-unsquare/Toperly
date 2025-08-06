// controllers/certificateController.js
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Certificate from "../models/Certificate.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";

import PDFDocument from "pdfkit";
import getStream from "get-stream";
import { uploadBufferToIPFS } from "../utils/uploadToIPFS.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const issueCertificateIfEligible = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const course = await Course.findById(courseId);
    const student = await Student.findById(studentId);
    if (!course || !student) {
      return res
        .status(404)
        .json({ success: false, message: "Student or course not found" });
    }

    const existing = await Certificate.findOne({
      student: studentId,
      course: courseId,
    });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Certificate already issued",
        data: existing,
      });
    }

    const quizzes = await Quiz.find({ course: courseId });
    const attempts = await QuizAttempt.find({
      student: studentId,
      course: courseId,
    });

    if (quizzes.length > 0 && attempts.length < quizzes.length) {
      return res
        .status(400)
        .json({ success: false, message: "All quizzes not attempted" });
    }

    let avgScore = 100; // Default full score when no quizzes

    if (quizzes.length > 0) {
      const totalScore = attempts.reduce((acc, a) => acc + a.score, 0);
      avgScore = totalScore / quizzes.length;

      if (avgScore < 75) {
        return res.status(400).json({
          success: false,
          message: `Minimum 75% required, you got ${avgScore.toFixed(2)}%`,
        });
      }
    }

    // ✅ Generate Professional PDF Certificate
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const centerX = pageWidth / 2;

    // Add elegant border
    doc
      .rect(30, 30, pageWidth - 60, pageHeight - 60)
      .lineWidth(3)
      .stroke("#4E71FF"); // Deep green

    doc
      .rect(40, 40, pageWidth - 80, pageHeight - 80)
      .lineWidth(1)
      .stroke("#4A7C59"); // Medium green

    // Add decorative corners
    const cornerSize = 20;
    // Top left corner
    doc
      .moveTo(50, 70)
      .lineTo(70, 50)
      .lineTo(90, 70)
      .lineTo(70, 90)
      .closePath()
      .fill("#4E71FF");
    // Top right corner
    doc
      .moveTo(pageWidth - 50, 70)
      .lineTo(pageWidth - 70, 50)
      .lineTo(pageWidth - 90, 70)
      .lineTo(pageWidth - 70, 90)
      .closePath()
      .fill("#4E71FF");
    // Bottom left corner
    doc
      .moveTo(50, pageHeight - 70)
      .lineTo(70, pageHeight - 50)
      .lineTo(90, pageHeight - 70)
      .lineTo(70, pageHeight - 90)
      .closePath()
      .fill("#4E71FF");
    // Bottom right corner
    doc
      .moveTo(pageWidth - 50, pageHeight - 70)
      .lineTo(pageWidth - 70, pageHeight - 50)
      .lineTo(pageWidth - 90, pageHeight - 70)
      .lineTo(pageWidth - 70, pageHeight - 90)
      .closePath()
      .fill("#4E71FF");

    // Platform logo as image
    try {
      // Option 1: If logo is stored locally in your project
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const logoPath = path.join(
        __dirname,
        "../assets/images/toperly-logo.png"
      );
      // Option 2: If logo is stored in cloud storage (AWS S3, etc.)
      // const logoUrl = 'https://your-bucket.s3.amazonaws.com/toperly-logo.png';
      // const logoResponse = await fetch(logoUrl);
      // const logoBuffer = await logoResponse.buffer();

      // Check if local logo exists
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, centerX - 50, 70, {
          width: 100,
          height: 50,
          fit: [100, 50],
          align: "center",
        });

        // Platform name below logo (smaller)
        // doc.fontSize(18)
        //    .fillColor('#4E71FF')
        //    .font('Helvetica-Bold')
        //    .text('TOPERLY', centerX - 60, 120, { align: 'center', width: 120 });
      } else {
        // Fallback to text logo if image not found
        doc
          .fontSize(28)
          .fillColor("#4E71FF")
          .font("Helvetica-Bold")
          .text("TOPERLY", centerX - 80, 80, { align: "center", width: 160 });
      }
    } catch (logoError) {
      console.log("Logo image not found, using text fallback");
      // Fallback to text logo
      doc
        .fontSize(28)
        .fillColor("#4E71FF")
        .font("Helvetica-Bold")
        .text("TOPERLY", centerX - 80, 80, { align: "center", width: 160 });
    }

    doc
      .fontSize(12)
      .fillColor("#666666")
      .font("Helvetica")
      .text("Learning Excellence Platform", centerX - 120, 135, {
        align: "center",
        width: 240,
      });

    // Main title
    doc
      .fontSize(36)
      .fillColor("#4E71FF")
      .font("Helvetica-Bold")
      .text("CERTIFICATE OF COMPLETION", centerX - 300, 160, {
        align: "center",
        width: 600,
      });

    // Decorative line under title - positioned better
    doc
      .moveTo(centerX - 200, 215)
      .lineTo(centerX + 200, 215)
      .lineWidth(2)
      .stroke("#4A7C59");

    // Certificate text
    doc
      .fontSize(16)
      .fillColor("#333333")
      .font("Helvetica")
      .text("This is to certify that", centerX - 150, 240, {
        align: "center",
        width: 300,
      });

    // Student name (highlighted)
    doc
      .fontSize(32)
      .fillColor("#4E71FF")
      .font("Helvetica-Bold")
      .text(student.name, centerX - 200, 280, { align: "center", width: 400 });

    // Student ID
    doc
      .fontSize(14)
      .fillColor("#666666")
      .font("Helvetica-Oblique")
      .text(`Student ID: ${student.customId}`, centerX - 150, 325, {
        align: "center",
        width: 300,
      });

    // Achievement text
    doc
      .fontSize(16)
      .fillColor("#333333")
      .font("Helvetica")
      .text("has successfully completed the course", centerX - 200, 360, {
        align: "center",
        width: 400,
      });

    // Course name (highlighted)
    doc
      .fontSize(24)
      .fillColor("#4E71FF")
      .font("Helvetica-Bold")
      .text(course.title, centerX - 250, 395, { align: "center", width: 500 });

    // Score achievement
    // doc.fontSize(16)
    //    .fillColor('#333333')
    //    .font('Helvetica')
    //    .text(`with an outstanding average score of`, centerX - 200, 440, { align: 'center', width: 400 });

    // doc.fontSize(28)
    //    .fillColor('#4A7C59')
    //    .font('Helvetica-Bold')
    //    .text(`${avgScore.toFixed(1)}%`, centerX - 50, 470, { align: 'center', width: 100 });

    // Date and instructor section
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Left side - Date
    doc
      .fontSize(12)
      .fillColor("#666666")
      .font("Helvetica")
      .text("Date of Issue:", 100, pageHeight - 120);

    doc
      .fontSize(14)
      .fillColor("#333333")
      .font("Helvetica-Bold")
      .text(currentDate, 100, pageHeight - 100);

    // Right side - Instructor
    doc
      .fontSize(12)
      .fillColor("#666666")
      .font("Helvetica")
      .text("Course Instructor:", pageWidth - 200, pageHeight - 120);

    doc
      .fontSize(14)
      .fillColor("#333333")
      .font("Helvetica-Bold")
      .text(
        course.author || "Certified Instructor",
        pageWidth - 200,
        pageHeight - 100
      );

    // Add signature line
    doc
      .moveTo(pageWidth - 200, pageHeight - 80)
      .lineTo(pageWidth - 80, pageHeight - 80)
      .lineWidth(1)
      .stroke("#CCCCCC");

    doc
      .fontSize(10)
      .fillColor("#999999")
      .font("Helvetica")
      .text("Authorized Signature", pageWidth - 180, pageHeight - 70);

    // Add verification QR code placeholder (you can implement actual QR code generation)
    doc
      .rect(80, pageHeight - 180, 60, 60)
      .lineWidth(1)
      .stroke("#CCCCCC");

    doc
      .fontSize(8)
      .fillColor("#999999")
      .text("Scan to verify", 85, pageHeight - 110);

    // Add certificate ID
    const certificateId = `TOP-${Date.now()}-${studentId.slice(-4)}`;
    doc
      .fontSize(10)
      .fillColor("#999999")
      .font("Helvetica")
      .text(
        `Certificate ID: ${certificateId}`,
        centerX - 100,
        pageHeight - 50,
        { align: "center", width: 200 }
      );

    // Add subtle watermark
    doc
      .fontSize(64)
      .fillColor("#f0f0f0")
      .font("Helvetica-Bold")
      .text("TOPERLY", centerX - 150, centerX - 50, {
        align: "center",
        width: 300,
        opacity: 0.1,
      });

    doc.end();

    const buffer = await getStream.buffer(doc);

    // ✅ Upload to IPFS
    const ipfsUrl = await uploadBufferToIPFS(
      buffer,
      `${student.studentId}-${course.title}.pdf`
    );

    // ✅ Save to DB with certificate ID
    const cert = new Certificate({
      student: student._id,
      studentName: student.name,
      studentCustomId: student.customId,
      course: course._id,
      courseName: course.title,
      author: course.author || "Certified Instructor",
      certificateUrl: ipfsUrl,
      marks: avgScore,
      certificateId: certificateId,
      issuedDate: new Date(),
    });

    await cert.save();

    res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      data: cert,
    });
  } catch (err) {
    console.error("Certificate generation failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate certificate",
      error: err.message,
    });
  }
};

// Create Certificate
export const createCertificate = async (req, res) => {
  try {
    const {
      student,
      studentName,
      studentCustomId,
      course,
      courseName,
      author,
      certificateUrl,
      marks,
    } = req.body;

    // Validate required fields
    if (
      !student ||
      !studentName ||
      !studentCustomId ||
      !course ||
      !courseName ||
      !author ||
      !certificateUrl ||
      marks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate marks
    if (marks < 80) {
      return res.status(400).json({
        success: false,
        message: "Minimum 80% marks required for certificate",
      });
    }

    // Verify student and course exist
    const studentExists = await Student.findById(student);
    const courseExists = await Course.findById(course);

    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if certificate already exists for this student-course combination
    const existingCertificate = await Certificate.findOne({ student, course });
    if (existingCertificate) {
      return res.status(409).json({
        success: false,
        message: "Certificate already exists for this student and course",
      });
    }

    const certificate = new Certificate({
      student,
      studentName,
      studentCustomId,
      course,
      courseName,
      author,
      certificateUrl,
      marks,
    });

    await certificate.save();

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate("student", "name email")
      .populate("course", "title");

    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      data: populatedCertificate,
    });
  } catch (error) {
    console.error("Create certificate error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Certificate already exists for this student and course",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create certificate",
      error: error.message,
    });
  }
};

// Get All Certificates
export const getAllCertificates = async (req, res) => {
  try {
    const { student, course, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (student) filter.student = student;
    if (course) filter.course = course;

    const skip = (page - 1) * limit;

    const certificates = await Certificate.find(filter)
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ issuedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Certificate.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: certificates,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get certificates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      error: error.message,
    });
  }
};

// Get Certificate by ID
export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id)
      .populate("student", "name email")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Get certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate",
      error: error.message,
    });
  }
};

// Update Certificate
export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      studentName,
      studentCustomId,
      courseName,
      author,
      certificateUrl,
      marks,
    } = req.body;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // Validate marks if provided
    if (marks !== undefined && marks < 80) {
      return res.status(400).json({
        success: false,
        message: "Minimum 80% marks required for certificate",
      });
    }

    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      {
        studentName,
        studentCustomId,
        courseName,
        author,
        certificateUrl,
        marks,
      },
      { new: true, runValidators: true }
    )
      .populate("student", "name email")
      .populate("course", "title");

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: updatedCertificate,
    });
  } catch (error) {
    console.error("Update certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update certificate",
      error: error.message,
    });
  }
};

// Delete Certificate
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    await Certificate.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error("Delete certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
      error: error.message,
    });
  }
};

// Get Student Certificates
export const getStudentCertificates = async (req, res) => {
  try {
    const { studentId } = req.params;

    const certificates = await Certificate.find({ student: studentId })
      .populate("course", "title")
      .sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error("Get student certificates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student certificates",
      error: error.message,
    });
  }
};
