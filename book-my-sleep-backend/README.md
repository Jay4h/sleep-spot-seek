# BOOK MY SLEEP - Backend API

A comprehensive Node.js backend API for the BOOK MY SLEEP PG accommodation booking platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Property Management**: CRUD operations for properties and rooms
- **Booking System**: Complete booking lifecycle with payment integration
- **Real-time Chat**: Socket.io for instant messaging
- **Payment Processing**: Stripe Connect for owner payouts
- **Review System**: Property ratings and reviews
- **Admin Panel**: Analytics and property verification
- **Image Upload**: Cloudinary integration for property images
- **Email Notifications**: SendGrid integration
- **Security**: Rate limiting, input sanitization, CORS protection

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Real-time**: Socket.io
- **Payments**: Stripe
- **Images**: Cloudinary
- **Email**: SendGrid
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Custom middlewares
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── sockets/         # Socket.io handlers
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── server.ts        # Main server file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Redis instance
- Stripe account
- Cloudinary account
- SendGrid account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-my-sleep-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Server
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/book-my-sleep
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...

# Cloudinary
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Email
SENDGRID_API_KEY=SG.xxx
FROM_EMAIL=noreply@bookmysleep.com

# Admin
ADMIN_EMAIL=admin@bookmysleep.com
ADMIN_PASSWORD=secure-admin-password

# Maps
MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# SMS (Optional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Private |
| GET | `/auth/me` | Get current user | Private |

### Property Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/properties` | Get all properties | Public |
| POST | `/properties` | Create property | Owner |
| GET | `/properties/:id` | Get property by ID | Public |
| PUT | `/properties/:id` | Update property | Owner |
| DELETE | `/properties/:id` | Delete property | Owner |

### Booking Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/bookings` | Get user bookings | Private |
| POST | `/bookings` | Create booking | Private |
| GET | `/bookings/:id` | Get booking by ID | Private |
| PUT | `/bookings/:id` | Update booking status | Owner |

### Payment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/payments/create-intent` | Create payment intent | Private |
| POST | `/payments/confirm` | Confirm payment | Private |
| GET | `/payments/connect-link` | Get Stripe Connect link | Owner |

## 🔌 Socket.io Events

### Client → Server
- `join-conversation`: Join a conversation room
- `leave-conversation`: Leave a conversation room
- `send-message`: Send a message
- `typing`: Typing indicator

### Server → Client
- `new-message`: New message received
- `typing`: User typing indicator
- `booking-request`: New booking request
- `booking-update`: Booking status update

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t book-my-sleep-backend .
docker run -p 4000:4000 book-my-sleep-backend
```

### Environment Setup
1. Set up MongoDB Atlas cluster
2. Configure Redis instance
3. Set up Stripe webhooks
4. Configure Cloudinary
5. Set up SendGrid
6. Deploy to your preferred platform

## 📊 Database Schema

### Users
- Authentication and profile information
- Role-based access (seeker, owner, admin)
- Stripe Connect integration

### Properties
- Property details and location
- Amenities and rules
- Verification status

### Rooms
- Room types and pricing
- Availability management
- Occupancy tracking

### Bookings
- Booking lifecycle
- Payment integration
- Status management

### Reviews
- Property ratings
- Review text
- Booking association

### Messages
- Real-time chat
- Conversation management
- Read receipts

## 🔒 Security Features

- JWT authentication
- Role-based authorization
- Rate limiting
- Input sanitization
- CORS protection
- Helmet security headers
- Password hashing with bcrypt

## 📈 Performance

- Redis caching
- Database indexing
- Connection pooling
- Compression middleware
- Rate limiting

## 🐛 Error Handling

- Global error handler
- Custom error types
- Validation errors
- Database errors
- Authentication errors

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run seed         # Seed database
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email support@bookmysleep.com or create an issue in the repository.

---

**BOOK MY SLEEP Backend API** - Built with ❤️ for better accommodation booking experiences.
