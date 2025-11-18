const Party = require('../models/party');

// @desc    Add new party
// @route   POST /api/party/add
// @access  Public (Should be protected in production)
const addParty = async (req, res) => {
  try {
    const { name, shortName } = req.body;

    // Check if files are uploaded
    if (!req.files || !req.files.flag || !req.files.symbol) {
      return res.status(400).json({
        success: false,
        message: 'Please upload both flag and symbol images',
      });
    }

    // Get file paths
    const flagPath = req.files.flag[0].path;
    const symbolPath = req.files.symbol[0].path;

    // Create new party
    const party = await Party.create({
      name,
      shortName,
      flag: flagPath,
      symbol: symbolPath,
    });

    res.status(201).json({
      success: true,
      message: 'Party added successfully',
      data: party,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all parties
// @route   GET /api/party/all
// @access  Public
const getAllParties = async (req, res) => {
  try {
    const parties = await Party.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: parties.length,
      data: parties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addParty,
  getAllParties,
};