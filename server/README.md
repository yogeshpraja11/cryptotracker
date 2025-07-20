# Cryptocurrency Tracker Backend

A Node.js Express API for tracking cryptocurrency data using the CoinGecko API and MongoDB.

## Features

- Real-time cryptocurrency data from CoinGecko API
- Automated hourly data collection
- Historical price tracking
- RESTful API endpoints
- MongoDB database integration
- Designed for Render deployment

## API Endpoints

### Cryptocurrency Data
- `GET /api/coins` - Get all current cryptocurrency data
- `POST /api/coins/refresh` - Manually refresh data from CoinGecko
- `GET /api/market-stats` - Get market statistics

### Historical Data
- `POST /api/history` - Store current data as historical snapshot
- `GET /api/history/:coinId` - Get historical data for a specific coin

### Health Check
- `GET /health` - Server health status

## Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cryptotracker?retryWrites=true&w=majority
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Deployment on Render

1. Connect your GitHub repository to Render
2. Set the build command: `npm install`
3. Set the start command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy

## Architecture

- **Models**: Mongoose schemas for data structure
- **Controllers**: Business logic for API endpoints
- **Routes**: Express route definitions
- **Services**: External API integration and cron jobs

## Database Collections

### Cryptocurrency
- Current cryptocurrency data (upserted on each update)
- Indexed by coinId and rank for efficient queries

### HistoricalData
- Historical price snapshots
- Indexed by coinId and timestamp for time-series queries

## Automated Data Collection

The application automatically fetches and stores cryptocurrency data every hour using node-cron. Historical snapshots are saved for trend analysis.