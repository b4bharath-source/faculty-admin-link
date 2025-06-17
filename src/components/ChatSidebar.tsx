
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Chat } from '../types/chat';
import { MessageCircle, Clock, CheckCircle, HelpCircle, Archive } from 'lucide-react';

interface ChatSidebarProps {
  chats: Chat[];
  currentUserId: string;
  role: 'faculty' | 'admin';
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chats, currentUserId, role }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Active</Badge>;
      case 'queued':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Queued</Badge>;
      case 'closed':
        return <Badge variant="outline" className="text-xs">Closed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "Click the 'Forgot Password' link on the login page and follow the instructions sent to your email."
    },
    {
      question: "How do I upload documents?",
      answer: "Navigate to the Documents section and click 'Upload New Document'. Supported formats: PDF, DOC, DOCX."
    },
    {
      question: "Where can I view my schedule?",
      answer: "Your teaching schedule is available in the 'My Schedule' section of your faculty portal."
    },
    {
      question: "How do I request time off?",
      answer: "Submit time-off requests through the HR portal. Submit requests at least 2 weeks in advance."
    },
  ];

  return (
    <div className="w-80 xl:w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-sm">
      {/* FAQ Section */}
      <Card className="m-4 mb-3 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center space-x-2 text-gray-800">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-3 w-3 text-blue-600" />
            </div>
            <span>Quick Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`} 
                className="border border-white/60 rounded-lg bg-white/50 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-xs text-left py-3 px-3 hover:no-underline hover:bg-white/70 rounded-lg transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-gray-600 px-3 pb-3 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Chat History */}
      <Card className="mx-4 mb-4 flex-1 border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center space-x-2 text-gray-800">
            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
              <Archive className="h-3 w-3 text-gray-600" />
            </div>
            <span>Chat History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3 overflow-y-auto max-h-96">
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No previous chats</p>
              <p className="text-xs text-gray-400 mt-1">Your chat history will appear here</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(chat.status)}
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {role === 'admin' ? chat.facultyName : chat.adminName || 'Support Admin'}
                    </span>
                  </div>
                  {getStatusBadge(chat.status)}
                </div>
                <div className="text-xs text-gray-600 space-y-1 leading-relaxed">
                  <div className="flex justify-between">
                    <span className="font-medium">Started:</span>
                    <span>{formatDate(chat.createdAt)}</span>
                  </div>
                  {chat.closedAt && (
                    <div className="flex justify-between">
                      <span className="font-medium">Closed:</span>
                      <span>{formatDate(chat.closedAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Messages:</span>
                    <span>{chat.messages.length}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSidebar;
