const express = require("express");
const { registerAdmin, loginAdmin } = require("../controllers/authController");

const router = express.Router();

// Register Admin (use only 1 time)
router.post("/register", registerAdmin);

// Login Admin
router.post("/login", loginAdmin);

module.exports = router;
