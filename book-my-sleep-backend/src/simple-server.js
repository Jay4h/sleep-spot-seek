const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models to ensure they're registered with mongoose
require('../dist/models/User');
require('../dist/models/Property');
require('../dist/models/Room');
require('../dist/models/Booking');
require('../dist/models/Review');
require('../dist/models/Message');
require('../dist/models/Notification');
require('../dist/models/Payout');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/book-my-sleep';

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to BOOK MY SLEEP Backend API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties',
      bookings: '/api/bookings',
      payments: '/api/payments'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BOOK MY SLEEP Backend Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: MONGODB_URI
  });
});

// API root
app.get('/api', async (req, res) => {
  try {
    // Get database stats
    const dbStats = {};
    const collections = ['users', 'properties', 'rooms', 'bookings', 'reviews', 'messages', 'notifications', 'payouts'];
    
    for (const collection of collections) {
      try {
        const count = await mongoose.connection.db.collection(collection).countDocuments();
        dbStats[collection] = count;
      } catch (error) {
        dbStats[collection] = 0;
      }
    }
    
    res.json({
      success: true,
      message: 'BOOK MY SLEEP API',
      version: '1.0.0',
      database: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.db.databaseName,
        collections: dbStats
      },
      endpoints: {
        health: '/health',
        api: '/api',
        auth: '/api/auth',
        users: '/api/users',
        properties: '/api/properties',
        bookings: '/api/bookings',
        payments: '/api/payments'
      }
    });
  } catch (error) {
    res.json({
      success: true,
      message: 'BOOK MY SLEEP API',
      version: '1.0.0',
      database: {
        connected: false,
        error: 'Unable to fetch database stats'
      },
      endpoints: {
        health: '/health',
        api: '/api',
        auth: '/api/auth',
        users: '/api/users',
        properties: '/api/properties',
        bookings: '/api/bookings',
        payments: '/api/payments'
      }
    });
  }
});

// PG Owner Registration endpoint
app.post('/api/auth/register/pg-owner', async (req, res) => {
  try {
    const User = mongoose.model('User');
    const Property = mongoose.model('Property');
    
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      propertyName,
      propertyType,
      description,
      street,
      city,
      state,
      zipCode,
      amenities,
      rules,
      contactPerson,
      contactPhone,
      contactEmail
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'owner',
      address: {
        street,
        city,
        state,
        country: 'India',
        zipCode,
        coordinates: { lat: 19.0760, lng: 72.8777 } // Default Mumbai coordinates
      },
      isVerified: false
    });

    await user.save();

    // Create property
    const property = new Property({
      ownerId: user._id,
      propertyName,
      description,
      address: {
        street,
        city,
        state,
        country: 'India',
        zipCode,
        coordinates: { lat: 19.0760, lng: 72.8777 } // Default Mumbai coordinates
      },
      propertyType,
      amenities: amenities || [],
      rules: rules || [],
      verificationStatus: 'pending',
      isActive: true
    });

    await property.save();

    res.json({
      success: true,
      message: 'PG Owner registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        property: {
          id: property._id,
          name: property.propertyName,
          type: property.propertyType
        }
      }
    });

  } catch (error) {
    console.error('PG Owner registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

// Regular Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const User = mongoose.model('User');
    
    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role || 'seeker',
      address: {
        street: 'Not provided',
        city: 'Not provided',
        state: 'Not provided',
        country: 'India',
        zipCode: '000000',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      isVerified: false
    });

    await user.save();

    res.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint - Ready for implementation',
    data: { token: 'mock-token' }
  });
});

// Property endpoints
app.get('/api/properties', async (req, res) => {
  try {
    const Property = mongoose.model('Property');
    const properties = await Property.find({ isActive: true })
      .populate('owner', 'firstName lastName email phoneNumber')
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Properties retrieved successfully',
      data: { properties }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties'
    });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const Property = mongoose.model('Property');
    const Room = mongoose.model('Room');
    
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phoneNumber');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    const rooms = await Room.find({ propertyId: req.params.id, isAvailable: true });
    
    res.json({
      success: true,
      message: 'Property retrieved successfully',
      data: { 
        property: property.getPublicData(),
        rooms 
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property'
    });
  }
});

