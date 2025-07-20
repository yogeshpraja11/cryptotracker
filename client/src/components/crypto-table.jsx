import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatLargeNumber, formatPercentage } from '@/lib/utils';

export default function CryptoTable({ data }) {
  const getChangeColor = (change) => {
    const value = parseFloat(change);
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((coin) => (
            <TableRow key={coin.coinId}>
              <TableCell className="font-medium">{coin.rank}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-8 w-8 rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {coin.symbol.toUpperCase()}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(parseFloat(coin.price))}
              </TableCell>
              <TableCell className={`text-right font-medium ${getChangeColor(coin.change24h)}`}>
                {formatPercentage(coin.change24h)}
              </TableCell>
              <TableCell className="text-right">
                {formatLargeNumber(parseFloat(coin.marketCap))}
              </TableCell>
              <TableCell className="text-right">
                {formatLargeNumber(parseFloat(coin.volume24h))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}