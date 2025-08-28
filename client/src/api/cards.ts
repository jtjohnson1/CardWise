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
  lotNumber?: string;
  isForTrade: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionStats {
  totalCards: number;
  totalValue: number;
  recentCards: Card[];
  sportBreakdown: Array<{
    _id: string;
    count: number;
  }>;
}

// Description: Get collection statistics
// Endpoint: GET /api/cards/stats
// Request: {}
// Response: { success: boolean, stats: CollectionStats }
export const getCollectionStats = async () => {
  console.log('[PERFORMANCE] Starting getCollectionStats API call...');
  const startTime = Date.now();
  
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[PERFORMANCE] getCollectionStats completed in ${Date.now() - startTime}ms`);
      resolve({
        success: true,
        stats: {
          totalCards: 247,
          totalValue: 125750,
          recentCards: [
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
              isForTrade: false,
              userId: 'admin',
              createdAt: '2024-01-15T10:30:00Z',
              updatedAt: '2024-01-15T10:30:00Z'
            }
          ],
          sportBreakdown: [
            { _id: 'Baseball', count: 120 },
            { _id: 'Basketball', count: 85 },
            { _id: 'Football', count: 42 }
          ]
        }
      });
    }, 100); // Reduced timeout from 500ms to 100ms
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/cards/stats');
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get all cards in collection
// Endpoint: GET /api/cards
// Request: {}
// Response: { success: boolean, cards: Card[] }
export const getCards = async () => {
  try {
    console.log('[PERFORMANCE] Starting getCards API call...');
    const startTime = Date.now();
    const response = await api.get('/api/cards');
    console.log(`[PERFORMANCE] getCards completed in ${Date.now() - startTime}ms`);
    return response.data;
  } catch (error: any) {
    console.error('[PERFORMANCE] getCards failed:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a single card by ID
// Endpoint: GET /api/cards/:id
// Request: {}
// Response: { success: boolean, card: Card }
export const getCard = async (id: string) => {
  try {
    console.log(`[PERFORMANCE] Starting getCard API call for ID: ${id}...`);
    const startTime = Date.now();
    const response = await api.get(`/api/cards/${id}`);
    console.log(`[PERFORMANCE] getCard completed in ${Date.now() - startTime}ms`);
    return response.data;
  } catch (error: any) {
    console.error('[PERFORMANCE] getCard failed:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Add a new card to collection
// Endpoint: POST /api/cards
// Request: { playerName: string, sport: string, year: number, manufacturer: string, setName: string, cardNumber: string, frontImage: string, backImage: string, condition: object, estimatedValue: number, ... }
// Response: { success: boolean, message: string, card: Card }
export const addCard = async (cardData: Partial<Card>) => {
  try {
    console.log('[PERFORMANCE] Starting addCard API call...');
    const startTime = Date.now();
    const response = await api.post('/api/cards', cardData);
    console.log(`[PERFORMANCE] addCard completed in ${Date.now() - startTime}ms`);
    return response.data;
  } catch (error: any) {
    console.error('[PERFORMANCE] addCard failed:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an existing card
// Endpoint: PUT /api/cards/:id
// Request: { playerName?: string, sport?: string, year?: number, ... }
// Response: { success: boolean, message: string, card: Card }
export const updateCard = async (id: string, cardData: Partial<Card>) => {
  try {
    console.log(`[PERFORMANCE] Starting updateCard API call for ID: ${id}...`);
    const startTime = Date.now();
    const response = await api.put(`/api/cards/${id}`, cardData);
    console.log(`[PERFORMANCE] updateCard completed in ${Date.now() - startTime}ms`);
    return response.data;
  } catch (error: any) {
    console.error('[PERFORMANCE] updateCard failed:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a card
// Endpoint: DELETE /api/cards/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteCard = async (id: string) => {
  try {
    console.log(`[PERFORMANCE] Starting deleteCard API call for ID: ${id}...`);
    const startTime = Date.now();
    const response = await api.delete(`/api/cards/${id}`);
    console.log(`[PERFORMANCE] deleteCard completed in ${Date.now() - startTime}ms`);
    return response.data;
  } catch (error: any) {
    console.error('[PERFORMANCE] deleteCard failed:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};