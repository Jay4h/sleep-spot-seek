const express = require('express');
const app = express();
const PORT = 4000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BOOK MY SLEEP Backend Server is running',
    timestamp: new Date().toISOString(),
    mongodb: 'mongodb://localhost:27017/book-my-sleep'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 BOOK MY SLEEP Backend Server Started');
  console.log(`🔗 Server: http://localhost:${PORT}`);
  console.log(`💾 MongoDB: mongodb://localhost:27017/book-my-sleep`);
  console.log('=====================================');
});

