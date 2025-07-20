import express from 'express';
import {
  getAllCoins,
  refreshCoins,
  storeHistoricalData,
  getCoinHistory,
  getMarketStats
} from '../controllers/coinController.js';

const router = express.Router();

// Get all current cryptocurrency data
router.get('/coins', getAllCoins);

// Manually refresh cryptocurrency data from CoinGecko
router.post('/coins/refresh', refreshCoins);

// Store current data as historical snapshot
router.post('/history', storeHistoricalData);

// Get historical data for a specific coin
router.get('/history/:coinId', getCoinHistory);

// Get market statistics
router.get('/market-stats', getMarketStats);

export default router;