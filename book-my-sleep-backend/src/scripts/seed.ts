import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/config';
import User from '../models/User';
import Property from '../models/Property';
import Room from '../models/Room';
import Booking from '../models/Booking';
import Review from '../models/Review';

const connectDB = async () => {
  try {
    await mongoose.connect(config.database.mongodbUri);
    console.log('✅ Database connected for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@bookmysleep.com',
      password: 'admin123',
      phoneNumber: '+919876543210',
      role: 'admin',
      address: {
        street: 'Admin Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400001',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      isVerified: true
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create owner users
    const owners = [];
    for (let i = 1; i <= 3; i++) {
      const owner = new User({
        firstName: `Owner${i}`,
        lastName: 'Sharma',
        email: `owner${i}@example.com`,
        password: 'password123',
        phoneNumber: `+91987654321${i}`,
        role: 'owner',
        address: {
          street: `${i} Owner Street`,
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '40000' + i,
          coordinates: { lat: 19.0760 + (i * 0.01), lng: 72.8777 + (i * 0.01) }
        },
        isVerified: true,
        stripeConnected: i === 1 // First owner has Stripe connected
      });
      await owner.save();
      owners.push(owner);
    }
    console.log('👥 Created owner users');

    // Create seeker users
    const seekers = [];
    for (let i = 1; i <= 5; i++) {
      const seeker = new User({
        firstName: `Seeker${i}`,
        lastName: 'Patel',
        email: `seeker${i}@example.com`,
        password: 'password123',
        phoneNumber: `+91987654332${i}`,
        role: 'seeker',
        address: {
          street: `${i} Seeker Street`,
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '40001' + i,
          coordinates: { lat: 19.0760 + (i * 0.005), lng: 72.8777 + (i * 0.005) }
        },
        isVerified: true
      });
      await seeker.save();
      seekers.push(seeker);
    }
    console.log('👥 Created seeker users');

    // Create properties
    const properties = [];
    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      for (let j = 1; j <= 2; j++) {
        const property = new Property({
          ownerId: owner._id,
          propertyName: `${owner.firstName}'s PG ${j}`,
          description: `A comfortable PG accommodation in Mumbai with all modern amenities. Perfect for working professionals and students.`,
          address: {
            street: `${i + 1}${j} Property Street`,
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zipCode: '40000' + (i * 2 + j),
            coordinates: { lat: 19.0760 + (i * 0.02), lng: 72.8777 + (j * 0.02) }
          },
          propertyType: 'PG',
          amenities: ['WiFi', 'AC', 'Parking', 'Security', 'Laundry', 'Kitchen'],
          images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
            'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=500'
          ],
          rules: ['No smoking', 'No pets', 'No loud music after 10 PM'],
          isActive: true,
          verificationStatus: i === 0 ? 'verified' : 'pending'
        });
        await property.save();
        properties.push(property);
      }
    }
    console.log('🏠 Created properties');

    // Create rooms
    const rooms = [];
    for (const property of properties) {
      for (let i = 1; i <= 3; i++) {
        const room = new Room({
          propertyId: property._id,
          roomNumber: `R${i}`,
          roomType: i === 1 ? 'Single' : i === 2 ? 'Double' : 'Triple',
          price: i === 1 ? 8000 : i === 2 ? 12000 : 15000,
          securityDeposit: i === 1 ? 16000 : i === 2 ? 24000 : 30000,
          capacity: i,
          currentOccupancy: Math.floor(Math.random() * i),
          amenities: ['Bed', 'Wardrobe', 'Study Table', 'Chair'],
          images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
          ],
          isAvailable: true,
          availableFrom: new Date()
        });
        await room.save();
        rooms.push(room);
      }
    }
    console.log('🚪 Created rooms');

    // Create bookings
    const bookings = [];
    for (let i = 0; i < 10; i++) {
      const seeker = seekers[i % seekers.length];
      const room = rooms[i % rooms.length];
      const property = properties.find(p => p._id.toString() === room.propertyId.toString());
      const owner = owners.find(o => o._id.toString() === property?.ownerId.toString());

      if (property && owner) {
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + 7);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setMonth(checkOutDate.getMonth() + 1);

        const booking = new Booking({
          seekerId: seeker._id,
          ownerId: owner._id,
          propertyId: property._id,
          roomId: room._id,
          checkInDate,
          checkOutDate,
          totalAmount: room.price,
          securityDeposit: room.securityDeposit,
          platformCommission: Math.round(room.price * 0.05),
          bookingStatus: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)],
          paymentStatus: ['pending', 'paid'][Math.floor(Math.random() * 2)],
          specialRequests: i % 3 === 0 ? 'Near window preferred' : undefined
        });
        await booking.save();
        bookings.push(booking);
      }
    }
    console.log('📅 Created bookings');

    // Create reviews
    for (let i = 0; i < 5; i++) {
      const booking = bookings[i];
      if (booking && booking.bookingStatus === 'completed') {
        const review = new Review({
          seekerId: booking.seekerId,
          ownerId: booking.ownerId,
          propertyId: booking.propertyId,
          bookingId: booking._id,
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
          review: `Great property with excellent amenities. Highly recommended for anyone looking for a comfortable stay.`
        });
        await review.save();
      }
    }
    console.log('⭐ Created reviews');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👤 Users: ${await User.countDocuments()}`);
    console.log(`🏠 Properties: ${await Property.countDocuments()}`);
    console.log(`🚪 Rooms: ${await Room.countDocuments()}`);
    console.log(`📅 Bookings: ${await Booking.countDocuments()}`);
    console.log(`⭐ Reviews: ${await Review.countDocuments()}`);

    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@bookmysleep.com / admin123');
    console.log('Owner1: owner1@example.com / password123');
    console.log('Seeker1: seeker1@example.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
