
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Chat } from '../types/chat';
import { MessageCircle, Clock, CheckCircle, HelpCircle } from 'lucide-react';

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
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'queued':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Queued</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking the 'Forgot Password' link on the login page and following the instructions sent to your email."
    },
    {
      question: "How do I upload documents?",
      answer: "Navigate to the Documents section in your dashboard and click 'Upload New Document'. Supported formats include PDF, DOC, and DOCX."
    },
    {
      question: "Where can I view my schedule?",
      answer: "Your teaching schedule is available in the 'My Schedule' section of your faculty portal. You can also sync it with your calendar app."
    },
    {
      question: "How do I request time off?",
      answer: "Submit time-off requests through the HR portal. Make sure to submit requests at least 2 weeks in advance for approval."
    },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* FAQ Section */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span>Quick Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Accordion type="single" collapsible className="space-y-1">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border-none">
                <AccordionTrigger className="text-xs text-left py-2 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-gray-600 pb-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Chat History */}
      <Card className="mx-4 mb-4 flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Chat History</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {chats.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No previous chats</p>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(chat.status)}
                    <span className="text-sm font-medium">
                      {role === 'admin' ? chat.facultyName : chat.adminName}
                    </span>
                  </div>
                  {getStatusBadge(chat.status)}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Started: {formatDate(chat.createdAt)}</p>
                  {chat.closedAt && (
                    <p>Closed: {formatDate(chat.closedAt)}</p>
                  )}
                  <p>{chat.messages.length} messages</p>
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
