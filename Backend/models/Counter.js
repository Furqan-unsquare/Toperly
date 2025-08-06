// models/Counter.js

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },  // e.g. 'Instructor' or 'Student'
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
export default Counter;
