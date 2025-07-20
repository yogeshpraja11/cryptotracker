import React, {useState} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiRequest} from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import CryptoTable from "@/components/crypto-table";
import CryptoCard from "@/components/crypto-card";
import SearchFilters from "@/components/search-filters";
import DashboardStats from "@/components/dashboard-stats";
import {useMobile} from "@/hooks/use-mobile";
import {
  RefreshCw,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [sortOrder, setSortOrder] = useState("asc");
  const isMobile = useMobile();
  const {toast} = useToast();
  const queryClient = useQueryClient();

  // Fetch cryptocurrency data
  const {
    data: cryptoData = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["/api/coins"],
    queryFn: () => fetch(`${API_URL}/api/coins`).then((res) => res.json()),
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });

  // Refresh data mutation
  const refreshMutation = useMutation({
    mutationFn: () =>
      fetch(`${API_URL}/api/coins/refresh`, {method: "POST"}).then((res) =>
        res.json()
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["crypto-data"]});
      toast({
        title: "Data refreshed",
        description: "Cryptocurrency data has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Refresh failed",
        description:
          error.message || "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    },
  });
  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = cryptoData.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle numeric values
      if (typeof aValue === "string" && !isNaN(Number(aValue))) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [cryptoData, searchTerm, sortBy, sortOrder]);

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-500">
                <Activity className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold">Unable to fetch data</h2>
                <p className="text-gray-600">
                  {error?.message || "Please try again later."}
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    refreshMutation.isPending ? "animate-spin" : ""
                  }`}
                />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cryptocurrency Tracker
          </h1>
          <p className="text-muted-foreground">
            Real-time data for the top 10 cryptocurrencies
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshMutation.isPending}
          size="lg"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshMutation.isPending ? "animate-spin" : ""
            }`}
          />
          {refreshMutation.isPending ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats data={cryptoData} />

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Cryptocurrency Display */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({length: 10}).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {isMobile ? (
            <div className="space-y-4">
              {filteredAndSortedData.map((coin) => (
                <CryptoCard key={coin.coinId} coin={coin} />
              ))}
            </div>
          ) : (
            <CryptoTable data={filteredAndSortedData} />
          )}
        </>
      )}

      {filteredAndSortedData.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No cryptocurrencies found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
