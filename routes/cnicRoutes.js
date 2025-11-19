// backend/routes/cnicRoutes.js
const express = require("express");
const router = express.Router();
const cnicCtrl = require("../controllers/cnicController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// public: get all / seed / create (seed should ideally be protected, but open for convenience)
router.get("/", cnicCtrl.getAll);
router.post("/create", cnicCtrl.createCnic);
router.post("/bulk-seed", cnicCtrl.bulkSeed);

module.exports = router;
