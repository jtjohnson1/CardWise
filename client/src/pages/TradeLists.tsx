import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftRight, Share, Download, Plus, Eye } from "lucide-react"

export function TradeLists() {
  const [activeTab, setActiveTab] = useState("available")

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Trade Lists
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your trading cards and lists
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Trade List
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available for Trade</TabsTrigger>
          <TabsTrigger value="lists">Trade Lists</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle>Cards Available for Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ArrowLeftRight className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No cards marked for trade yet
                </p>
                <Button variant="outline" className="mt-4">
                  Mark Cards for Trade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lists" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle>Your Trade Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Share className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No trade lists created yet
                </p>
                <Button variant="outline" className="mt-4">
                  Create Your First List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No completed trades yet
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}