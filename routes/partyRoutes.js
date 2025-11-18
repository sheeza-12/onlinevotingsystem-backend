const express = require('express');
const router = express.Router();
const { addParty, getAllParties } = require('../controllers/partyController');
const upload = require('../middleware/uploadMiddleware');

// POST route to add new party with image uploads
router.post('/add', upload, addParty);

// GET route to fetch all parties
router.get('/all', getAllParties);

module.exports = router;