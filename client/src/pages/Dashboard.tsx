import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Package, Clock, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { getCollectionStats, type CollectionStats } from '@/api/cards';
import { getScanJobs, type ScanJob } from '@/api/scanning';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [scanJobs, setScanJobs] = useState<ScanJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading dashboard data...');

        // Load collection statistics
        try {
          const statsResponse = await getCollectionStats();
          console.log('Stats loaded:', statsResponse);
          if (statsResponse.success && statsResponse.stats) {
            setStats(statsResponse.stats);
          }
        } catch (error) {
          console.error('Failed to load stats:', error);
          toast({
            title: "Warning",
            description: "Failed to load collection statistics.",
            variant: "destructive"
          });
        }

        // Load scan jobs
        try {
          const jobsResponse = await getScanJobs();
          console.log('Scan jobs loaded:', jobsResponse);
          if (jobsResponse.success && Array.isArray(jobsResponse.jobs)) {
            setScanJobs(jobsResponse.jobs);
          }
        } catch (error) {
          console.error('Failed to load scan jobs:', error);
          toast({
            title: "Warning",
            description: "Failed to load scan jobs.",
            variant: "destructive"
          });
        }

      } catch (error: any) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your CardWise collection overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/scan">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Scan Cards
            </Button>
          </Link>
          <Link to="/collection">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Collection
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              Cards in your collection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalValue?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Additions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.recentCards?.length || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Cards added recently
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
              Per card average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sport Breakdown Chart */}
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

        {/* Recent Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Additions</CardTitle>
            <CardDescription>
              Your most recently added cards
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
                      <Link to={`/card/${card._id}`} className="hover:underline">
                        <p className="font-medium">{card.playerName}</p>
                      </Link>
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
                  No recent cards found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Jobs Status */}
      {scanJobs && scanJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Scan Jobs</CardTitle>
            <CardDescription>
              Status of your card scanning operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scanJobs.slice(0, 3).map((job) => (
                <div key={job._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{job.jobName}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.totalCards} cards • Started {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {job.processedCards} / {job.totalCards}
                      </p>
                      <Progress
                        value={job.totalCards > 0 ? (job.processedCards / job.totalCards) * 100 : 0}
                        className="w-20"
                      />
                    </div>
                    <Badge
                      variant={
                        job.status === 'completed' ? 'default' :
                        job.status === 'processing' ? 'secondary' :
                        job.status === 'failed' ? 'destructive' : 'outline'
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/scan">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                <span>Scan New Cards</span>
              </Button>
            </Link>
            <Link to="/collection">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Package className="h-6 w-6 mb-2" />
                <span>Browse Collection</span>
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="w-full h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}