const User = require('../models/User');
const Card = require('../models/Card');
const { hashPassword } = require('../utils/password');

/**
 * Seed the database with an admin user
 * @returns {Promise<Object>} - Result of seeding operation
 */
const seedAdminUser = async () => {
  try {
    console.log('[PERFORMANCE] Starting admin user seeding process...');
    const startTime = Date.now();

    // Check if admin user already exists
    console.log('[PERFORMANCE] Checking for existing admin user...');
    const queryStartTime = Date.now();
    const existingAdmin = await User.findOne({ email: 'admin@cardwise.com' });
    console.log(`[PERFORMANCE] Admin user query took ${Date.now() - queryStartTime}ms`);
    
    if (existingAdmin) {
      console.log(`[PERFORMANCE] Admin user check completed in ${Date.now() - startTime}ms - user exists`);
      return {
        success: true,
        message: 'Admin user already exists',
        user: {
          email: existingAdmin.email,
          firstName: existingAdmin.firstName,
          lastName: existingAdmin.lastName,
          role: existingAdmin.role
        }
      };
    }

    console.log('[PERFORMANCE] Creating new admin user...');
    // Create admin user
    const hashStartTime = Date.now();
    const hashedPassword = await hashPassword('admin123');
    console.log(`[PERFORMANCE] Password hashing took ${Date.now() - hashStartTime}ms`);

    const adminUser = new User({
      email: 'admin@cardwise.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: true
        }
      }
    });

    const saveStartTime = Date.now();
    const savedUser = await adminUser.save();
    console.log(`[PERFORMANCE] Admin user save took ${Date.now() - saveStartTime}ms`);
    console.log(`[PERFORMANCE] Admin user creation completed in ${Date.now() - startTime}ms`);

    return {
      success: true,
      message: 'Admin user created successfully',
      user: {
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role
      }
    };
  } catch (error) {
    console.error('[PERFORMANCE] Error seeding admin user:', error.message);
    console.error('[PERFORMANCE] Error stack:', error.stack);
    throw new Error(`Failed to seed admin user: ${error.message}`);
  }
};

/**
 * Seed the database with sample card data
 * @returns {Promise<Object>} - Result of seeding operation
 */
