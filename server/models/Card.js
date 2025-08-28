const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true
  },
  sport: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear() + 1
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  setName: {
    type: String,
    required: true,
    trim: true
  },
  cardNumber: {
    type: String,
    required: true,
    trim: true
  },
  frontImage: {
    type: String,
    required: true
  },
  backImage: {
    type: String,
    required: true
  },
  condition: {
    centering: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    corners: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    edges: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    surface: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    overall: {
      type: String,
      enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent', 'Near Mint', 'Mint', 'Gem Mint'],
      required: true
    }
  },
  isRookieCard: {
    type: Boolean,
    default: false
  },
  isAutograph: {
    type: Boolean,
    default: false
  },
  isMemorabilia: {
    type: Boolean,
    default: false
  },
  estimatedValue: {
    type: Number,
    min: 0,
    default: 0
  },
  marketValue: {
    type: Number,
    min: 0,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  lotNumber: {
    type: String,
    trim: true
  },
  isForTrade: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
cardSchema.index({ playerName: 1 });
cardSchema.index({ sport: 1 });
cardSchema.index({ year: 1 });
cardSchema.index({ manufacturer: 1 });
cardSchema.index({ userId: 1 });
cardSchema.index({ isForTrade: 1 });
cardSchema.index({ estimatedValue: -1 });

module.exports = mongoose.model('Card', cardSchema);