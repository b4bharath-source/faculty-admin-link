
import React from 'react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import QueueScreen from './QueueScreen';
import ChatWindow from './ChatWindow';
import ChatSidebar from './ChatSidebar';
import AdminSelection from './AdminSelection';
import { LogOut, MessageCircle, Headphones, Users } from 'lucide-react';

const FacultyDashboard: React.FC = () => {
  const {
    currentUser,
    chats,
    activeChat,
    isInQueue,
    showAdminSelection,
    startQueue,
    sendMessage,
    logout,
    setShowAdminSelection,
  } = useChatStore();

  if (!currentUser) return null;

  const handleStartChat = () => {
    setShowAdminSelection(true);
  };

  const handleQuickStart = () => {
    startQueue();
  };

  const handleQueueComplete = () => {
    // Queue completion is handled by the store
  };

  if (isInQueue) {
    return <QueueScreen onComplete={handleQueueComplete} />;
  }

  if (showAdminSelection) {
    return <AdminSelection />;
  }

  if (!activeChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center space-y-8 max-w-md w-full">
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Headphones className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome, {currentUser.name}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Ready to connect with our support team?
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleStartChat} 
              size="lg" 
              className="w-full max-w-sm h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
            >
              <Users className="h-5 w-5 mr-2" />
              Choose Admin
            </Button>
            <Button 
              onClick={handleQuickStart} 
              variant="outline"
              size="lg" 
              className="w-full max-w-sm h-12 text-base border-blue-300 hover:bg-blue-50 text-blue-700"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Quick Start (Auto-Assign)
            </Button>
            <Button 
              variant="outline" 
              onClick={logout} 
              className="w-full max-w-sm h-12 text-base border-gray-300 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Show chat history if exists */}
          {chats.length > 0 && (
            <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Conversations</h3>
              <p className="text-xs text-gray-500">{chats.length} chat{chats.length !== 1 ? 's' : ''} in history</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header - Hidden on mobile when chat is active, visible on desktop */}
        <div className="hidden lg:flex bg-white border-b border-gray-200 px-4 sm:px-6 py-4 items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Faculty Support
            </h1>
          </div>
          <Button variant="outline" onClick={logout} size="sm" className="hover:bg-gray-50">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Chat Window */}
        <div className="flex-1 min-h-0">
          <ChatWindow
            messages={activeChat.messages}
            currentUserId={currentUser.id}
            recipientName={activeChat.adminName || 'Support Admin'}
            isTyping={false}
            onSendMessage={sendMessage}
          />
        </div>
      </div>

      {/* Sidebar - Hidden on mobile, visible on tablet+ */}
      <div className="hidden lg:block">
        <ChatSidebar
          chats={chats}
          currentUserId={currentUser.id}
          role="faculty"
        />
      </div>
    </div>
  );
};

export default FacultyDashboard;
