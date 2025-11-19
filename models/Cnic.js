// backend/models/Cnic.js
const mongoose = require("mongoose");

const CnicSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  fullname: { type: String, required: true },
  dob: { type: String, required: true },
  cnic: { type: String, required: true, unique: true }, // e.g. 35202-1234567-1
  fathername: { type: String },
  gender: { type: String },
  city: { type: String },
  province: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Cnic", CnicSchema);
