import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Package, Calendar, Award, Target } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { getCollectionStats, type CollectionStats } from '@/api/cards';

export function Analytics() {
  const { toast } = useToast();
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        console.log('Loading analytics data...');
        const response = await getCollectionStats();
        
        if (response.success && response.stats) {
          setStats(response.stats);
          console.log('Analytics data loaded successfully');
        } else {
          console.error('Invalid response structure:', response);
          toast({
            title: "Warning",
            description: "Failed to load analytics data.",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        console.error('Error loading analytics data:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load analytics data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [toast]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Mock data for additional charts
  const valueOverTime = [
    { month: 'Jan', value: 85000 },
    { month: 'Feb', value: 92000 },
    { month: 'Mar', value: 98000 },
    { month: 'Apr', value: 105000 },
    { month: 'May', value: 115000 },
    { month: 'Jun', value: 125750 }
  ];

  const topCards = [
    { name: 'Michael Jordan RC', value: 25000, sport: 'Basketball' },
    { name: 'LeBron James Auto', value: 15000, sport: 'Basketball' },
    { name: 'Wayne Gretzky RC', value: 12000, sport: 'Hockey' },
    { name: 'Tom Brady Auto', value: 8500, sport: 'Football' },
    { name: 'Mike Trout RC', value: 2500, sport: 'Baseball' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights into your card collection performance and trends.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalValue?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCards?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +8 cards this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats && stats.totalCards && stats.totalCards > 0
                ? Math.round(stats.totalValue / stats.totalCards).toLocaleString()
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per card value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sports Count</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.sportBreakdown?.length || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Different sports
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="value">Value Trends</TabsTrigger>
          <TabsTrigger value="top-cards">Top Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collection by Sport */}
            <Card>
              <CardHeader>
                <CardTitle>Collection by Sport</CardTitle>
                <CardDescription>
                  Distribution of cards across different sports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.sportBreakdown && stats.sportBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.sportBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ _id, count }) => `${_id}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats.sportBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No sport data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest additions to your collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentCards && stats.recentCards.length > 0 ? (
                    stats.recentCards.slice(0, 5).map((card) => (
                      <div key={card._id} className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img
                            src={card.frontImage}
                            alt={`${card.playerName} card`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="text-xs text-muted-foreground text-center">Card</div>';
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{card.playerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {card.year} {card.manufacturer}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{card.sport}</Badge>
                            {card.isRookieCard && (
                              <Badge variant="destructive" className="text-xs">RC</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${card.estimatedValue?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sports Breakdown</CardTitle>
              <CardDescription>
                Detailed view of your collection by sport
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.sportBreakdown && stats.sportBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats.sportBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  No sport data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="value" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection Value Over Time</CardTitle>
              <CardDescription>
                Track how your collection value has grown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={valueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Collection Value']} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Valuable Cards</CardTitle>
              <CardDescription>
                Your highest value cards by estimated worth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCards.map((card, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{card.name}</p>
                        <Badge variant="outline" className="text-xs">{card.sport}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${card.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}