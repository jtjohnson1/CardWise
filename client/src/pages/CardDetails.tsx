import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/useToast"
import { getCard, type Card as CardType } from "@/api/cards"
import { getCardPriceAnalysis, type EbayPriceData } from "@/api/ebay"
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Tag,
  Star,
  TrendingUp,
  Eye,
  RotateCcw,
  ExternalLink,
  RefreshCw
} from "lucide-react"

export function CardDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [card, setCard] = useState<CardType | null>(null)
  const [priceData, setPriceData] = useState<EbayPriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [imageView, setImageView] = useState<'front' | 'back'>('front')
  const { toast } = useToast()

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return

      try {
        console.log('Loading card details for ID:', id)
        const response = await getCard(id)
        setCard(response.card)
      } catch (error) {
        console.error('Error loading card:', error)
        toast({
          title: "Error",
          description: "Failed to load card details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCard()
  }, [id, toast])

  const fetchPriceData = async () => {
    if (!card) return

    try {
      setLoadingPrices(true)
      const response = await getCardPriceAnalysis(
        card.playerName,
        card.year,
        card.setName,
        card.cardNumber
      )
      setPriceData(response.priceData)
    } catch (error) {
      console.error('Error loading price data:', error)
      toast({
        title: "Error",
        description: "Failed to load eBay price data",
        variant: "destructive"
      })
    } finally {
      setLoadingPrices(false)
    }
  }

  useEffect(() => {
    if (card) {
      fetchPriceData()
    }
  }, [card])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Card not found</p>
        <Button onClick={() => navigate('/collection')} className="mt-4">
          Back to Collection
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/collection')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              {card.playerName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {card.year} {card.manufacturer} {card.setName} #{card.cardNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Images */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Card Images</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={imageView === 'front' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageView('front')}
                >
                  Front
                </Button>
                <Button
                  variant={imageView === 'back' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageView('back')}
                >
                  Back
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-[2.5/3.5] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-slate-500 dark:text-slate-400">
                {imageView === 'front' ? 'Front' : 'Back'} Image
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90"
                onClick={() => setImageView(imageView === 'front' ? 'back' : 'front')}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Card Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Sport</label>
                  <p className="text-slate-900 dark:text-slate-100">{card.sport}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Year</label>
                  <p className="text-slate-900 dark:text-slate-100">{card.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Manufacturer</label>
                  <p className="text-slate-900 dark:text-slate-100">{card.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Set</label>
                  <p className="text-slate-900 dark:text-slate-100">{card.setName}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                {card.isRookieCard && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Rookie Card
                  </Badge>
                )}
                {card.isAutograph && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Autograph
                  </Badge>
                )}
                {card.isMemorabilia && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Memorabilia
                  </Badge>
                )}
                {card.isForTrade && (
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    For Trade
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Condition */}
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle>Condition Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Centering</label>
                  <p className="text-slate-900 dark:text-slate-100">{card.condition.centering}/10</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Corners</label>
                  <p className="text-slate-900 dark:text-slate-100">{card.condition.corners}/10</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Edges</label>
                  <p className="text-slate-900 dark:text-slate-100">{card.condition.edges}/10</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Surface</label>
                  <p className="text-slate-900 dark:text-slate-100">{card.condition.surface}/10</p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Grade</label>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {card.condition.overall}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Valuation and eBay Price Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Valuation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Estimated Value</label>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${card.estimatedValue.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Market Value</label>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${card.marketValue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                +{(((card.marketValue - card.estimatedValue) / card.estimatedValue) * 100).toFixed(1)}% vs estimate
              </span>
            </div>
          </CardContent>
        </Card>

        {/* eBay Price Analysis */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-500" />
                eBay Market Data
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPriceData}
                disabled={loadingPrices}
              >
                <RefreshCw className={`w-4 h-4 ${loadingPrices ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingPrices ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : priceData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Price</label>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ${priceData.averagePrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Price Range</label>
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      ${priceData.priceRange.min} - ${priceData.priceRange.max}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2">Recent Sales:</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {priceData.recentSales.map((sale, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{sale.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {sale.condition} • {sale.seller.username}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-sm font-semibold">${sale.price.value}</p>
                          <a
                            href={sale.itemWebUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Click refresh to load eBay price data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes and Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-500" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300">
              {card.notes || 'No notes available'}
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              Added on {new Date(card.dateAdded).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}