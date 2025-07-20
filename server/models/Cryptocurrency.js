import mongoose from 'mongoose';

const cryptocurrencySchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  marketCap: {
    type: String,
    required: true
  },
  volume24h: {
    type: String,
    required: true
  },
  change24h: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
cryptocurrencySchema.index({ rank: 1 });
cryptocurrencySchema.index({ lastUpdated: -1 });

const Cryptocurrency = mongoose.model('Cryptocurrency', cryptocurrencySchema);

export default Cryptocurrency;