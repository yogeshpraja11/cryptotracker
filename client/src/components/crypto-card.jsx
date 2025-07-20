import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatLargeNumber, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function CryptoCard({ coin }) {
  const change24h = parseFloat(coin.change24h);
  const isPositive = change24h >= 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={coin.image}
                alt={coin.name}
                className="h-10 w-10 rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {coin.rank}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{coin.name}</h3>
              <p className="text-sm text-muted-foreground">
                {coin.symbol.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold">
              {formatCurrency(parseFloat(coin.price))}
            </div>
            <div className={`flex items-center text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {formatPercentage(coin.change24h)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p className="font-medium">
              {formatLargeNumber(parseFloat(coin.marketCap))}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume (24h)</p>
            <p className="font-medium">
              {formatLargeNumber(parseFloat(coin.volume24h))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}