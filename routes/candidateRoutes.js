const express = require('express');
const router = express.Router();
const {
  addCandidate,
  getCandidatesByParty,
  updateCandidate,
  deleteCandidate,
} = require('../controllers/candidateController');
const upload = require('../middleware/candidateUploadMiddleware');

// POST route to add new candidate with image upload
router.post('/add', upload, addCandidate);

// GET route to fetch all candidates by party ID
router.get('/:partyId', getCandidatesByParty);

// PUT route to update candidate
router.put('/update/:candidateId', upload, updateCandidate);

// DELETE route to delete candidate
router.delete('/delete/:candidateId', deleteCandidate);

module.exports = router;
