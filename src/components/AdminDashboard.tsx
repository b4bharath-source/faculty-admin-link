
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '../store/chatStore';
import ChatWindow from './ChatWindow';
import { LogOut, MessageCircle, Users, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <Button variant="outline" onClick={logout} size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Active Chats</span>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {activeChats.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">In Queue</span>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {queuedChats.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Active Conversations</h3>
          <div className="space-y-2">
            {activeChats.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No active chats
              </p>
            ) : (
              activeChats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    activeChat?.id === chat.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{chat.facultyName}</span>
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
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
      <div className="flex-1 flex flex-col">
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
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
              <Users className="h-16 w-16 text-gray-400 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  No chat selected
                </h3>
                <p className="text-gray-600">
                  Select a conversation from the sidebar to start chatting
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
