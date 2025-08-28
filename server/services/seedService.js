const User = require('../models/User');
const Card = require('../models/Card');
const { hashPassword } = require('../utils/password');

/**
 * Seed the database with an admin user
 * @returns {Promise<Object>} - Result of seeding operation
 */
const seedAdminUser = async () => {
  try {
    console.log('Starting admin user seeding...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@cardwise.com' });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping seeding');
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

    // Create admin user
    const hashedPassword = await hashPassword('admin123');
    
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

    const savedUser = await adminUser.save();
    console.log('Admin user created successfully:', savedUser.email);

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
    console.error('Error seeding admin user:', error.message);
    throw new Error(`Failed to seed admin user: ${error.message}`);
  }
};

/**
 * Seed the database with sample card data
 * @returns {Promise<Object>} - Result of seeding operation
 */
const seedSampleCards = async () => {
  try {
    console.log('Starting sample cards seeding...');
    
    // Get admin user to assign cards to
    const adminUser = await User.findOne({ email: 'admin@cardwise.com' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please seed admin user first.');
    }

    // Check if cards already exist
    const existingCards = await Card.countDocuments({ userId: adminUser._id });
    if (existingCards > 0) {
      console.log(`${existingCards} cards already exist for admin user, skipping seeding`);
      return {
        success: true,
        message: `${existingCards} cards already exist`,
        cardsCount: existingCards
      };
    }

    const sampleCards = [
      {
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
        userId: adminUser._id
      },
      {
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
        frontImage: '/api/placeholder/250/350',
        backImage: '/api/placeholder/250/350',
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
        frontImage: '/api/placeholder/250/350',
        backImage: '/api/placeholder/250/350',
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

    const createdCards = await Card.insertMany(sampleCards);
    console.log(`Successfully created ${createdCards.length} sample cards`);

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
    console.error('Error seeding sample cards:', error.message);
    throw new Error(`Failed to seed sample cards: ${error.message}`);
  }
};

module.exports = {
  seedAdminUser,
  seedSampleCards
};