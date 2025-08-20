import mongoose from 'mongoose';
import './Admin.js';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  date: {
    type: Date,
    default: Date.now
  }, 
  readTime: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;