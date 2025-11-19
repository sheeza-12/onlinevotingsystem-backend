// backend/controllers/cnicController.js
const Cnic = require("../models/Cnic");

/**
 * Add a CNIC (single)
 */
exports.createCnic = async (req, res) => {
  try {
    const data = req.body;
    const c = await Cnic.create(data);
    res.status(201).json({ success: true, c });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Bulk seed from JSON array in request body
 * Accepts an array of CNIC objects
 */
exports.bulkSeed = async (req, res) => {
  try {
    const arr = req.body; // expect array of objects
    if (!Array.isArray(arr)) return res.status(400).json({ message: "Provide an array" });
    const result = await Cnic.insertMany(arr, { ordered: false });
    res.json({ success: true, inserted: result.length });
  } catch (err) {
    // If duplicates cause errors, insertMany with ordered:false will skip duplicates
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all CNICs
 */
exports.getAll = async (req, res) => {
  try {
    const list = await Cnic.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
