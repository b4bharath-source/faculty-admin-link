
import { create } from 'zustand';
import { User, Chat, Message, ChatState } from '../types/chat';

// Mock admin data for round-robin assignment
const mockAdmins: User[] = [
  { id: 'admin1', name: 'Dr. Smith', role: 'admin', isOnline: true },
  { id: 'admin2', name: 'Prof. Johnson', role: 'admin', isOnline: true },
  { id: 'admin3', name: 'Ms. Williams', role: 'admin', isOnline: true },
];

let adminRoundRobinIndex = 0;

interface ChatStore extends ChatState {
  login: (name: string, role: 'faculty' | 'admin') => void;
  logout: () => void;
  startQueue: () => void;
  assignAdmin: () => void;
  sendMessage: (content: string) => void;
  closeChat: (chatId: string) => void;
  setActiveChat: (chat: Chat | null) => void;
  setTyping: (isTyping: boolean) => void;
  simulateAdminResponse: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentUser: null,
  chats: [],
  activeChat: null,
  isTyping: false,
  queuePosition: 1,
  isInQueue: false,

  login: (name: string, role: 'faculty' | 'admin') => {
    const user: User = {
      id: `${role}_${Date.now()}`,
      name,
      role,
      isOnline: true,
    };
    set({ currentUser: user });
  },

  logout: () => {
    set({
      currentUser: null,
      chats: [],
      activeChat: null,
      isTyping: false,
      isInQueue: false,
    });
  },

  startQueue: () => {
    set({ isInQueue: true });
    // Simulate 5-second queue time
    setTimeout(() => {
      get().assignAdmin();
    }, 5000);
  },

  assignAdmin: () => {
    const { currentUser, chats } = get();
    if (!currentUser || currentUser.role !== 'faculty') return;

    // Round-robin admin selection
    const assignedAdmin = mockAdmins[adminRoundRobinIndex];
    adminRoundRobinIndex = (adminRoundRobinIndex + 1) % mockAdmins.length;

    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      adminId: assignedAdmin.id,
      adminName: assignedAdmin.name,
      status: 'active',
      messages: [
        {
          id: `msg_${Date.now()}`,
          chatId: `chat_${Date.now()}`,
          senderId: assignedAdmin.id,
          senderName: assignedAdmin.name,
          content: `Hello ${currentUser.name}! I'm ${assignedAdmin.name}. How can I help you today?`,
          timestamp: new Date(),
          type: 'text',
        },
      ],
      createdAt: new Date(),
    };

    set({
      chats: [...chats, newChat],
      activeChat: newChat,
      isInQueue: false,
    });
  },

  sendMessage: (content: string) => {
    const { currentUser, activeChat, chats } = get();
    if (!currentUser || !activeChat) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeChat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content,
      timestamp: new Date(),
      type: 'text',
    };

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
    };

    const updatedChats = chats.map(chat =>
      chat.id === activeChat.id ? updatedChat : chat
    );

    set({
      chats: updatedChats,
      activeChat: updatedChat,
    });

    // Simulate admin response after faculty message
    if (currentUser.role === 'faculty') {
      setTimeout(() => {
        get().simulateAdminResponse();
      }, 1000 + Math.random() * 2000);
    }
  },

  simulateAdminResponse: () => {
    const { activeChat, chats } = get();
    if (!activeChat || !activeChat.adminId) return;

    const responses = [
      "I understand your concern. Let me look into this for you.",
      "That's a great question! Here's what I can tell you...",
      "I'll need to check with the department on this. Give me a moment.",
      "Thanks for bringing this to my attention. I'll help you resolve this.",
      "Let me pull up your records to give you the most accurate information.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const adminMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeChat.id,
      senderId: activeChat.adminId,
      senderName: activeChat.adminName || 'Admin',
      content: randomResponse,
      timestamp: new Date(),
      type: 'text',
    };

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, adminMessage],
    };

    const updatedChats = chats.map(chat =>
      chat.id === activeChat.id ? updatedChat : chat
    );

    set({
      chats: updatedChats,
      activeChat: updatedChat,
    });
  },

  closeChat: (chatId: string) => {
    const { chats } = get();
    const updatedChats = chats.map(chat =>
      chat.id === chatId
        ? { ...chat, status: 'closed' as const, closedAt: new Date() }
        : chat
    );
    set({ chats: updatedChats, activeChat: null });
  },

  setActiveChat: (chat: Chat | null) => {
    set({ activeChat: chat });
  },

  setTyping: (isTyping: boolean) => {
    set({ isTyping });
  },
}));
