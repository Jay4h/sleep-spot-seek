import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, ChatMessage } from '@/types';

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: ChatMessage[];
  unreadCount: number;
  setActiveConversation: (conversationId: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  markMessagesAsRead: (conversationId: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversation: null,
      messages: [],
      unreadCount: 0,
      setActiveConversation: (conversationId) => {
        set({ activeConversation: conversationId });
        if (conversationId) {
          get().markMessagesAsRead(conversationId);
        }
      },
      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
          unreadCount: message.read ? state.unreadCount : state.unreadCount + 1,
        }));
      },
      addConversation: (conversation) => {
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        }));
      },
      updateConversation: (conversationId, updates) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, ...updates } : c
          ),
        }));
      },
      markMessagesAsRead: (conversationId) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.conversationId === conversationId ? { ...m, read: true } : m
          ),
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },
      clearChat: () => {
        set({ conversations: [], messages: [], unreadCount: 0, activeConversation: null });
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);
