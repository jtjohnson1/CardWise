import api from './api';

export interface EbaySearchResult {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  condition: string;
  itemWebUrl: string;
  image?: {
    imageUrl: string;
  };
  seller: {
    username: string;
    feedbackPercentage: string;
  };
}

export interface EbayPriceData {
  averagePrice: number;
  recentSales: EbaySearchResult[];
  priceRange: {
    min: number;
    max: number;
  };
}

// Description: Search eBay for card pricing data
// Endpoint: GET /api/ebay/search
// Request: { query: string, category?: string, condition?: string }
// Response: { results: EbaySearchResult[], totalCount: number }
export const searchEbayCards = (query: string, category?: string, condition?: string) => {
  console.log('Searching eBay for:', query);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        results: [
          {
            itemId: '123456789',
            title: `${query} - Sports Trading Card`,
            price: { value: '125.00', currency: 'USD' },
            condition: 'Near Mint',
            itemWebUrl: 'https://ebay.com/item/123456789',
            image: { imageUrl: '/api/placeholder/150/200' },
            seller: { username: 'cardcollector123', feedbackPercentage: '99.2' }
          },
          {
            itemId: '987654321',
            title: `${query} Rookie Card PSA 9`,
            price: { value: '89.99', currency: 'USD' },
            condition: 'Mint',
            itemWebUrl: 'https://ebay.com/item/987654321',
            image: { imageUrl: '/api/placeholder/150/200' },
            seller: { username: 'sportscards_pro', feedbackPercentage: '98.8' }
          }
        ],
        totalCount: 2
      });
    }, 1000);
  });
  // try {
  //   return await api.get('/api/ebay/search', { 
  //     params: { query, category, condition } 
  //   });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get price analysis for a specific card
// Endpoint: GET /api/ebay/price-analysis
// Request: { playerName: string, year: number, setName: string, cardNumber?: string }
// Response: { priceData: EbayPriceData }
export const getCardPriceAnalysis = (playerName: string, year: number, setName: string, cardNumber?: string) => {
  console.log('Getting price analysis for:', { playerName, year, setName, cardNumber });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        priceData: {
          averagePrice: 107.50,
          recentSales: [
            {
              itemId: '111111111',
              title: `${year} ${setName} ${playerName} #${cardNumber}`,
              price: { value: '125.00', currency: 'USD' },
              condition: 'Near Mint',
              itemWebUrl: 'https://ebay.com/item/111111111',
              seller: { username: 'carddealer', feedbackPercentage: '99.5' }
            }
          ],
          priceRange: { min: 75.00, max: 150.00 }
        }
      });
    }, 1500);
  });
  // try {
  //   return await api.get('/api/ebay/price-analysis', { 
  //     params: { playerName, year, setName, cardNumber } 
  //   });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};