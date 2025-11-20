// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/admin/create", authCtrl.createAdmin);
router.post("/signup/request", authCtrl.signupRequest);
router.post("/signup/verify", authCtrl.verifyOtp);
router.post("/login", authCtrl.login);
router.get("/voters", auth, role("admin"), authCtrl.getAllVoters);

module.exports = router;
