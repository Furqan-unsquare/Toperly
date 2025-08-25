import nodemailer from 'nodemailer';
import Admin from '../models/Admin.js';
import crypto from 'crypto';

// Controller to send an invitation to a subadmin
export async function inviteSubadmin(req, res) {
  const { email, role } = req.body;

  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Missing email configuration (EMAIL_USER or EMAIL_PASS)');
    }

    // Validate input
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (role !== 'subadmin') {
      return res.status(400).json({ message: 'Invalid role: Only subadmin invitations are allowed' });
    }

    // Check if email already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate a unique invitation token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    // Save pending invitation to Admin model
    await Admin.create({
      email,
      role,
      inviteToken,
      inviteTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Create a custom signup link
    const inviteLink = `https://93457825b16d.ngrok-free.app/signup?email=${encodeURIComponent(email)}&token=${inviteToken}`;

    // Send email with inviteLink using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Toperly Admin" <your-email@gmail.com>',
      to: email,
      subject: 'Invitation to Join Toperly as Sub-Admin',
      html: `
        <h2>Welcome to Toperly!</h2>
        <p>You have been invited to join Toperly as a Sub-Admin.</p>
        <p>Please click the link below to set up your account:</p>
        <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #4f46e5; text-decoration: none; border-radius: 5px;">
          Set Up Your Account
        </a>
        <p>This link will expire in 7 days.</p>
      `,
    }).catch((error) => {
      console.error('Nodemailer error:', error);
      throw new Error('Failed to send invitation email');
    });

    return res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return res.status(500).json({ message: error instanceof Error ? error.message : 'Server error while sending invitation' });
  }
}

// Controller to verify invitation token
export async function verifyInvite(req, res) {
  const { email, inviteToken } = req.body;

  try {
    const admin = await Admin.findOne({
      email,
      inviteToken,
      inviteTokenExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ valid: false, message: 'Invalid or expired invitation token' });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Error verifying invite:', error);
    return res.status(500).json({ valid: false, message: 'Server error while verifying invite' });
  }
}

// Controller to register a subadmin (simplified, no password hashing)
export async function registerSubadmin(req, res) {
  const { email, password, inviteToken } = req.body;

  try {
    // Validate input
    if (!email || !password || !inviteToken) {
      return res.status(400).json({ message: 'Email, password, and invite token are required' });
    }

    // Find the admin by email and token
    const admin = await Admin.findOne({
      email,
      inviteToken,
      inviteTokenExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired invitation token' });
    }

    // Update admin record (store password insecurely, as requested)
    admin.password = password; // WARNING: Storing plain-text passwords is insecure!
    admin.inviteToken = null;
    admin.inviteTokenExpires = null;
    await admin.save();

    return res.status(200).json({ message: 'Sub-admin registered successfully' });
  } catch (error) {
    console.error('Error registering subadmin:', error);
    return res.status(500).json({ message: 'Server error while registering subadmin' });
  }
}