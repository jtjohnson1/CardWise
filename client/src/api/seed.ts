import api from './api';

export interface SeedAdminResponse {
  success: boolean;
  message: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface SeedCardsResponse {
  success: boolean;
  message: string;
  cardsCount: number;
  cards?: Array<{
    _id: string;
    playerName: string;
    sport: string;
    year: number;
  }>;
}

// Description: Seed the database with an initial admin user
// Endpoint: POST /api/seed/admin
// Request: {}
// Response: { success: boolean, message: string, user?: { email: string, firstName: string, lastName: string, role: string } }
export const seedAdminUser = async (): Promise<SeedAdminResponse> => {
  try {
    const response = await api.post('/api/seed/admin');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Seed the database with sample card data
// Endpoint: POST /api/seed/cards
// Request: {}
// Response: { success: boolean, message: string, cardsCount: number, cards?: Array<{ _id: string, playerName: string, sport: string, year: number }> }
export const seedSampleCards = async (): Promise<SeedCardsResponse> => {
  try {
    const response = await api.post('/api/seed/cards');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};