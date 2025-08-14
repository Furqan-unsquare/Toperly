import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  auth0Id: { type: String, unique: true }, // Added
  customId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, minlength: 6 }, // Optional for social
  profileImage: { type: String, default: '' },
  bio: { type: String, default: '' },
  expertise: [{ type: String, trim: true }],
  isVerified: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  role: { type: String, default: 'instructor' },
  payoutDetails: {
    razorpayAccountId: { type: String, default: '' },
    preferredMethod: { type: String, default: 'bank_transfer' }
  }
});

// Generate customId before saving
instructorSchema.pre('save', async function (next) {
  if (!this.isNew || this.customId) return next();

  // Format name: replace spaces with underscores, remove special chars
  const cleanName = this.name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

  // Count existing instructors with same name pattern
  const count = await mongoose.models.Instructor.countDocuments({
    name: this.name
  });

  const number = String(count + 1).padStart(3, '0');
  this.customId = `INS_${cleanName}_${number}`;
  
  next();
});

const Instructor = mongoose.models.Instructor || mongoose.model('Instructor', instructorSchema);
export default Instructor;
