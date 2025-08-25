import mongoose from "mongoose";
import Counter from "./Counter.js";

const studentSchema = new mongoose.Schema({
  auth0Id: { type: String, unique: true }, // Added
  customId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String }, 
  profileImage: { type: String },
  phone: { type: String },
  language: { type: String, default: "en" },
  role: { type: String, default: "student" },
  isSuspended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


// Pre-save hook to generate customId if not already set
studentSchema.pre('save', async function (next) {
  const doc = this;
  if (doc.isNew && !doc.customId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { model: 'Student' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const serialNo = counter.seq.toString().padStart(4, '0');
      const sanitizedName = doc.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

      doc.customId = `STU-${sanitizedName}-${serialNo}`;

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
