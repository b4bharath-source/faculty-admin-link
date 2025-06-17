
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '../store/chatStore';
import ChatWindow from './ChatWindow';
import { LogOut, MessageCircle, Users, Clock, Shield } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    chats,
    activeChat,
    sendMessage,
    closeChat,
    setActiveChat,
    logout,
  } = useChatStore();

  if (!currentUser) return null;

  const adminChats = chats.filter(chat => chat.adminId === currentUser.id);
  const activeChats = adminChats.filter(chat => chat.status === 'active');
  const queuedChats = adminChats.filter(chat => chat.status === 'queued');

  const handleChatSelect = (chat: any) => {
    setActiveChat(chat);
  };

  const handleCloseChat = () => {
    if (activeChat) {
      closeChat(activeChat.id);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-blue-100 text-sm">Support Center</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={logout} 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-blue-100 text-sm">Welcome back, {currentUser.name}</p>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">Active</span>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                    {activeChats.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs font-medium text-gray-700">Queue</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                    {queuedChats.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-600" />
            Active Conversations
          </h3>
          <div className="space-y-2">
            {activeChats.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No active chats</p>
                <p className="text-xs text-gray-400">New chats will appear here</p>
              </div>
            ) : (
              activeChats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                    activeChat?.id === chat.id 
                      ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {chat.facultyName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-sm">{chat.facultyName}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate leading-relaxed">
                      {chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeChat ? (
          <ChatWindow
            messages={activeChat.messages}
            currentUserId={currentUser.id}
            recipientName={activeChat.facultyName}
            isTyping={false}
            onSendMessage={sendMessage}
            onCloseChat={handleCloseChat}
            canCloseChat={true}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="text-center space-y-6 max-w-md">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-900">
                  No Chat Selected
                </h3>
                <p className="text-gray-600">
                  Select a conversation from the sidebar to start helping faculty members
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
