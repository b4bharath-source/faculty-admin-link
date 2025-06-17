
export interface User {
  id: string;
  name: string;
  role: 'faculty' | 'admin';
  avatar?: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

export interface Chat {
  id: string;
  facultyId: string;
  facultyName: string;
  adminId?: string;
  adminName?: string;
  status: 'queued' | 'active' | 'closed';
  messages: Message[];
  createdAt: Date;
  closedAt?: Date;
}

export interface ChatState {
  currentUser: User | null;
  chats: Chat[];
  activeChat: Chat | null;
  isTyping: boolean;
  queuePosition: number;
  isInQueue: boolean;
  availableAdmins: User[];
  showAdminSelection: boolean;
}
