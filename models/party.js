const mongoose = require('mongoose');

// Party Schema
const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Party name is required'],
      trim: true,
    },
    shortName: {
      type: String,
      required: [true, 'Short name is required'],
      trim: true,
    },
    flag: {
      type: String,
      required: [true, 'Party flag is required'],
    },
    symbol: {
      type: String,
      required: [true, 'Party symbol is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Party', partySchema);