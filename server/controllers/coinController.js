import Cryptocurrency from '../models/Cryptocurrency.js';
import HistoricalData from '../models/HistoricalData.js';
import { fetchCryptocurrencyData } from '../services/coinGeckoService.js';

// Get all current cryptocurrency data
export const getAllCoins = async (req, res) => {
  try {
    const coins = await Cryptocurrency.find({}).sort({ rank: 1 });
    res.json(coins);
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
  }
};

// Manually refresh cryptocurrency data
export const refreshCoins = async (req, res) => {
  try {
    console.log('Manual refresh requested');
    const freshData = await fetchCryptocurrencyData();
    
    if (!freshData || freshData.length === 0) {
      return res.status(500).json({ error: 'No data received from CoinGecko API' });
    }

    // Update or create each coin record
    const updatePromises = freshData.map(async (coin) => {
      return await Cryptocurrency.findOneAndUpdate(
        { coinId: coin.coinId },
        coin,
        { upsert: true, new: true }
      );
    });

    const updatedCoins = await Promise.all(updatePromises);
    
    console.log(`Successfully updated ${updatedCoins.length} cryptocurrencies`);
    res.json({ 
      message: 'Data refreshed successfully', 
      count: updatedCoins.length,
      data: updatedCoins 
    });
  } catch (error) {
    console.error('Error refreshing coins:', error);
    res.status(500).json({ error: 'Failed to refresh cryptocurrency data' });
  }
};

// Store historical snapshot
export const storeHistoricalData = async (req, res) => {
  try {
    const currentCoins = await Cryptocurrency.find({}).sort({ rank: 1 });
    
    if (currentCoins.length === 0) {
      return res.status(400).json({ error: 'No current data available to store' });
    }

    // Create historical records
    const historicalRecords = currentCoins.map(coin => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      marketCap: coin.marketCap,
      volume24h: coin.volume24h,
      change24h: coin.change24h,
      timestamp: new Date()
    }));

    const savedRecords = await HistoricalData.insertMany(historicalRecords);
    
    console.log(`Stored ${savedRecords.length} historical records`);
    res.json({ 
      message: 'Historical data stored successfully', 
      count: savedRecords.length 
    });
  } catch (error) {
    console.error('Error storing historical data:', error);
    res.status(500).json({ error: 'Failed to store historical data' });
  }
};

// Get historical data for a specific coin
export const getCoinHistory = async (req, res) => {
  try {
    const { coinId } = req.params;
    const limit = parseInt(req.query.limit) || 24; // Default to 24 hours of data
    
    const historicalData = await HistoricalData
      .find({ coinId })
      .sort({ timestamp: -1 })
      .limit(limit);
    
    res.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
};

// Get market statistics
export const getMarketStats = async (req, res) => {
  try {
    const coins = await Cryptocurrency.find({}).sort({ rank: 1 });
    
    if (coins.length === 0) {
      return res.json({
        totalMarketCap: '0',
        totalVolume: '0',
        topGainer: null,
        topLoser: null
      });
    }

    const totalMarketCap = coins.reduce((sum, coin) => {
      return sum + parseFloat(coin.marketCap || 0);
    }, 0);

    const totalVolume = coins.reduce((sum, coin) => {
      return sum + parseFloat(coin.volume24h || 0);
    }, 0);

    const sortedByChange = coins.sort((a, b) => {
      return parseFloat(b.change24h || 0) - parseFloat(a.change24h || 0);
    });

    const topGainer = sortedByChange[0];
    const topLoser = sortedByChange[sortedByChange.length - 1];

    res.json({
      totalMarketCap: totalMarketCap.toString(),
      totalVolume: totalVolume.toString(),
      topGainer: topGainer,
      topLoser: topLoser
    });
  } catch (error) {
    console.error('Error fetching market stats:', error);
    res.status(500).json({ error: 'Failed to fetch market statistics' });
  }
};