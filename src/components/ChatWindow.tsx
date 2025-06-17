
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MoreVertical, Phone, Video, ArrowLeft, X } from 'lucide-react';
import { Message } from '../types/chat';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  recipientName: string;
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onCloseChat?: () => void;
  canCloseChat?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  currentUserId,
  recipientName,
  isTyping,
  onSendMessage,
  onCloseChat,
  canCloseChat = false,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          {/* Mobile back button - only visible on small screens */}
          <Button variant="ghost" size="sm" className="lg:hidden p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Avatar className="h-10 w-10 ring-2 ring-blue-100">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm">
              {getInitials(recipientName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{recipientName}</h3>
            <p className="text-sm text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
            <Phone className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
            <Video className="h-4 w-4 text-gray-600" />
          </Button>
          {canCloseChat && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCloseChat}
              className="p-2 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Start your conversation</p>
          </div>
        )}
        
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={cn(
                "flex items-end space-x-2",
                isCurrentUser ? "justify-end" : "justify-start"
              )}
            >
              {!isCurrentUser && (
                <Avatar className="h-6 w-6 mb-1">
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                    {getInitials(recipientName)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex flex-col max-w-xs sm:max-w-sm lg:max-w-md">
                <div
                  className={cn(
                    "px-4 py-2 rounded-2xl shadow-sm",
                    isCurrentUser
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                  )}
                >
                  <p className="text-sm leading-relaxed break-words">{message.content}</p>
                </div>
                <p
                  className={cn(
                    "text-xs mt-1 px-1",
                    isCurrentUser ? "text-right text-gray-500" : "text-left text-gray-500"
                  )}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex items-end space-x-2 justify-start">
            <Avatar className="h-6 w-6 mb-1">
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                {getInitials(recipientName)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSend} className="flex space-x-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full px-4"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
