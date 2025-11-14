const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Admin (only for first time)
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPass,
    });

    await newAdmin.save();

    res.json({ success: true, message: "Admin registered" });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
