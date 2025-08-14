import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  auth0Id: { type: String, unique: true }, // Added
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'subadmin'],
    default: 'admin'
  }
}, { timestamps: true });

adminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;