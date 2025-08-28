import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Grid, List, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { getCards, deleteCard, type Card as CardType } from '@/api/cards';
import { Link } from 'react-router-dom';

export function Collection() {
  const { toast } = useToast();
  const [cards, setCards] = useState<CardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load cards on component mount
  useEffect(() => {
    const loadCards = async () => {
      try {
        console.log('Loading cards from API...');
        const response = await getCards();
        console.log('Cards loaded successfully:', response.cards.length);
        setCards(response.cards);
        setFilteredCards(response.cards);
      } catch (error: any) {
        console.error('Error loading cards:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load cards.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [toast]);

  // Filter cards based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(card =>
        card.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.setName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.year.toString().includes(searchTerm)
      );
      setFilteredCards(filtered);
    }
    // Reset selections when search changes
    setSelectedCards(new Set());
    setSelectAll(false);
  }, [searchTerm, cards]);

  // Handle individual card selection
  const handleCardSelect = (cardId: string, checked: boolean) => {
    console.log(`Card ${cardId} selection changed to:`, checked);
    const newSelected = new Set(selectedCards);
    if (checked) {
      newSelected.add(cardId);
    } else {
      newSelected.delete(cardId);
    }
    setSelectedCards(newSelected);

    // Update select all state
    setSelectAll(newSelected.size === filteredCards.length && filteredCards.length > 0);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    console.log('Select all changed to:', checked);
    setSelectAll(checked);
    if (checked) {
      const allCardIds = new Set(filteredCards.map(card => card._id));
      setSelectedCards(allCardIds);
    } else {
      setSelectedCards(new Set());
    }
  };

  // Handle delete selected cards
  const handleDeleteSelected = async () => {
    if (selectedCards.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select cards to delete.",
        variant: "destructive"
      });
      return;
    }

    setDeleting(true);
    try {
      console.log(`Deleting ${selectedCards.size} selected cards...`);

      // Delete each selected card
      const deletePromises = Array.from(selectedCards).map(cardId => {
        console.log(`Deleting card with ID: ${cardId}`);
        return deleteCard(cardId);
      });

      await Promise.all(deletePromises);

      // Remove deleted cards from state
      const remainingCards = cards.filter(card => !selectedCards.has(card._id));
      setCards(remainingCards);
      setFilteredCards(remainingCards.filter(card =>
        !searchTerm.trim() ||
        card.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.setName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.year.toString().includes(searchTerm)
      ));

      // Clear selections
      setSelectedCards(new Set());
      setSelectAll(false);

      console.log(`Successfully deleted ${selectedCards.size} cards`);
      toast({
        title: "Success",
        description: `Successfully deleted ${selectedCards.size} card(s).`
      });
    } catch (error: any) {
      console.error('Error deleting cards:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete selected cards.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading collection...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Collection</h1>
          <p className="text-muted-foreground">
            {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''} in your collection
            {selectedCards.size > 0 && ` (${selectedCards.size} selected)`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedCards.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedCards.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Cards</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedCards.size} selected card{selectedCards.size !== 1 ? 's' : ''}?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSelected} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Link to="/scan">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Cards
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selection Controls */}
      {filteredCards.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All ({filteredCards.length} cards)
            </label>
          </div>
          {selectedCards.size > 0 && (
            <Badge variant="secondary">
              {selectedCards.size} selected
            </Badge>
          )}
        </div>
      )}

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? 'No cards match your search.' : 'No cards in your collection yet.'}
              </p>
              {!searchTerm && (
                <Link to="/scan">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Card
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCards.map((card) => (
                <Card key={card._id} className="relative group">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedCards.has(card._id)}
                      onCheckedChange={(checked) => handleCardSelect(card._id, checked as boolean)}
                      className="bg-background border-2"
                    />
                  </div>
                  <Link to={`/card/${card._id}`}>
                    <CardHeader className="pb-2">
                      <div className="aspect-[2.5/3.5] bg-muted rounded-md mb-2 overflow-hidden">
                        <img
                          src={card.frontImage}
                          alt={`${card.playerName} card front`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/api/placeholder/250/350';
                          }}
                        />
                      </div>
                      <CardTitle className="text-lg">{card.playerName}</CardTitle>
                      <CardDescription>
                        {card.year} {card.manufacturer} {card.setName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{card.sport}</Badge>
                        <span className="font-semibold">
                          ${card.estimatedValue?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          #{card.cardNumber}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {card.condition.overall}
                        </Badge>
                        {card.isRookieCard && (
                          <Badge variant="destructive" className="text-xs">
                            RC
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? 'No cards match your search.' : 'No cards in your collection yet.'}
              </p>
              {!searchTerm && (
                <Link to="/scan">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Card
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCards.map((card) => (
                <Card key={card._id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedCards.has(card._id)}
                      onCheckedChange={(checked) => handleCardSelect(card._id, checked as boolean)}
                    />
                    <div className="w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={card.frontImage}
                        alt={`${card.playerName} card`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/api/placeholder/64/80';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Link to={`/card/${card._id}`} className="hover:underline">
                        <h3 className="font-semibold text-lg">{card.playerName}</h3>
                      </Link>
                      <p className="text-muted-foreground">
                        {card.year} {card.manufacturer} {card.setName} #{card.cardNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{card.sport}</Badge>
                        <Badge variant="secondary" className="text-xs">{card.condition.overall}</Badge>
                        {card.isRookieCard && (
                          <Badge variant="destructive" className="text-xs">RC</Badge>
                        )}
                        {card.isAutograph && (
                          <Badge variant="default" className="text-xs">AUTO</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        ${card.estimatedValue?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Est. Value
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}