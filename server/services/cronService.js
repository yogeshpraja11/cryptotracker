import cron from 'node-cron';
import Cryptocurrency from '../models/Cryptocurrency.js';
import HistoricalData from '../models/HistoricalData.js';
import { fetchCryptocurrencyData } from './coinGeckoService.js';

const updateCryptocurrencyData = async () => {
  try {
    console.log('Starting scheduled cryptocurrency data update...');
    
    const freshData = await fetchCryptocurrencyData();
    
    if (!freshData || freshData.length === 0) {
      console.error('No data received from CoinGecko API');
      return;
    }

    // Update or create current data
    const updatePromises = freshData.map(async (coin) => {
      return await Cryptocurrency.findOneAndUpdate(
        { coinId: coin.coinId },
        coin,
        { upsert: true, new: true }
      );
    });

    const updatedCoins = await Promise.all(updatePromises);
    console.log(`Updated ${updatedCoins.length} cryptocurrencies`);

    // Store historical snapshot
    const historicalRecords = updatedCoins.map(coin => ({
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

    console.log('Scheduled cryptocurrency data update completed successfully');
    
  } catch (error) {
    console.error('Error in scheduled cryptocurrency data update:', error);
  }
};

export const startCronJob = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', updateCryptocurrencyData, {
    scheduled: true,
    timezone: "UTC"
  });

  console.log('Cryptocurrency data cron job started - runs every hour');
  
  // Run initial update
  setTimeout(updateCryptocurrencyData, 5000);
};