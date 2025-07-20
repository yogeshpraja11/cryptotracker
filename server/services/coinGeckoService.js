import fetch from 'node-fetch';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptocurrencyData = async () => {
  try {
    console.log('Fetching cryptocurrency data from CoinGecko...');
    
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CryptoTracker/1.0'
        },
        timeout: 10000
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from CoinGecko API');
    }

    const formattedData = data.map((coin, index) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol.toLowerCase(),
      rank: index + 1,
      price: coin.current_price?.toString() || '0',
      marketCap: coin.market_cap?.toString() || '0',
      volume24h: coin.total_volume?.toString() || '0',
      change24h: coin.price_change_percentage_24h?.toString() || '0',
      image: coin.image || '',
      lastUpdated: new Date()
    }));

    console.log(`Successfully fetched ${formattedData.length} cryptocurrencies`);
    return formattedData;

  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error.message);
    throw error;
  }
};