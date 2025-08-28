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
export const getWishlistItems = async () => {
  console.log('Wishlist not implemented - returning empty list');
  return { items: [] };
};

// Description: Add item to wishlist
// Endpoint: POST /api/wishlist
// Request: { item: Partial<WishlistItem> }
// Response: { success: boolean, item: WishlistItem }
export const addWishlistItem = async (itemData: Partial<WishlistItem>) => {
  console.log('Add wishlist item not implemented');
  return {
    success: false,
    message: 'Wishlist functionality not yet implemented'
  };
};

// Description: Remove item from wishlist
// Endpoint: DELETE /api/wishlist/:id
// Request: {}
// Response: { success: boolean, message: string }
export const removeWishlistItem = async (id: string) => {
  console.log('Remove wishlist item not implemented');
  return {
    success: false,
    message: 'Wishlist functionality not yet implemented'
  };
};