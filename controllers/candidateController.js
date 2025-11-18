const Candidate = require('../models/candidate');
const fs = require('fs');
const path = require('path');

const addCandidate = async (req, res) => {
  try {
    const { role, name, partyId, partyName, email, city, electionType } = req.body;

    // Validate required fields
    if (!role || !name || !partyId || !partyName || !email || !city || !electionType) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    // Check if email already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidate with this email already exists',
      });
    }

    // Get candidate image path if uploaded
    const candidateImage = req.file ? req.file.path : '';

    // Create new candidate
    const candidate = await Candidate.create({
      role,
      name,
      partyId,
      partyName,
      email,
      city,
      electionType,
      candidateImage,
    });

    res.status(201).json({
      success: true,
      message: 'Candidate added successfully',
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all candidates by party ID
// @route   GET /api/candidates/:partyId
// @access  Public
const getCandidatesByParty = async (req, res) => {
  try {
    const { partyId } = req.params;

    const candidates = await Candidate.find({ partyId })
      .populate('partyId', 'name shortName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/update/:candidateId
// @access  Private
const updateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { role, name, partyId, partyName, email, city, electionType } = req.body;

    // Find candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    // Check email uniqueness if email is being changed
    if (email && email !== candidate.email) {
      const existingCandidate = await Candidate.findOne({ email });
      if (existingCandidate) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
      }
    }

    // Handle image update
    let candidateImage = candidate.candidateImage;
    if (req.file) {
      // Delete old image if exists
      if (candidate.candidateImage && fs.existsSync(candidate.candidateImage)) {
        fs.unlinkSync(candidate.candidateImage);
      }
      candidateImage = req.file.path;
    }

    // Update candidate
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      {
        role: role || candidate.role,
        name: name || candidate.name,
        partyId: partyId || candidate.partyId,
        partyName: partyName || candidate.partyName,
        email: email || candidate.email,
        city: city || candidate.city,
        electionType: electionType || candidate.electionType,
        candidateImage,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: updatedCandidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/delete/:candidateId
// @access  Private
const deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    // Delete candidate image if exists
    if (candidate.candidateImage && fs.existsSync(candidate.candidateImage)) {
      fs.unlinkSync(candidate.candidateImage);
    }

    await Candidate.findByIdAndDelete(candidateId);

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addCandidate,
  getCandidatesByParty,
  updateCandidate,
  deleteCandidate,
};