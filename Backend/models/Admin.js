import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  auth0Id: { type: String, unique: true, sparse: true }, // Sparse index to allow multiple null values
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: { type: String },
  inviteToken: { type: String },
  inviteTokenExpires: { type: Date },
  role: {
    type: String,
    enum: ['admin', 'subadmin'],
    default: 'admin',
  },
}, { timestamps: true });

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ inviteToken: 1 }, { unique: true, sparse: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;