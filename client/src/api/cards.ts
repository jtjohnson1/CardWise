import api from './api';

export interface Card {
  _id: string;
  playerName: string;
  sport: string;
  year: number;
  manufacturer: string;
  setName: string;
  cardNumber: string;
  frontImage: string;
  backImage: string;
  condition: {
    centering: number;
    corners: number;
    edges: number;
    surface: number;
    overall: string;
  };
  isRookieCard: boolean;
  isAutograph: boolean;
  isMemorabilia: boolean;
  estimatedValue: number;
  marketValue: number;
  tags: string[];
  notes: string;
  dateAdded: string;
  lotNumber?: string;
  isForTrade: boolean;
}

export interface CollectionStats {
  totalCards: number;
  totalValue: number;
  recentAdditions: number;
  topSports: Array<{ sport: string; count: number }>;
  valueDistribution: Array<{ range: string; count: number }>;
}

// Description: Get collection statistics
// Endpoint: GET /api/cards/stats
// Request: {}
// Response: { stats: CollectionStats }
export const getCollectionStats = () => {
  console.log('Fetching collection stats...');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          totalCards: 1247,
          totalValue: 12450,
          recentAdditions: 23,
          topSports: [
            { sport: 'Baseball', count: 456 },
            { sport: 'Basketball', count: 321 },
            { sport: 'Football', count: 289 },
            { sport: 'Hockey', count: 181 }
          ],
          valueDistribution: [
            { range: '$0-$10', count: 892 },
            { range: '$10-$50', count: 234 },
            { range: '$50-$100', count: 78 },
            { range: '$100+', count: 43 }
          ]
        }
      });
    }, 500);
  });
  // try {
  //   return await api.get('/api/cards/stats');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get all cards with pagination and filters
// Endpoint: GET /api/cards
// Request: { page?: number, limit?: number, search?: string, sport?: string, year?: number }
// Response: { cards: Card[], total: number, page: number, totalPages: number }
export const getCards = (params: { page?: number; limit?: number; search?: string; sport?: string; year?: number } = {}) => {
  console.log('Fetching cards with params:', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCards: Card[] = [
        {
          _id: '1',
          playerName: 'Mike Trout',
          sport: 'Baseball',
          year: 2009,
          manufacturer: 'Topps',
          setName: 'Bowman Chrome',
          cardNumber: 'BC1',
          frontImage: '/api/placeholder/250/350',
          backImage: '/api/placeholder/250/350',
          condition: { centering: 9, corners: 9, edges: 8, surface: 9, overall: 'Near Mint' },
          isRookieCard: true,
          isAutograph: false,
          isMemorabilia: false,
          estimatedValue: 2500,
          marketValue: 2650,
          tags: ['rookie', 'chrome', 'angels'],
          notes: 'Excellent condition rookie card',
          dateAdded: '2024-01-15',
          isForTrade: false
        },
        {
          _id: '2',
          playerName: 'LeBron James',
          sport: 'Basketball',
          year: 2003,
          manufacturer: 'Upper Deck',
          setName: 'Exquisite Collection',
          cardNumber: 'RC23',
          frontImage: '/api/placeholder/250/350',
          backImage: '/api/placeholder/250/350',
          condition: { centering: 10, corners: 9, edges: 9, surface: 10, overall: 'Mint' },
          isRookieCard: true,
          isAutograph: true,
          isMemorabilia: true,
          estimatedValue: 15000,
          marketValue: 16500,
          tags: ['rookie', 'autograph', 'patch', 'lakers'],
          notes: 'Rare rookie patch autograph',
          dateAdded: '2024-01-10',
          isForTrade: false
        },
        {
          _id: '3',
          playerName: 'Tom Brady',
          sport: 'Football',
          year: 2000,
          manufacturer: 'Playoff Contenders',
          setName: 'Championship Ticket',
          cardNumber: '144',
          frontImage: '/api/placeholder/250/350',
          backImage: '/api/placeholder/250/350',
          condition: { centering: 8, corners: 8, edges: 9, surface: 8, overall: 'Near Mint' },
          isRookieCard: true,
          isAutograph: true,
          isMemorabilia: false,
          estimatedValue: 8500,
          marketValue: 9200,
          tags: ['rookie', 'autograph', 'patriots', 'goat'],
          notes: 'Iconic rookie autograph',
          dateAdded: '2024-01-08',
          isForTrade: false
        }
      ];
      
      resolve({
        cards: mockCards,
        total: mockCards.length,
        page: params.page || 1,
        totalPages: 1
      });
    }, 500);
  });
  // try {
  //   return await api.get('/api/cards', { params });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get a single card by ID
// Endpoint: GET /api/cards/:id
// Request: {}
// Response: { card: Card }
export const getCard = (id: string) => {
  console.log('Fetching card with ID:', id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        card: {
          _id: id,
          playerName: 'Mike Trout',
          sport: 'Baseball',
          year: 2009,
          manufacturer: 'Topps',
          setName: 'Bowman Chrome',
          cardNumber: 'BC1',
          frontImage: '/api/placeholder/400/560',
          backImage: '/api/placeholder/400/560',
          condition: { centering: 9, corners: 9, edges: 8, surface: 9, overall: 'Near Mint' },
          isRookieCard: true,
          isAutograph: false,
          isMemorabilia: false,
          estimatedValue: 2500,
          marketValue: 2650,
          tags: ['rookie', 'chrome', 'angels'],
          notes: 'Excellent condition rookie card with sharp corners and good centering.',
          dateAdded: '2024-01-15',
          isForTrade: false
        }
      });
    }, 500);
  });
  // try {
  //   return await api.get(`/api/cards/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Add a new card manually
// Endpoint: POST /api/cards
// Request: { card: Partial<Card> }
// Response: { success: boolean, card: Card }
export const addCard = (cardData: Partial<Card>) => {
  console.log('Adding new card:', cardData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        card: {
          _id: Date.now().toString(),
          ...cardData,
          dateAdded: new Date().toISOString()
        }
      });
    }, 1000);
  });
  // try {
  //   return await api.post('/api/cards', { card: cardData });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update card information
// Endpoint: PUT /api/cards/:id
// Request: { card: Partial<Card> }
// Response: { success: boolean, card: Card }
export const updateCard = (id: string, cardData: Partial<Card>) => {
  console.log('Updating card:', id, cardData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        card: { _id: id, ...cardData }
      });
    }, 1000);
  });
  // try {
  //   return await api.put(`/api/cards/${id}`, { card: cardData });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Delete a card
// Endpoint: DELETE /api/cards/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteCard = (id: string) => {
  console.log('Deleting card:', id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Card deleted successfully'
      });
    }, 500);
  });
  // try {
  //   return await api.delete(`/api/cards/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};