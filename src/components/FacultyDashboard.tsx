
import React from 'react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import QueueScreen from './QueueScreen';
import ChatWindow from './ChatWindow';
import ChatSidebar from './ChatSidebar';
import { LogOut } from 'lucide-react';

const FacultyDashboard: React.FC = () => {
  const {
    currentUser,
    chats,
    activeChat,
    isInQueue,
    startQueue,
    sendMessage,
    logout,
  } = useChatStore();

  if (!currentUser) return null;

  const handleStartChat = () => {
    startQueue();
  };

  const handleQueueComplete = () => {
    // Queue completion is handled by the store
  };

  if (isInQueue) {
    return <QueueScreen onComplete={handleQueueComplete} />;
  }

  if (!activeChat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-gray-600">
              Ready to connect with an administrator?
            </p>
          </div>
          <div className="space-y-3">
            <Button onClick={handleStartChat} size="lg" className="w-full max-w-sm">
              Start New Chat
            </Button>
            <Button variant="outline" onClick={logout} className="w-full max-w-sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Faculty Support Chat
          </h1>
          <Button variant="outline" onClick={logout} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          <ChatWindow
            messages={activeChat.messages}
            currentUserId={currentUser.id}
            recipientName={activeChat.adminName || 'Admin'}
            isTyping={false}
            onSendMessage={sendMessage}
          />
        </div>
      </div>

      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        currentUserId={currentUser.id}
        role="faculty"
      />
    </div>
  );
};

export default FacultyDashboard;
