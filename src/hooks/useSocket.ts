import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useNotifications } from './useNotifications';
import { ChatMessage } from '@/types';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { addMessage, addConversation } = useChatStore();
  const { showMessageNotification, showBookingNotification } = useNotifications();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        auth: {
          userId: user.id,
          role: user.role,
        },
      });

      const socket = socketRef.current;

      // Connection events
      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Chat events
      socket.on('new-message', (message: ChatMessage) => {
        addMessage(message);
        
        // Show notification if message is not from current user
        if (message.senderId !== user.id) {
          showMessageNotification(
            'New Message',
            `You have a new message from ${message.senderId}`
          );
        }
      });

      socket.on('typing', (data: { conversationId: string; userId: string; isTyping: boolean }) => {
        // Handle typing indicators
        console.log('User typing:', data);
      });

      // Booking events
      socket.on('booking-request', (data: { bookingId: string; propertyId: string; seekerId: string }) => {
        showBookingNotification(
          'New Booking Request',
          `You have a new booking request for property ${data.propertyId}`
        );
      });

      socket.on('booking-status-change', (data: { bookingId: string; status: string }) => {
        showBookingNotification(
          'Booking Status Updated',
          `Your booking status has been updated to ${data.status}`
        );
      });

      // Error handling
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      return () => {
        socket.disconnect();
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user, addMessage, addConversation, showMessageNotification, showBookingNotification]);

  const sendMessage = (conversationId: string, content: string) => {
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        conversationId,
        content,
        senderId: user?.id,
      });
    }
  };

  const joinConversation = (conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-conversation', conversationId);
    }
  };

  const sendTyping = (conversationId: string, isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', {
        conversationId,
        isTyping,
      });
    }
  };

  return {
    socket: socketRef.current,
    sendMessage,
    joinConversation,
    leaveConversation,
    sendTyping,
    isConnected: socketRef.current?.connected || false,
  };
};
