// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  fullname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // set after OTP verification
  role: { type: String, enum: ["admin", "voter"], required: true },

  // optional voter details (from CNIC)
  cnic: { type: String },
  fathername: { type: String },
  dob: { type: String },
  gender: { type: String },
  city: { type: String },
  province: { type: String },

  hasVoted: { type: Boolean, default: false },

  // OTP
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
