import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatLargeNumber, formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function DashboardStats({ data }) {
  const stats = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalMarketCap = data.reduce((sum, coin) => sum + parseFloat(coin.marketCap), 0);
    const totalVolume = data.reduce((sum, coin) => sum + parseFloat(coin.volume24h), 0);
    const positiveCoins = data.filter(coin => parseFloat(coin.change24h) > 0);
    const negativeCoins = data.filter(coin => parseFloat(coin.change24h) < 0);
    const avgChange = data.reduce((sum, coin) => sum + parseFloat(coin.change24h), 0) / data.length;

    return {
      totalMarketCap,
      totalVolume,
      positiveCoins: positiveCoins.length,
      negativeCoins: negativeCoins.length,
      avgChange
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatLargeNumber(stats.totalMarketCap)}
          </div>
          <p className="text-xs text-muted-foreground">
            Top 10 cryptocurrencies
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatLargeNumber(stats.totalVolume)}
          </div>
          <p className="text-xs text-muted-foreground">
            Combined trading volume
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Winners</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.positiveCoins}
          </div>
          <p className="text-xs text-muted-foreground">
            Coins with positive 24h change
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Losers</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.negativeCoins}
          </div>
          <p className="text-xs text-muted-foreground">
            Coins with negative 24h change
          </p>
        </CardContent>
      </Card>
    </div>
  );
}