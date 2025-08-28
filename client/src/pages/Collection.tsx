import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/useToast"
import { getCards, type Card as CardType } from "@/api/cards"
import { Search, Filter, Grid, List, Plus, Eye, DollarSign, Calendar } from "lucide-react"

export function Collection() {
  const [cards, setCards] = useState<CardType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sportFilter, setSportFilter] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { toast } = useToast()

  useEffect(() => {
    const fetchCards = async () => {
      try {
        console.log('Loading collection...')
        const response = await getCards({ search: searchTerm, sport: sportFilter })
        setCards(response.cards)
      } catch (error) {
        console.error('Error loading collection:', error)
        toast({
          title: "Error",
          description: "Failed to load collection",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [searchTerm, sportFilter, toast])

  const sports = ['Baseball', 'Basketball', 'Football', 'Hockey']

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
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
            Collection
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {cards.length} cards in your collection
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by player, set, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-700/50"
              />
            </div>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/50 dark:bg-slate-700/50">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map((sport) => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Card key={card._id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="aspect-[2.5/3.5] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-slate-500 dark:text-slate-400">Card Image</div>
                  <Link 
                    to={`/card/${card._id}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Button size="sm" className="bg-white/90 text-slate-900 hover:bg-white">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {card.playerName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {card.year} {card.manufacturer}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {card.setName} #{card.cardNumber}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {card.isRookieCard && (
                        <Badge variant="secondary" className="text-xs">RC</Badge>
                      )}
                      {card.isAutograph && (
                        <Badge variant="secondary" className="text-xs">Auto</Badge>
                      )}
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${card.estimatedValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{card.condition.overall}</span>
                    <span>{new Date(card.dateAdded).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {cards.map((card) => (
                <div key={card._id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-slate-500">Card</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {card.playerName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {card.year} {card.manufacturer} {card.setName} #{card.cardNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{card.sport}</Badge>
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
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {card.condition.overall}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(card.dateAdded).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/card/${card._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}