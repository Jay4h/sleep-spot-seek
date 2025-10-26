const express = require('express');
const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BOOK MY SLEEP Backend Server is running',
    timestamp: new Date().toISOString(),
    mongodb: 'mongodb://localhost:27017/book-my-sleep'
  });
});

// API root
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'BOOK MY SLEEP API',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 BOOK MY SLEEP Backend Server Started');
  console.log(`🔗 Server: http://localhost:${PORT}`);
  console.log(`💾 MongoDB: mongodb://localhost:27017/book-my-sleep`);
  console.log('=====================================');
});

