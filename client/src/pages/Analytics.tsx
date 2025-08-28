import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/useToast"
import { getCollectionStats, type CollectionStats } from "@/api/cards"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { TrendingUp, DollarSign, Package, Star, Calendar } from "lucide-react"

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function Analytics() {
  const [stats, setStats] = useState<CollectionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Loading analytics data...')
        const response = await getCollectionStats()
        setStats(response.stats)
      } catch (error) {
        console.error('Error loading analytics:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  const mockValueTrend = [
    { month: 'Jan', value: 8500 },
    { month: 'Feb', value: 9200 },
    { month: 'Mar', value: 10100 },
    { month: 'Apr', value: 11300 },
    { month: 'May', value: 11800 },
    { month: 'Jun', value: 12450 }
  ]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Insights into your card collection performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              ${stats?.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% this year
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Average Value
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              ${Math.round((stats?.totalValue || 0) / (stats?.totalCards || 1)).toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              per card
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Most Valuable
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              $15,000
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              LeBron James RC
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Growth Rate
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              +46%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              last 12 months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sports Distribution */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle>Collection by Sport</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.topSports}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ sport, count }) => `${sport}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats?.topSports.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Value Distribution */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle>Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.valueDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Value Trend */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
        <CardHeader>
          <CardTitle>Collection Value Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockValueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}