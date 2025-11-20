// backend/controllers/authController.js
const User = require("../models/User");
const Cnic = require("../models/Cnic");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/sendEmail");   // UPDATED HERE

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Create Admin (admin only)
 * body: { firstname, lastname, email, password }
 */
exports.createAdmin = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    let existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      firstname,
      lastname,
      fullname: `${firstname} ${lastname}`,
      email,
      password: hashed,
      role: "admin",
      isVerified: true, // admins don’t need OTP
    });

    res.status(201).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Signup request → create user skeleton → generate OTP → send email
 */
exports.signupRequest = async (req, res) => {
  try {
    const { firstname, lastname, email, cnic } = req.body;
    const role = "voter";

    // already registered?
    let existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "Email already registered" });

    // verify CNIC exists in DB
    const cnicDoc = await Cnic.findOne({ cnic });
    if (!cnicDoc) {
      return res.status(400).json({
        message: "CNIC not found. Please ensure your CNIC is registered.",
      });
    }

    // Create OTP
    const otp = generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      firstname,
      lastname,
      fullname: `${firstname} ${lastname}`,
      email,
      role,
      cnic,
      fathername: cnicDoc.fathername,
      dob: cnicDoc.dob,
      gender: cnicDoc.gender,
      city: cnicDoc.city,
      province: cnicDoc.province,
      otp,
      otpExpires: otpExpiry,
      isVerified: false,
    });

    // Send email using new sendEmail()
    const html = `
      <h2>Your ECP Verification Code</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "ECP Email Verification",
      html,
    });

    // socket: notify admin
    req.app.get("io")?.emit("notification", {
      type: "new_signup",
      message: `${user.fullname} has requested registration.`,
      userId: user._id,
    });

    res.status(201).json({
      success: true,
      userId: user._id,
      message: "OTP sent to email.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Verify OTP & set password
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp, password } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (
      !user.otp ||
      user.otp !== otp ||
      user.otpExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "OTP invalid or expired" });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Verification complete. You can now login.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "No user with that email" });

    if (!user.isVerified)
      return res
        .status(401)
        .json({ message: "User not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin-only: list voters
 */
exports.getAllVoters = async (req, res) => {
  try {
    const voters = await User.find({ role: "voter" }).select(
      "-otp -otpExpires -password"
    );
    res.json(voters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