// Booking endpoints
app.get('/api/bookings', async (req, res) => {
  try {
    const Booking = mongoose.model('Booking');
    const bookings = await Booking.find()
      .populate('seekerId', 'firstName lastName email phoneNumber')
      .populate('propertyId', 'propertyName address')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: { bookings }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// Create booking request
app.post('/api/bookings', async (req, res) => {
  try {
    const Booking = mongoose.model('Booking');
    const Notification = mongoose.model('Notification');
    const Property = mongoose.model('Property');
    const User = mongoose.model('User');
    
    const { propertyId, seekerId, message } = req.body;

    // Get property and owner details
    const property = await Property.findById(propertyId).populate('ownerId');
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Create booking request
    const booking = new Booking({
      seekerId,
      propertyId,
      ownerId: property.ownerId._id,
      status: 'pending',
      message: message || 'Interested in booking this property',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      rent: 0, // Will be set by owner
      deposit: 0, // Will be set by owner
      paymentStatus: 'pending'
    });

    await booking.save();

    // Create notification for property owner
    const notification = new Notification({
      userId: property.ownerId._id,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `You have a new booking request for ${property.propertyName}`,
      data: {
        bookingId: booking._id,
        seekerId: seekerId,
        propertyId: propertyId
      },
      isRead: false
    });

    await notification.save();

    res.json({
      success: true,
      message: 'Booking request sent successfully',
      data: {
        booking: {
          id: booking._id,
          status: booking.status,
          message: booking.message
        }
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking request'
    });
  }
});

// Notification endpoints
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const Notification = mongoose.model('Notification');
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: { notifications }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
app.put('/api/notifications/:notificationId/read', async (req, res) => {
  try {
    const Notification = mongoose.model('Notification');
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update notification'
    });
  }
});

// Payment endpoints
app.post('/api/payments/create-intent', (req, res) => {
  res.json({
    success: true,
    message: 'Payment intent endpoint - Ready for implementation',
    data: { clientSecret: 'pi_test_mock' }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Create initial seed data
const createSeedData = async () => {
  try {
    const User = mongoose.model('User');
    const Property = mongoose.model('Property');
    const Room = mongoose.model('Room');

    // Clear existing data for fresh seed
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Room.deleteMany({});
    await mongoose.model('Booking').deleteMany({});
    await mongoose.model('Review').deleteMany({});
    await mongoose.model('Message').deleteMany({});
    await mongoose.model('Notification').deleteMany({});
    await mongoose.model('Payout').deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('🌱 Creating seed data...');

    // Create sample users
    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phoneNumber: '+91-9876543210',
        role: 'seeker',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '400001',
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        isVerified: true
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        phoneNumber: '+91-9876543211',
        role: 'owner',
        address: {
          street: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          zipCode: '110001',
          coordinates: { lat: 28.7041, lng: 77.1025 }
        },
        isVerified: true
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@bookmysleep.com',
        password: 'admin123',
        phoneNumber: '+91-9876543212',
        role: 'admin',
        address: {
          street: '789 Admin Street',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560001',
          coordinates: { lat: 12.9716, lng: 77.5946 }
        },
        isVerified: true
      }
    ];

    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Create sample properties
    const sampleProperties = [
      {
        ownerId: users[1]._id, // Jane Smith (owner)
        propertyName: 'Cozy PG for Students',
        description: 'A comfortable PG accommodation near university with all modern amenities.',
        address: {
          street: '101 Student Lane',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          zipCode: '110002',
          coordinates: { lat: 28.6139, lng: 77.2090 }
        },
        propertyType: 'PG',
        amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'Parking'],
        images: ['https://example.com/image1.jpg'],
        rules: ['No smoking', 'No pets', 'Quiet hours after 10 PM'],
        verificationStatus: 'verified',
        rating: 4.5,
        reviewCount: 12
      },
      {
        ownerId: users[1]._id, // Jane Smith (owner)
        propertyName: 'Modern Hostel for Working Professionals',
        description: 'Spacious hostel rooms with modern facilities for working professionals.',
        address: {
          street: '202 Professional Road',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          zipCode: '110003',
          coordinates: { lat: 28.5355, lng: 77.3910 }
        },
        propertyType: 'Hostel',
        amenities: ['WiFi', 'AC', 'Gym', 'Cafeteria', 'Laundry', 'Security'],
        images: ['https://example.com/image2.jpg'],
        rules: ['No smoking', 'No alcohol', 'Guest policy applies'],
        verificationStatus: 'verified',
        rating: 4.2,
        reviewCount: 8
      }
    ];

    const properties = await Property.insertMany(sampleProperties);
    console.log(`✅ Created ${properties.length} properties`);

    // Create sample rooms
    const sampleRooms = [
      {
        propertyId: properties[0]._id,
        roomNumber: '101',
        roomType: 'Single',
        capacity: 1,
        price: 8000,
        securityDeposit: 5000,
        amenities: ['AC', 'WiFi', 'Study Table', 'Wardrobe'],
        isAvailable: true,
        images: ['https://example.com/room1.jpg']
      },
      {
        propertyId: properties[0]._id,
        roomNumber: '102',
        roomType: 'Double',
        capacity: 2,
        price: 12000,
        securityDeposit: 8000,
        amenities: ['AC', 'WiFi', 'Study Table', 'Wardrobe'],
        isAvailable: true,
        images: ['https://example.com/room2.jpg']
      },
      {
        propertyId: properties[1]._id,
        roomNumber: '201',
        roomType: 'Single',
        capacity: 1,
        price: 10000,
        securityDeposit: 6000,
        amenities: ['AC', 'WiFi', 'Study Table', 'Wardrobe', 'Balcony'],
        isAvailable: true,
        images: ['https://example.com/room3.jpg']
      }
    ];

    const rooms = await Room.insertMany(sampleRooms);
    console.log(`✅ Created ${rooms.length} rooms`);

    console.log('🎉 Seed data created successfully!');
    console.log('📊 Database Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Properties: ${properties.length}`);
    console.log(`   - Rooms: ${rooms.length}`);

  } catch (error) {
    console.error('❌ Error creating seed data:', error.message);
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
      
      // Create seed data after successful connection
      await createSeedData();
    } else {
      console.log('⚠️ MongoDB URI not configured, skipping database connection');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️ Continuing without database connection');
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log('🚀 BOOK MY SLEEP Backend Server Started');
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Server: http://localhost:${PORT}`);
      console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
      console.log(`💾 Database: ${MONGODB_URI ? 'Configured' : 'Not configured'}`);
      console.log('=====================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

