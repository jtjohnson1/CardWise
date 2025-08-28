import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/useToast"
import { Settings as SettingsIcon, Database, Bell, Eye, Download, Upload } from "lucide-react"

export function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    console.log('Saving settings...')
    toast({
      title: "Success",
      description: "Settings saved successfully"
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Configure your CardCat preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Receive notifications for important updates
                    </p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Price Alerts</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Get notified when card prices change significantly
                    </p>
                  </div>
                  <Switch checked={priceAlerts} onCheckedChange={setPriceAlerts} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Automatically backup your collection daily
                    </p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ebay-key">eBay API Key</Label>
                  <Input id="ebay-key" type="password" placeholder="Enter your eBay API key" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Used for real-time pricing data
                  </p>
                </div>

                <div>
                  <Label htmlFor="tcgplayer-key">TCGPlayer API Key</Label>
                  <Input id="tcgplayer-key" type="password" placeholder="Enter your TCGPlayer API key" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Secondary pricing source
                  </p>
                </div>

                <div>
                  <Label htmlFor="scryfall-key">Scryfall API Key</Label>
                  <Input id="scryfall-key" type="password" placeholder="Enter your Scryfall API key" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    For Magic: The Gathering cards
                  </p>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save API Keys
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanning" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle>Scanning Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scan-folder">Default Scan Folder</Label>
                  <Input id="scan-folder" placeholder="/path/to/scan/folder" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Default folder to monitor for new card images
                  </p>
                </div>

                <div>
                  <Label htmlFor="confidence">AI Confidence Threshold</Label>
                  <Input id="confidence" type="number" min="0" max="1" step="0.1" defaultValue="0.8" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Minimum confidence level for auto-accepting AI results
                  </p>
                </div>

                <div>
                  <Label htmlFor="image-quality">Image Processing Quality</Label>
                  <select className="w-full p-2 border rounded-md bg-white dark:bg-slate-700">
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality (Faster)</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Scanning Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Download className="w-6 h-6" />
                  <span>Export Collection</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6" />
                  <span>Import Collection</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Database className="w-6 h-6" />
                  <span>Backup Database</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col items-center gap-2 text-red-600 hover:text-red-700">
                  <Database className="w-6 h-6" />
                  <span>Reset Database</span>
                </Button>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Warning:</strong> Resetting the database will permanently delete all your collection data. 
                  Make sure to create a backup first.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}