const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
      required: [true, 'Party ID is required'],
    },
    partyName: {
      type: String,
      required: [true, 'Party name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    electionType: {
      type: String,
      required: [true, 'Election type is required'],
      trim: true,
    },
    candidateImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Candidate', candidateSchema);