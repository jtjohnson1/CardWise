import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Save, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { 
  saveEbayConfig, 
  getEbayConfig, 
  saveTcgPlayerConfig, 
  getTcgPlayerConfig,
  saveNotificationPreferences,
  getNotificationPreferences,
  saveScanningPreferences,
  getScanningPreferences,
  type EbayConfig,
  type TcgPlayerConfig,
  type NotificationPreferences,
  type ScanningPreferences
} from '@/api/settings';

export function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSecrets, setShowSecrets] = useState({
    ebayClientSecret: false,
    ebayUserToken: false,
    tcgPlayerApiKey: false
  });

  // eBay API Configuration
  const [ebayConfig, setEbayConfig] = useState<EbayConfig>({
    appId: '',
    devId: '',
    certId: '',
    userToken: '',
    environment: 'sandbox'
  });

  // TCGPlayer API Configuration
  const [tcgPlayerConfig, setTcgPlayerConfig] = useState<TcgPlayerConfig>({
    apiKey: '',
    partnerId: '',
    environment: 'sandbox'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true,
    push: true,
    priceAlerts: true,
    tradeRequests: true,
    marketUpdates: false
  });

  // Scanning Preferences
  const [scanningPrefs, setScanningPrefs] = useState<ScanningPreferences>({
    autoProcess: true,
    confidenceThreshold: 0.8,
    imageQuality: 'high',
    batchSize: 10
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Loading initial settings data...');
        
        // Load eBay config
        try {
          const ebayData = await getEbayConfig();
          console.log('Loaded eBay config:', { ...ebayData, certId: '[REDACTED]', userToken: '[REDACTED]' });
          setEbayConfig(ebayData);
        } catch (error) {
          console.error('Failed to load eBay config:', error);
        }

        // Load TCGPlayer config
        try {
          const tcgData = await getTcgPlayerConfig();
          console.log('Loaded TCGPlayer config:', { ...tcgData, apiKey: '[REDACTED]' });
          setTcgPlayerConfig(tcgData);
        } catch (error) {
          console.error('Failed to load TCGPlayer config:', error);
        }

        // Load notification preferences
        try {
          const notificationData = await getNotificationPreferences();
          console.log('Loaded notification preferences:', notificationData);
          setNotifications(notificationData);
        } catch (error) {
          console.error('Failed to load notification preferences:', error);
        }

        // Load scanning preferences
        try {
          const scanningData = await getScanningPreferences();
          console.log('Loaded scanning preferences:', scanningData);
          setScanningPrefs(scanningData);
        } catch (error) {
          console.error('Failed to load scanning preferences:', error);
        }

      } catch (error) {
        console.error('Error loading initial settings data:', error);
        toast({
          title: "Error",
          description: "Failed to load settings data.",
          variant: "destructive"
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [toast]);

  const toggleSecretVisibility = (field: keyof typeof showSecrets) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleEbayConfigSave = async () => {
    setLoading(true);
    try {
      console.log('Attempting to save eBay config:', { 
        ...ebayConfig, 
        certId: ebayConfig.certId ? '[REDACTED]' : 'EMPTY', 
        userToken: ebayConfig.userToken ? '[REDACTED]' : 'EMPTY' 
      });

      // Validate required fields
      if (!ebayConfig.appId || !ebayConfig.devId || !ebayConfig.certId) {
        console.error('Validation failed - missing required fields:', {
          appId: !!ebayConfig.appId,
          devId: !!ebayConfig.devId,
          certId: !!ebayConfig.certId
        });
        toast({
          title: "Validation Error",
          description: "App ID, Dev ID, and Cert ID are required for eBay configuration.",
          variant: "destructive"
        });
        return;
      }

      console.log('Validation passed, calling saveEbayConfig...');
      const result = await saveEbayConfig(ebayConfig);
      console.log('eBay config save result:', result);

      toast({
        title: "Success",
        description: "eBay API configuration saved successfully."
      });
    } catch (error: any) {
      console.error('Error saving eBay config:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save eBay configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTcgPlayerConfigSave = async () => {
    setLoading(true);
    try {
      console.log('Attempting to save TCGPlayer config:', { 
        ...tcgPlayerConfig, 
        apiKey: tcgPlayerConfig.apiKey ? '[REDACTED]' : 'EMPTY' 
      });

      const result = await saveTcgPlayerConfig(tcgPlayerConfig);
      console.log('TCGPlayer config save result:', result);

      toast({
        title: "Success",
        description: "TCGPlayer API configuration saved successfully."
      });
    } catch (error: any) {
      console.error('Error saving TCGPlayer config:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save TCGPlayer configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSave = async () => {
    setLoading(true);
    try {
      console.log('Attempting to save notification preferences:', notifications);

      const result = await saveNotificationPreferences(notifications);
      console.log('Notification preferences save result:', result);

      toast({
        title: "Success",
        description: "Notification preferences saved successfully."
      });
    } catch (error: any) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save notification preferences.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanningPrefsSave = async () => {
    setLoading(true);
    try {
      console.log('Attempting to save scanning preferences:', scanningPrefs);

      const result = await saveScanningPreferences(scanningPrefs);
      console.log('Scanning preferences save result:', result);

      toast({
        title: "Success",
        description: "Scanning preferences saved successfully."
      });
    } catch (error: any) {
      console.error('Error saving scanning preferences:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save scanning preferences.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const rotateCertId = () => {
    console.log('Rotate Cert ID button clicked');
    toast({
      title: "Certificate Rotation",
      description: "This feature will rotate your eBay Cert ID. Please implement eBay API integration.",
      variant: "default"
    });
  };

  const handleEbayConfigChange = (field: keyof EbayConfig, value: string) => {
    console.log(`Updating eBay config field ${field}:`, field === 'certId' || field === 'userToken' ? '[REDACTED]' : value);
    setEbayConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTcgPlayerConfigChange = (field: keyof TcgPlayerConfig, value: string) => {
    console.log(`Updating TCGPlayer config field ${field}:`, field === 'apiKey' ? '[REDACTED]' : value);
    setTcgPlayerConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your CardWise application preferences and API integrations.
        </p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          {/* eBay API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                eBay Marketplace API
                <Badge variant="outline">Primary</Badge>
              </CardTitle>
              <CardDescription>
                Configure your eBay API credentials for real-time pricing data and market comparisons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ebay-app-id">App ID (Client ID) *</Label>
                  <Input
                    id="ebay-app-id"
                    placeholder="e.g., JohnJohn-CardScan-PRD-081384bec-971c4e13"
                    value={ebayConfig.appId}
                    onChange={(e) => handleEbayConfigChange('appId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ebay-dev-id">Dev ID *</Label>
                  <Input
                    id="ebay-dev-id"
                    placeholder="e.g., ff5fc952-6f54-4126-8c27-867835de4eb3"
                    value={ebayConfig.devId}
                    onChange={(e) => handleEbayConfigChange('devId', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ebay-cert-id">Cert ID (Client Secret) *</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rotateCertId}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Rotate Cert ID
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="ebay-cert-id"
                    type={showSecrets.ebayClientSecret ? "text" : "password"}
                    placeholder="e.g., PRD-81384bec8355-9d2c-4314-8451-a725"
                    value={ebayConfig.certId}
                    onChange={(e) => handleEbayConfigChange('certId', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecretVisibility('ebayClientSecret')}
                  >
                    {showSecrets.ebayClientSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ebay-user-token">User Token</Label>
                <div className="relative">
                  <Input
                    id="ebay-user-token"
                    type={showSecrets.ebayUserToken ? "text" : "password"}
                    placeholder="v^1.1#i^1#p^3#r^1#I^3#f^0#t^Ul4xMF81Ok..."
                    value={ebayConfig.userToken}
                    onChange={(e) => handleEbayConfigChange('userToken', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecretVisibility('ebayUserToken')}
                  >
                    {showSecrets.ebayUserToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional: Required for advanced features like selling history and user-specific data.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ebay-environment">Environment</Label>
                <select
                  id="ebay-environment"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={ebayConfig.environment}
                  onChange={(e) => handleEbayConfigChange('environment', e.target.value)}
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your eBay API credentials are encrypted and stored securely. Never share these credentials.
                </p>
              </div>

              <Button onClick={handleEbayConfigSave} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save eBay Configuration'}
              </Button>
            </CardContent>
          </Card>

          {/* TCGPlayer API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                TCGPlayer API
                <Badge variant="secondary">Secondary</Badge>
              </CardTitle>
              <CardDescription>
                Configure TCGPlayer API for trading card market data and pricing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tcg-api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="tcg-api-key"
                      type={showSecrets.tcgPlayerApiKey ? "text" : "password"}
                      placeholder="Enter your TCGPlayer API key"
                      value={tcgPlayerConfig.apiKey}
                      onChange={(e) => handleTcgPlayerConfigChange('apiKey', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleSecretVisibility('tcgPlayerApiKey')}
                    >
                      {showSecrets.tcgPlayerApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tcg-partner-id">Partner ID</Label>
                  <Input
                    id="tcg-partner-id"
                    placeholder="Enter your Partner ID"
                    value={tcgPlayerConfig.partnerId}
                    onChange={(e) => handleTcgPlayerConfigChange('partnerId', e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleTcgPlayerConfigSave} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save TCGPlayer Configuration'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when card prices change significantly
                    </p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, priceAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Trade Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for incoming trade requests
                    </p>
                  </div>
                  <Switch
                    checked={notifications.tradeRequests}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, tradeRequests: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Market Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly market trend reports and insights
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, marketUpdates: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleNotificationsSave} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Notification Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scanning Preferences</CardTitle>
              <CardDescription>
                Configure card scanning and AI processing settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Process Scans</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process scanned cards without manual review
                    </p>
                  </div>
                  <Switch
                    checked={scanningPrefs.autoProcess}
                    onCheckedChange={(checked) =>
                      setScanningPrefs(prev => ({ ...prev, autoProcess: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">AI Confidence Threshold</Label>
                  <Input
                    id="confidence-threshold"
                    type="number"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={scanningPrefs.confidenceThreshold}
                    onChange={(e) => setScanningPrefs(prev => ({
                      ...prev,
                      confidenceThreshold: parseFloat(e.target.value)
                    }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level (0.1-1.0) for auto-accepting AI card identification
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-quality">Image Processing Quality</Label>
                  <select
                    id="image-quality"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={scanningPrefs.imageQuality}
                    onChange={(e) => setScanningPrefs(prev => ({ ...prev, imageQuality: e.target.value as 'low' | 'medium' | 'high' }))}
                  >
                    <option value="low">Low (Faster processing)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="high">High (Better accuracy)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch-size">Batch Processing Size</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    min="1"
                    max="50"
                    value={scanningPrefs.batchSize}
                    onChange={(e) => setScanningPrefs(prev => ({
                      ...prev,
                      batchSize: parseInt(e.target.value)
                    }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of cards to process simultaneously (1-50)
                  </p>
                </div>
              </div>

              <Button onClick={handleScanningPrefsSave} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Scanning Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Backup, export, and manage your collection data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <div className="font-semibold">Export Collection</div>
                  <div className="text-xs text-muted-foreground">Download as CSV/JSON</div>
                </Button>

                <Button variant="outline" className="h-20 flex-col">
                  <div className="font-semibold">Import Collection</div>
                  <div className="text-xs text-muted-foreground">Upload from file</div>
                </Button>

                <Button variant="outline" className="h-20 flex-col">
                  <div className="font-semibold">Backup Database</div>
                  <div className="text-xs text-muted-foreground">Create full backup</div>
                </Button>

                <Button variant="outline" className="h-20 flex-col">
                  <div className="font-semibold">Database Maintenance</div>
                  <div className="text-xs text-muted-foreground">Optimize & clean</div>
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-destructive">Danger Zone</h4>
                <Button variant="destructive" className="w-full">
                  Clear All Collection Data
                </Button>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone. Please backup your data first.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}