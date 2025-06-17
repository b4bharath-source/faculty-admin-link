
import React from 'react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import QueueScreen from './QueueScreen';
import ChatWindow from './ChatWindow';
import AdminSelection from './AdminSelection';
import { LogOut, MessageCircle, Headphones, Users, UserCheck, Clock } from 'lucide-react';

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
    getAvailableAdmins,
    selectAdmin,
    getAllChatsForFaculty,
  } = useChatStore();

  if (!currentUser) return null;

  const availableAdmins = getAvailableAdmins();
  const facultyChats = getAllChatsForFaculty(currentUser.id);
  const [selectedAdminId, setSelectedAdminId] = React.useState<string | null>(null);

  // Get chats for selected admin
  const selectedAdminChats = selectedAdminId 
    ? facultyChats.filter(chat => chat.adminId === selectedAdminId)
    : [];

  const handleStartChat = () => {
    setShowAdminSelection(true);
  };

  const handleQuickStart = () => {
    startQueue();
  };

  const handleQueueComplete = () => {
    // Queue completion is handled by the store
  };

  const handleAdminSelect = (adminId: string) => {
    setSelectedAdminId(adminId);
  };

  const handleStartChatWithAdmin = (adminId: string) => {
    selectAdmin(adminId);
    setSelectedAdminId(adminId);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  if (isInQueue) {
    return <QueueScreen onComplete={handleQueueComplete} />;
  }

  if (showAdminSelection) {
    return <AdminSelection />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Panel - Admin List (WhatsApp style) */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Headphones className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  Faculty Support
                </h1>
                <p className="text-blue-100 text-sm">Choose an Admin</p>
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
          <p className="text-blue-100 text-sm">Welcome, {currentUser.name}</p>
        </div>

        {/* Admin List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-600" />
              Available Admins
            </h3>
            <div className="space-y-2">
              {availableAdmins.map((admin) => {
                const adminChats = facultyChats.filter(chat => chat.adminId === admin.id);
                const lastChat = adminChats[adminChats.length - 1];
                const isSelected = selectedAdminId === admin.id;
                
                return (
                  <div
                    key={admin.id}
                    onClick={() => handleAdminSelect(admin.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {admin.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{admin.name}</h4>
                          <p className="text-xs text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Online
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {lastChat && (
                      <div className="text-xs text-gray-500 mb-2">
                        Last chat: {formatTime(lastChat.createdAt)}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-600">
                      {adminChats.length} conversation{adminChats.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedAdminId ? (
          <div className="flex-1 flex flex-col">
            {/* Selected Admin Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {availableAdmins.find(a => a.id === selectedAdminId)?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {availableAdmins.find(a => a.id === selectedAdminId)?.name}
                    </h2>
                    <p className="text-sm text-green-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleStartChatWithAdmin(selectedAdminId)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </div>

            {/* Chat History or Active Chat */}
            <div className="flex-1 min-h-0">
              {activeChat && activeChat.adminId === selectedAdminId ? (
                <ChatWindow
                  messages={activeChat.messages}
                  currentUserId={currentUser.id}
                  recipientName={activeChat.adminName || 'Support Admin'}
                  isTyping={false}
                  onSendMessage={sendMessage}
                />
              ) : selectedAdminChats.length > 0 ? (
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Chat History with {availableAdmins.find(a => a.id === selectedAdminId)?.name}
                  </h3>
                  <div className="space-y-4">
                    {selectedAdminChats.map((chat) => (
                      <div key={chat.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {new Intl.DateTimeFormat('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }).format(chat.createdAt)}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            chat.status === 'closed' 
                              ? 'bg-gray-100 text-gray-600' 
                              : chat.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {chat.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                        </div>
                        {chat.messages[chat.messages.length - 1] && (
                          <div className="mt-2 text-sm text-gray-800 line-clamp-2">
                            <strong>Last:</strong> {chat.messages[chat.messages.length - 1].content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium text-gray-900">
                        No chat history
                      </h3>
                      <p className="text-gray-600">
                        Start your first conversation with {availableAdmins.find(a => a.id === selectedAdminId)?.name}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleStartChatWithAdmin(selectedAdminId)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // No admin selected - show auto-select option
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="text-center space-y-8 max-w-md">
              <div className="space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserCheck className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Choose an Admin
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Select an admin from the left panel or get auto-assigned
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleQuickStart} 
                  size="lg" 
                  className="w-full max-w-sm h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Auto-Assign Admin
                </Button>
                
                <p className="text-sm text-gray-500">
                  Or select a specific admin from the list on the left
                </p>
              </div>

              {/* Show total conversations */}
              {facultyChats.length > 0 && (
                <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Your Conversations</h3>
                  <p className="text-xs text-gray-500">
                    {facultyChats.length} total conversation{facultyChats.length !== 1 ? 's' : ''} across all admins
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
