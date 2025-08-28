import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/useToast"
import { getCollectionStats, getCards, type CollectionStats, type Card as CardType } from "@/api/cards"
import { getRecentScanJobs, type ScanJob } from "@/api/scanning"
import {
  TrendingUp,
  Plus,
  Scan,
  Eye,
  DollarSign,
  Package,
  Clock,
  Star,
  Activity
} from "lucide-react"

export function Dashboard() {
  const [stats, setStats] = useState<CollectionStats | null>(null)
  const [recentCards, setRecentCards] = useState<CardType[]>([])
  const [scanJobs, setScanJobs] = useState<ScanJob[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Loading dashboard data...')
        const [statsResponse, cardsResponse, jobsResponse] = await Promise.all([
          getCollectionStats(),
          getCards({ limit: 6 }),
          getRecentScanJobs()
        ])

        setStats(statsResponse.stats)
        setRecentCards(cardsResponse.cards)
        setScanJobs(jobsResponse.jobs)
      } catch (error) {
        console.error('Error loading dashboard:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
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
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back! Here's your collection overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/scan">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
              <Scan className="w-4 h-4 mr-2" />
              Scan Cards
            </Button>
          </Link>
          <Link to="/collection">
            <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Cards
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats?.totalCards.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{stats?.recentAdditions} this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Collection Value
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

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Top Sport
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats?.topSports[0]?.sport}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {stats?.topSports[0]?.count} cards
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Recent Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {scanJobs.filter(job => job.status === 'processing').length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Active scans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cards and Scan Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cards */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Cards</CardTitle>
            <Link to="/collection">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCards.map((card) => (
                <div key={card._id} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors">
                  <div className="w-12 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {card.playerName}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {card.year} {card.manufacturer} {card.setName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {card.isRookieCard && (
                        <Badge variant="secondary" className="text-xs">Rookie</Badge>
                      )}
                      {card.isAutograph && (
                        <Badge variant="secondary" className="text-xs">Auto</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      ${card.estimatedValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {card.condition.overall}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scan Jobs */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Scans</CardTitle>
            <Link to="/scan">
              <Button variant="ghost" size="sm">
                <Scan className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scanJobs.map((job) => (
                <div key={job._id} className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {job.lotNumber}
                      </span>
                    </div>
                    <Badge 
                      variant={job.status === 'completed' ? 'default' : job.status === 'processing' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{job.processedCards} of {job.totalCards} cards</span>
                      <span>{Math.round((job.processedCards / job.totalCards) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(job.processedCards / job.totalCards) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}