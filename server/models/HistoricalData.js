import mongoose from 'mongoose';

const historicalDataSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
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
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient historical queries
historicalDataSchema.index({ coinId: 1, timestamp: -1 });

const HistoricalData = mongoose.model('HistoricalData', historicalDataSchema);

export default HistoricalData;