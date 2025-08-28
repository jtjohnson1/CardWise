import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/useToast"
import {
  startScanJob,
  getScanJobStatus,
  getScanProgress,
  pauseResumeJob,
  getRecentScanJobs,
  type ScanJob,
  type ScanProgress
} from "@/api/scanning"
import {
  Scan,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Folder,
  Pause,
  Play,
  AlertTriangle,
  Zap,
  Timer,
  Activity
} from "lucide-react"

export function ScanCards() {
  const [folderPath, setFolderPath] = useState("")
  const [batchSize, setBatchSize] = useState(50)
  const [currentJob, setCurrentJob] = useState<ScanJob | null>(null)
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null)
  const [recentJobs, setRecentJobs] = useState<ScanJob[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        console.log('Loading recent scan jobs...')
        const response = await getRecentScanJobs()
        setRecentJobs(response.jobs)
      } catch (error) {
        console.error('Error loading scan jobs:', error)
      }
    }

    fetchRecentJobs()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (currentJob && (currentJob.status === 'processing' || currentJob.status === 'paused')) {
      interval = setInterval(async () => {
        try {
          const [jobResponse, progressResponse] = await Promise.all([
            getScanJobStatus(currentJob._id),
            getScanProgress(currentJob._id)
          ])

          setCurrentJob(jobResponse.job)
          setScanProgress(progressResponse.progress)

          if (jobResponse.job.status === 'completed' || jobResponse.job.status === 'failed') {
            setIsScanning(false)
            if (interval) clearInterval(interval)

            if (jobResponse.job.status === 'completed') {
              toast({
                title: "Scan Complete",
                description: `Successfully processed ${jobResponse.job.processedCards} of ${jobResponse.job.totalCards} cards`
              })
            } else {
              toast({
                title: "Scan Failed",
                description: jobResponse.job.error || "An error occurred during scanning",
                variant: "destructive"
              })
            }
          }
        } catch (error) {
          console.error('Error checking job status:', error)
        }
      }, 3000) // Update every 3 seconds for large batches
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentJob, toast])

  const handleStartScan = async () => {
    if (!folderPath.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder path",
        variant: "destructive"
      })
      return
    }

    if (batchSize < 10 || batchSize > 200) {
      toast({
        title: "Error",
        description: "Batch size must be between 10 and 200",
        variant: "destructive"
      })
      return
    }

    try {
      console.log('Starting scan job...')
      setIsScanning(true)
      const response = await startScanJob(folderPath, batchSize)
      setCurrentJob(response.job)

      toast({
        title: "Scan Started",
        description: `AI processing has begun for your cards (${response.job.totalCards} cards in ${response.job.totalBatches} batches)`
      })
    } catch (error) {
      console.error('Error starting scan:', error)
      setIsScanning(false)
      toast({
        title: "Error",
        description: "Failed to start scanning process",
        variant: "destructive"
      })
    }
  }

  const handlePauseResume = async (action: 'pause' | 'resume') => {
    if (!currentJob) return

    try {
      await pauseResumeJob(currentJob._id, action)
      setCurrentJob({ ...currentJob, status: action === 'pause' ? 'paused' : 'processing' })

      toast({
        title: action === 'pause' ? "Scan Paused" : "Scan Resumed",
        description: `Scan job has been ${action}d`
      })
    } catch (error) {
      console.error(`Error ${action}ing job:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} scan job`,
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'processing':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-slate-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Scan Cards
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Use AI to automatically identify and catalog your cards - optimized for large batches
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Setup */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-blue-500" />
              Start New Scan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="folder-path">Folder Path</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="folder-path"
                    placeholder="/path/to/card/images"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    disabled={isScanning}
                  />
                  <Button variant="outline" size="sm" disabled={isScanning}>
                    <Folder className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Path to folder containing card images (lot-iteration-front/back.jpg)
                </p>
              </div>

              <div>
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input
                  id="batch-size"
                  type="number"
                  min="10"
                  max="200"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value) || 50)}
                  disabled={isScanning}
                  className="mt-1"
                />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Number of cards to process per batch (10-200). Smaller batches = more frequent updates.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Large Batch Processing
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  Optimized for processing 1000+ cards efficiently:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Batch processing prevents memory issues</li>
                  <li>• Real-time progress tracking every 3 seconds</li>
                  <li>• Pause/resume functionality for long scans</li>
                  <li>• Failed card tracking and retry options</li>
                </ul>
              </div>

              <Button
                onClick={handleStartScan}
                disabled={isScanning || !folderPath.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                {isScanning ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-pulse" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Job Status */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Current Scan Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentJob ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{currentJob.lotNumber}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(currentJob.status)}>
                      {getStatusIcon(currentJob.status)}
                      <span className="ml-1 capitalize">{currentJob.status}</span>
                    </Badge>
                    {(currentJob.status === 'processing' || currentJob.status === 'paused') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePauseResume(currentJob.status === 'paused' ? 'resume' : 'pause')}
                      >
                        {currentJob.status === 'paused' ? (
                          <Play className="w-4 h-4" />
                        ) : (
                          <Pause className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{currentJob.processedCards} of {currentJob.totalCards} cards</span>
                  </div>
                  <Progress
                    value={(currentJob.processedCards / currentJob.totalCards) * 100}
                    className="h-3"
                  />
                </div>

                {/* Batch Progress */}
                {currentJob.currentBatch && currentJob.totalBatches && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Batch Progress</span>
                      <span>Batch {currentJob.currentBatch} of {currentJob.totalBatches}</span>
                    </div>
                    <Progress
                      value={(currentJob.currentBatch / currentJob.totalBatches) * 100}
                      className="h-2"
                    />
                  </div>
                )}

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {currentJob.processingSpeed && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>{currentJob.processingSpeed} cards/min</span>
                    </div>
                  )}
                  {currentJob.estimatedTimeRemaining && (
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-blue-500" />
                      <span>{formatTime(currentJob.estimatedTimeRemaining)} remaining</span>
                    </div>
                  )}
                  {currentJob.failedCards > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>{currentJob.failedCards} failed</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Recent Extractions */}
                {scanProgress?.recentExtractions && scanProgress.recentExtractions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recent Extractions:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {scanProgress.recentExtractions.map((extraction, index) => (
                        <div key={index} className="text-sm bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">
                              Card #{extraction.cardNumber}
                            </span>
                            <Badge
                              variant={extraction.status === 'success' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {extraction.status === 'success' ? 'Success' : 'Review Needed'}
                            </Badge>
                          </div>
                          {extraction.playerName && (
                            <div className="text-slate-600 dark:text-slate-400">
                              <span className="font-medium">{extraction.playerName}</span>
                              {extraction.year && extraction.sport && (
                                <span className="ml-2">{extraction.year} {extraction.sport}</span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-green-600 dark:text-green-400">
                              {Math.round(extraction.confidence * 100)}% confidence
                            </span>
                            {extraction.errorMessage && (
                              <span className="text-xs text-red-600 dark:text-red-400">
                                {extraction.errorMessage}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentJob.status === 'completed' && (
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Review Results ({currentJob.totalCards - currentJob.failedCards} successful)
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No active scan job
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Start a new scan to see progress here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Scan Jobs */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
        <CardHeader>
          <CardTitle>Recent Scan Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {job.lotNumber}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {job.processedCards} of {job.totalCards} cards processed
                        {job.failedCards > 0 && ` • ${job.failedCards} failed`}
                      </p>
                      {job.totalBatches && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {job.totalBatches} batches • {job.processingSpeed || 0} cards/min avg
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    {job.completedAt && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Completed: {new Date(job.completedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Scan className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No scan jobs yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Your scan history will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}