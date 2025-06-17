
import { create } from 'zustand';
import { User, Chat, Message, ChatState } from '../types/chat';

// Mock admin data with availability status
const mockAdmins: User[] = [
  { id: 'admin1', name: 'Dr. Smith', role: 'admin', isOnline: true },
  { id: 'admin2', name: 'Prof. Johnson', role: 'admin', isOnline: true },
  { id: 'admin3', name: 'Ms. Williams', role: 'admin', isOnline: false },
  { id: 'admin4', name: 'Dr. Brown', role: 'admin', isOnline: true },
];

let adminRoundRobinIndex = 0;

interface ChatStore extends ChatState {
  availableAdmins: User[];
  showAdminSelection: boolean;
  login: (name: string, role: 'faculty' | 'admin') => void;
  logout: () => void;
  startQueue: () => void;
  selectAdmin: (adminId: string) => void;
  assignAdmin: () => void;
  sendMessage: (content: string) => void;
  closeChat: (chatId: string) => void;
  setActiveChat: (chat: Chat | null) => void;
  setTyping: (isTyping: boolean) => void;
  simulateAdminResponse: () => void;
  setShowAdminSelection: (show: boolean) => void;
  getAvailableAdmins: () => User[];
  getAllChatsForFaculty: (facultyId: string) => Chat[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentUser: null,
  chats: [],
  activeChat: null,
  isTyping: false,
  queuePosition: 1,
  isInQueue: false,
  availableAdmins: mockAdmins.filter(admin => admin.isOnline),
  showAdminSelection: false,

  login: (name: string, role: 'faculty' | 'admin') => {
    const user: User = {
      id: `${role}_${Date.now()}`,
      name,
      role,
      isOnline: true,
    };
    
    // Generate some mock chat history for faculty users
    if (role === 'faculty') {
      const mockChats: Chat[] = [
        {
          id: 'chat_1',
          facultyId: user.id,
          facultyName: user.name,
          adminId: 'admin1',
          adminName: 'Dr. Smith',
          status: 'closed',
          messages: [
            {
              id: 'msg_1',
              chatId: 'chat_1',
              senderId: 'admin1',
              senderName: 'Dr. Smith',
              content: 'Hello! How can I help you today?',
              timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
              type: 'text',
            },
            {
              id: 'msg_2',
              chatId: 'chat_1',
              senderId: user.id,
              senderName: user.name,
              content: 'I need help with password reset.',
              timestamp: new Date(Date.now() - 86400000 * 3),
              type: 'text',
            },
            {
              id: 'msg_3',
              chatId: 'chat_1',
              senderId: 'admin1',
              senderName: 'Dr. Smith',
              content: 'Sure! I can help you with that. Let me guide you through the process.',
              timestamp: new Date(Date.now() - 86400000 * 3 + 120000),
              type: 'text',
            },
          ],
          createdAt: new Date(Date.now() - 86400000 * 3),
          closedAt: new Date(Date.now() - 86400000 * 3 + 3600000),
        },
        {
          id: 'chat_2',
          facultyId: user.id,
          facultyName: user.name,
          adminId: 'admin2',
          adminName: 'Prof. Johnson',
          status: 'closed',
          messages: [
            {
              id: 'msg_4',
              chatId: 'chat_2',
              senderId: 'admin2',
              senderName: 'Prof. Johnson',
              content: 'Hi there! What can I assist you with?',
              timestamp: new Date(Date.now() - 86400000 * 7), // 7 days ago
              type: 'text',
            },
            {
              id: 'msg_5',
              chatId: 'chat_2',
              senderId: user.id,
              senderName: user.name,
              content: 'I have questions about the new grading system.',
              timestamp: new Date(Date.now() - 86400000 * 7 + 60000),
              type: 'text',
            },
          ],
          createdAt: new Date(Date.now() - 86400000 * 7),
          closedAt: new Date(Date.now() - 86400000 * 7 + 1800000),
        },
        {
          id: 'chat_3',
          facultyId: user.id,
          facultyName: user.name,
          adminId: 'admin4',
          adminName: 'Dr. Brown',
          status: 'closed',
          messages: [
            {
              id: 'msg_6',
              chatId: 'chat_3',
              senderId: 'admin4',
              senderName: 'Dr. Brown',
              content: 'Hello! How can I help you today?',
              timestamp: new Date(Date.now() - 86400000 * 1), // 1 day ago
              type: 'text',
            },
            {
              id: 'msg_7',
              chatId: 'chat_3',
              senderId: user.id,
              senderName: user.name,
              content: 'I need access to the faculty portal.',
              timestamp: new Date(Date.now() - 86400000 * 1 + 30000),
              type: 'text',
            },
          ],
          createdAt: new Date(Date.now() - 86400000 * 1),
          closedAt: new Date(Date.now() - 86400000 * 1 + 900000),
        },
      ];
      set({ currentUser: user, chats: mockChats });
    } else {
      set({ currentUser: user });
    }
  },

  logout: () => {
    set({
      currentUser: null,
      chats: [],
      activeChat: null,
      isTyping: false,
      isInQueue: false,
      showAdminSelection: false,
    });
  },

  startQueue: () => {
    set({ isInQueue: true });
    // Simulate 5-second queue time
    setTimeout(() => {
      get().assignAdmin();
    }, 5000);
  },

  selectAdmin: (adminId: string) => {
    const { currentUser, chats } = get();
    if (!currentUser || currentUser.role !== 'faculty') return;

    const selectedAdmin = mockAdmins.find(admin => admin.id === adminId);
    if (!selectedAdmin || !selectedAdmin.isOnline) return;

    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      adminId: selectedAdmin.id,
      adminName: selectedAdmin.name,
      status: 'active',
      messages: [
        {
          id: `msg_${Date.now()}`,
          chatId: `chat_${Date.now()}`,
          senderId: selectedAdmin.id,
          senderName: selectedAdmin.name,
          content: `Hello ${currentUser.name}! I'm ${selectedAdmin.name}. How can I help you today?`,
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
      showAdminSelection: false,
    });
  },

  assignAdmin: () => {
    const { currentUser, chats } = get();
    if (!currentUser || currentUser.role !== 'faculty') return;

    // Round-robin admin selection from available admins
    const availableAdmins = mockAdmins.filter(admin => admin.isOnline);
    if (availableAdmins.length === 0) return;

    const assignedAdmin = availableAdmins[adminRoundRobinIndex % availableAdmins.length];
    adminRoundRobinIndex = (adminRoundRobinIndex + 1) % availableAdmins.length;

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

  setShowAdminSelection: (show: boolean) => {
    set({ showAdminSelection: show });
  },

  getAvailableAdmins: () => {
    return mockAdmins.filter(admin => admin.isOnline);
  },

  getAllChatsForFaculty: (facultyId: string) => {
    const { chats } = get();
    return chats.filter(chat => chat.facultyId === facultyId);
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
