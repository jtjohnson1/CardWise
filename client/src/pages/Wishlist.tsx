import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/useToast"
import { getWishlistItems, addWishlistItem, removeWishlistItem, type WishlistItem } from "@/api/wishlist"
import { useForm } from "react-hook-form"
import {
  Plus,
  Heart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Trash2,
  Bell,
  Search
} from "lucide-react"

export function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, reset, watch } = useForm()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        console.log('Loading wishlist...')
        const response = await getWishlistItems()
        setItems(response.items)
      } catch (error) {
        console.error('Error loading wishlist:', error)
        toast({
          title: "Error",
          description: "Failed to load wishlist",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [toast])

  const onAddItem = async (data: any) => {
    try {
      console.log('Adding wishlist item:', data)
      const response = await addWishlistItem(data)
      setItems([...items, response.item])
      setIsAddDialogOpen(false)
      reset()
      toast({
        title: "Success",
        description: "Item added to wishlist"
      })
    } catch (error) {
      console.error('Error adding item:', error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive"
      })
    }
  }

  const onRemoveItem = async (id: string) => {
    try {
      console.log('Removing wishlist item:', id)
      await removeWishlistItem(id)
      setItems(items.filter(item => item._id !== id))
      toast({
        title: "Success",
        description: "Item removed from wishlist"
      })
    } catch (error) {
      console.error('Error removing item:', error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      })
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sport.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = !priorityFilter || item.priority === priorityFilter
    return matchesSearch && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
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
            Wishlist
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {items.length} items on your wishlist
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-slate-800">
            <DialogHeader>
              <DialogTitle>Add to Wishlist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAddItem)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="playerName">Player Name</Label>
                  <Input {...register('playerName', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="sport">Sport</Label>
                  <Select onValueChange={(value) => register('sport').onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Hockey">Hockey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input type="number" {...register('year')} />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input {...register('manufacturer')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="setName">Set Name</Label>
                  <Input {...register('setName')} />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select onValueChange={(value) => register('priority').onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price ($)</Label>
                <Input type="number" {...register('maxPrice')} />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea {...register('notes')} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch {...register('priceAlerts')} />
                <Label htmlFor="priceAlerts">Enable price alerts</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add to Wishlist</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-700/50"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/50 dark:bg-slate-700/50">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item._id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    {item.playerName}
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {item.year && `${item.year} `}{item.manufacturer} {item.setName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getPriorityColor(item.priority)}>
                  {item.priority} priority
                </Badge>
                <Badge variant="outline">{item.sport}</Badge>
              </div>

              {item.maxPrice && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Max Price:</span>
                  <span className="font-semibold">${item.maxPrice.toLocaleString()}</span>
                </div>
              )}

              {item.currentMarketPrice && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Market Price:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${item.currentMarketPrice.toLocaleString()}</span>
                    {item.maxPrice && item.currentMarketPrice <= item.maxPrice ? (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              )}

              {item.priceAlerts && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Bell className="w-4 h-4" />
                  Price alerts enabled
                </div>
              )}

              {item.notes && (
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-700/50 p-2 rounded">
                  {item.notes}
                </p>
              )}

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Added {new Date(item.dateAdded).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            {searchTerm || priorityFilter ? 'No items match your filters' : 'Your wishlist is empty'}
          </p>
        </div>
      )}
    </div>
  )
}