const seedSampleCards = async () => {
  try {
    console.log('[PERFORMANCE] Starting sample cards seeding process...');
    const startTime = Date.now();

    // Get admin user to assign cards to
    console.log('[PERFORMANCE] Finding admin user for cards...');
    const userQueryStartTime = Date.now();
    const adminUser = await User.findOne({ email: 'admin@cardwise.com' });
    console.log(`[PERFORMANCE] Admin user lookup took ${Date.now() - userQueryStartTime}ms`);
    
    if (!adminUser) {
      throw new Error('Admin user not found. Please seed admin user first.');
    }

    // Check if cards already exist
    console.log('[PERFORMANCE] Checking for existing cards...');
    const cardQueryStartTime = Date.now();
    const existingCards = await Card.countDocuments({ userId: adminUser._id });
    console.log(`[PERFORMANCE] Card count query took ${Date.now() - cardQueryStartTime}ms`);
    
    if (existingCards > 0) {
      console.log(`[PERFORMANCE] Sample cards check completed in ${Date.now() - startTime}ms - ${existingCards} cards exist`);
      return {
        success: true,
        message: `${existingCards} cards already exist`,
        cardsCount: existingCards
      };
    }

    console.log('[PERFORMANCE] Creating sample cards...');
    const sampleCards = [
      {
        playerName: 'Mike Trout',
        sport: 'Baseball',
        year: 2009,
        manufacturer: 'Topps',
        setName: 'Bowman Chrome',
        cardNumber: 'BC1',
        frontImage: '/api/placeholder/250/350?color=4A90E2&textColor=FFFFFF&text=Mike+Trout+Front',
        backImage: '/api/placeholder/250/350?color=E24A4A&textColor=FFFFFF&text=Mike+Trout+Back',
        condition: { centering: 9, corners: 9, edges: 8, surface: 9, overall: 'Near Mint' },
        isRookieCard: true,
        isAutograph: false,
        isMemorabilia: false,
        estimatedValue: 2500,
        marketValue: 2650,
        tags: ['rookie', 'chrome', 'angels'],
        notes: 'Excellent condition rookie card',
        isForTrade: false,
        userId: adminUser._id
      },
      {
        playerName: 'LeBron James',
        sport: 'Basketball',
        year: 2003,
        manufacturer: 'Upper Deck',
        setName: 'Exquisite Collection',
        cardNumber: 'RC23',
        frontImage: '/api/placeholder/250/350?color=FF8C00&textColor=FFFFFF&text=LeBron+James+Front',
        backImage: '/api/placeholder/250/350?color=FF4500&textColor=FFFFFF&text=LeBron+James+Back',
        condition: { centering: 10, corners: 9, edges: 9, surface: 10, overall: 'Mint' },
        isRookieCard: true,
        isAutograph: true,
        isMemorabilia: true,
        estimatedValue: 15000,
        marketValue: 16500,
        tags: ['rookie', 'autograph', 'patch', 'lakers'],
        notes: 'Rare rookie patch autograph',
        isForTrade: false,
        userId: adminUser._id
      },
      {
        playerName: 'Tom Brady',
        sport: 'Football',
        year: 2000,
        manufacturer: 'Playoff Contenders',
        setName: 'Championship Ticket',
        cardNumber: '144',
        frontImage: '/api/placeholder/250/350?color=32CD32&textColor=FFFFFF&text=Tom+Brady+Front',
        backImage: '/api/placeholder/250/350?color=228B22&textColor=FFFFFF&text=Tom+Brady+Back',
        condition: { centering: 8, corners: 8, edges: 9, surface: 8, overall: 'Near Mint' },
        isRookieCard: true,
        isAutograph: true,
        isMemorabilia: false,
        estimatedValue: 8500,
        marketValue: 9200,
        tags: ['rookie', 'autograph', 'patriots', 'goat'],
        notes: 'Iconic rookie autograph',
        isForTrade: false,
        userId: adminUser._id
      },
      {
        playerName: 'Wayne Gretzky',
        sport: 'Hockey',
        year: 1979,
        manufacturer: 'O-Pee-Chee',
        setName: 'O-Pee-Chee',
        cardNumber: '18',
        frontImage: '/api/placeholder/250/350?color=9370DB&textColor=FFFFFF&text=Wayne+Gretzky+Front',
        backImage: '/api/placeholder/250/350?color=8A2BE2&textColor=FFFFFF&text=Wayne+Gretzky+Back',
        condition: { centering: 7, corners: 7, edges: 8, surface: 8, overall: 'Very Good' },
        isRookieCard: true,
        isAutograph: false,
        isMemorabilia: false,
        estimatedValue: 12000,
        marketValue: 13500,
        tags: ['rookie', 'hockey', 'gretzky', 'oilers'],
        notes: 'The Great One rookie card',
        isForTrade: false,
        userId: adminUser._id
      },
      {
        playerName: 'Michael Jordan',
        sport: 'Basketball',
        year: 1986,
        manufacturer: 'Fleer',
        setName: 'Fleer Basketball',
        cardNumber: '57',
        frontImage: '/api/placeholder/250/350?color=DC143C&textColor=FFFFFF&text=Michael+Jordan+Front',
        backImage: '/api/placeholder/250/350?color=B22222&textColor=FFFFFF&text=Michael+Jordan+Back',
        condition: { centering: 8, corners: 7, edges: 8, surface: 9, overall: 'Very Good' },
        isRookieCard: true,
        isAutograph: false,
        isMemorabilia: false,
        estimatedValue: 25000,
        marketValue: 28000,
        tags: ['rookie', 'jordan', 'bulls', 'goat'],
        notes: 'Holy grail of basketball cards',
        isForTrade: false,
        userId: adminUser._id
      }
    ];

    const insertStartTime = Date.now();
    const createdCards = await Card.insertMany(sampleCards);
    console.log(`[PERFORMANCE] Card insertion took ${Date.now() - insertStartTime}ms`);
    console.log(`[PERFORMANCE] Sample cards creation completed in ${Date.now() - startTime}ms`);

    return {
      success: true,
      message: `Successfully created ${createdCards.length} sample cards`,
      cardsCount: createdCards.length,
      cards: createdCards.map(card => ({
        _id: card._id,
        playerName: card.playerName,
        sport: card.sport,
        year: card.year
      }))
    };
  } catch (error) {
    console.error('[PERFORMANCE] Error seeding sample cards:', error.message);
    console.error('[PERFORMANCE] Error stack:', error.stack);
    throw new Error(`Failed to seed sample cards: ${error.message}`);
  }
};

module.exports = {
  seedAdminUser,
  seedSampleCards
};