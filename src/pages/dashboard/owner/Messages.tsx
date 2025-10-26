import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { Conversation, ChatMessage } from '@/types';

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['John Doe'],
    lastMessage: {
      id: '1',
      senderId: '1',
      receiverId: '2',
      content: 'Hi, I\'m interested in your property. Is it still available?',
      timestamp: '2024-02-20T10:30:00Z',
      read: false,
      type: 'text',
    },
    unreadCount: 2,
    updatedAt: '2024-02-20T10:30:00Z',
  },
  {
    id: '2',
    participants: ['Jane Smith'],
    lastMessage: {
      id: '2',
      senderId: '2',
      receiverId: '1',
      content: 'Thank you for the quick response!',
      timestamp: '2024-02-19T15:45:00Z',
      read: true,
      type: 'text',
    },
    unreadCount: 0,
    updatedAt: '2024-02-19T15:45:00Z',
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: '1',
    content: 'Hi, I\'m interested in your property. Is it still available?',
    timestamp: '2024-02-20T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '2',
    content: 'Yes, it\'s still available! Would you like to schedule a viewing?',
    timestamp: '2024-02-20T10:35:00Z',
    read: true,
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '1',
    content: 'That would be great! What time works for you?',
    timestamp: '2024-02-20T10:40:00Z',
    read: false,
  },
];

export default function Messages() {
  const { user } = useAuthStore();
  const { 
    conversations, 
    activeConversation, 
    messages, 
    setActiveConversation,
    addMessage 
  } = useChatStore();
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Initialize with mock data
    if (conversations.length === 0) {
      mockConversations.forEach(conv => {
        // This would normally be done through API calls
      });
    }
  }, [conversations]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
  };

  const handleSendMessage = (content: string) => {
    if (activeConversation) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        conversationId: activeConversation,
        senderId: user?.id || '1',
        content,
        timestamp: new Date().toISOString(),
        read: false,
      };
      addMessage(newMessage);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter conversations based on search query
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(participant =>
      participant.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="h-screen flex bg-background">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChatSidebar
          conversations={filteredConversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          onSearch={handleSearch}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1"
      >
        <ChatWindow
          conversationId={activeConversation}
          messages={messages.filter(msg => msg.conversationId === activeConversation)}
          onSendMessage={handleSendMessage}
          currentUserId={user?.id || '1'}
        />
      </motion.div>
    </div>
  );
}
