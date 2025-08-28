import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Play, Pause, Square, FolderOpen, Settings, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { startScanJob, getScanJobs, pauseResumeJob, getScanProgress, type ScanJob, type ScanProgress } from '@/api/scanning';

export function ScanCards() {
  const { toast } = useToast();
  const [scanJobs, setScanJobs] = useState<ScanJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [folderPath, setFolderPath] = useState('/opt/scanimg');
  const [jobName, setJobName] = useState('');
  const [scanProgress, setScanProgress] = useState<{ [key: string]: ScanProgress }>({});

  // Load scan jobs on component mount
  useEffect(() => {
    const loadScanJobs = async () => {
      try {
        console.log('[SCAN] Loading scan jobs...');
        const response = await getScanJobs();
        console.log('[SCAN] Scan jobs response:', response);
        
        if (response.success && Array.isArray(response.jobs)) {
          setScanJobs(response.jobs);
          console.log(`[SCAN] Loaded ${response.jobs.length} scan jobs`);
        } else {
          console.warn('[SCAN] Invalid scan jobs response:', response);
        }
      } catch (error: any) {
        console.error('[SCAN] Error loading scan jobs:', error);
        toast({
          title: "Warning",
          description: "Failed to load scan jobs.",
          variant: "destructive"
        });
      } finally {
        setJobsLoading(false);
      }
    };

    loadScanJobs();
  }, [toast]);

  // Handle starting a new scan job
  const handleStartScan = async () => {
    if (!jobName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a job name.",
        variant: "destructive"
      });
      return;
    }

    if (!folderPath.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter a folder path.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('[SCAN] Starting scan job with data:', {
        jobName: jobName.trim(),
        folderPath: folderPath.trim(),
        settings: {
          confidenceThreshold: 0.8,
          autoProcess: true,
          imageQuality: 'high'
        }
      });

      const jobData = {
        jobName: jobName.trim(),
        folderPath: folderPath.trim(),
        settings: {
          confidenceThreshold: 0.8,
          autoProcess: true,
          imageQuality: 'high'
        }
      };

      console.log('[SCAN] About to call startScanJob with:', JSON.stringify(jobData));
      const response = await startScanJob(jobData);
      console.log('[SCAN] Scan job response:', response);

      if (response.success) {
        toast({
          title: "Success",
          description: `Scan job "${jobName}" started successfully.`
        });

        // Add the new job to the list
        if (response.job) {
          setScanJobs(prev => [response.job, ...prev]);
        }

        // Clear form
        setJobName('');
        setFolderPath('/opt/scanimg');
      } else {
        throw new Error(response.message || 'Failed to start scan job');
      }
    } catch (error: any) {
      console.error('[SCAN] Error starting scan job:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start scan job.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle pause/resume job
  const handlePauseResumeJob = async (jobId: string, currentStatus: string) => {
    try {
      console.log(`[SCAN] ${currentStatus === 'processing' ? 'Pausing' : 'Resuming'} job ${jobId}`);
      const response = await pauseResumeJob(jobId, currentStatus);
      console.log('[SCAN] Pause/resume response:', response);

      if (response.success) {
        // Update the job status in the list
        setScanJobs(prev => prev.map(job => 
          job._id === jobId 
            ? { ...job, status: currentStatus === 'processing' ? 'paused' : 'processing' }
            : job
        ));

        toast({
          title: "Success",
          description: response.message
        });
      }
    } catch (error: any) {
      console.error('[SCAN] Error pausing/resuming job:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update scan job.",
        variant: "destructive"
      });
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      case 'paused': return 'outline';
      default: return 'outline';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scan Cards</h1>
        <p className="text-muted-foreground">
          Use AI-powered scanning to automatically identify and catalog your cards.
        </p>
      </div>

      <Tabs defaultValue="new-scan" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-scan">New Scan</TabsTrigger>
          <TabsTrigger value="scan-history">Scan History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-scan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Start New Scan Job
              </CardTitle>
              <CardDescription>
                Configure and start a new card scanning operation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-name">Job Name *</Label>
                  <Input
                    id="job-name"
                    placeholder="e.g., Baseball Cards Lot 1"
                    value={jobName}
                    onChange={(e) => {
                      console.log('[SCAN] Job name changed to:', e.target.value);
                      setJobName(e.target.value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="folder-path">Folder Path *</Label>
                  <Input
                    id="folder-path"
                    placeholder="/path/to/card/images"
                    value={folderPath}
                    onChange={(e) => {
                      console.log('[SCAN] Folder path changed to:', e.target.value);
                      setFolderPath(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Scan Settings</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence: 80% • Auto-process: On • Quality: High
                </div>
              </div>

              <Button 
                onClick={handleStartScan} 
                disabled={loading}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {loading ? 'Starting Scan...' : 'Start Scan Job'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Job History</CardTitle>
              <CardDescription>
                View and manage your previous and current scan jobs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading scan jobs...</div>
                </div>
              ) : scanJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No scan jobs found.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start your first scan job to see it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scanJobs.map((job) => (
                    <div key={job._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{job.jobName}</h3>
                          <Badge variant={getStatusVariant(job.status)} className="flex items-center gap-1">
                            {getStatusIcon(job.status)}
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {job.totalCards} cards • Started {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{job.processedCards} / {job.totalCards}</span>
                            </div>
                            <Progress 
                              value={job.totalCards > 0 ? (job.processedCards / job.totalCards) * 100 : 0}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {(job.status === 'processing' || job.status === 'paused') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePauseResumeJob(job._id, job.status)}
                          >
                            {job.status === 'processing' ? (
                              <>
                                <Pause className="h-4 w-4 mr-1" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Resume
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}