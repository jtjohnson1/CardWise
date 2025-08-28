import api from './api';

export interface WishlistItem {
  _id: string;
  playerName: string;
  sport: string;
  year?: number;
  manufacturer?: string;
  setName?: string;
  cardNumber?: string;
  priority: 'low' | 'medium' | 'high';
  maxPrice?: number;
  notes?: string;
  dateAdded: string;
  priceAlerts: boolean;
  currentMarketPrice?: number;
}

// Description: Get wishlist items
// Endpoint: GET /api/wishlist
// Request: {}
// Response: { items: WishlistItem[] }
export const getWishlistItems = () => {
  console.log('Fetching wishlist items...');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: [
          {
            _id: '1',
            playerName: 'Connor Bedard',
            sport: 'Hockey',
            year: 2023,
            manufacturer: 'Upper Deck',
            setName: 'The Cup',
            cardNumber: 'RC-CB',
            priority: 'high',
            maxPrice: 5000,
            notes: 'Looking for rookie patch auto',
            dateAdded: '2024-01-20',
            priceAlerts: true,
            currentMarketPrice: 4200
          },
          {
            _id: '2',
            playerName: 'Victor Wembanyama',
            sport: 'Basketball',
            year: 2023,
            manufacturer: 'Panini',
            setName: 'Prizm',
            priority: 'high',
            maxPrice: 2000,
            notes: 'Any rookie card in good condition',
            dateAdded: '2024-01-18',
            priceAlerts: true,
            currentMarketPrice: 1800
          },
          {
            _id: '3',
            playerName: 'Bryce Young',
            sport: 'Football',
            year: 2023,
            manufacturer: 'Panini',
            setName: 'Contenders',
            priority: 'medium',
            maxPrice: 800,
            notes: 'Rookie ticket autograph',
            dateAdded: '2024-01-15',
            priceAlerts: false,
            currentMarketPrice: 650
          }
        ]
      });
    }, 500);
  });
  // try {
  //   return await api.get('/api/wishlist');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Add item to wishlist
// Endpoint: POST /api/wishlist
// Request: { item: Partial<WishlistItem> }
// Response: { success: boolean, item: WishlistItem }
export const addWishlistItem = (itemData: Partial<WishlistItem>) => {
  console.log('Adding wishlist item:', itemData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        item: {
          _id: Date.now().toString(),
          ...itemData,
          dateAdded: new Date().toISOString()
        }
      });
    }, 500);
  });
  // try {
  //   return await api.post('/api/wishlist', { item: itemData });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Remove item from wishlist
// Endpoint: DELETE /api/wishlist/:id
// Request: {}
// Response: { success: boolean, message: string }
export const removeWishlistItem = (id: string) => {
  console.log('Removing wishlist item:', id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Item removed from wishlist'
      });
    }, 500);
  });
  // try {
  //   return await api.delete(`/api/wishlist/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};