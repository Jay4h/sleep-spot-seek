import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/User';

export const setupSocketIO = (io: SocketIOServer): void => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, config.jwt.secret) as any;
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.data.user.firstName} ${socket.data.user.lastName}`);

    // Join user to their personal room
    socket.join(`user:${socket.data.user._id}`);

    // Handle joining conversation rooms
    socket.on('join-conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`💬 User joined conversation: ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`💬 User left conversation: ${conversationId}`);
    });

    // Handle sending messages
    socket.on('send-message', (data: { conversationId: string; text: string }) => {
      // Broadcast message to conversation room
      socket.to(`conversation:${data.conversationId}`).emit('new-message', {
        conversationId: data.conversationId,
        fromUser: socket.data.user._id,
        text: data.text,
        timestamp: new Date()
      });
    });

    // Handle typing indicators
    socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing', {
        conversationId: data.conversationId,
        userId: socket.data.user._id,
        isTyping: data.isTyping
      });
    });

    // Handle booking notifications
    socket.on('booking-request', (data: { bookingId: string; propertyId: string }) => {
      // Emit to property owner
      socket.to(`property:${data.propertyId}`).emit('booking-request', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.data.user.firstName} ${socket.data.user.lastName}`);
    });
  });

  console.log('🔌 Socket.IO server initialized');
};
