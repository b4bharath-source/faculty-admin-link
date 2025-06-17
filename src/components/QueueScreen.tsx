
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, MessageCircle, HelpCircle, Loader2 } from 'lucide-react';

interface QueueScreenProps {
  onComplete: () => void;
}

const QueueScreen: React.FC<QueueScreenProps> = ({ onComplete }) => {
  const [dots, setDots] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(countdownInterval);
    };
  }, [onComplete]);

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "Click the 'Forgot Password' link on the login page and follow the instructions sent to your email."
    },
    {
      question: "How do I upload documents?",
      answer: "Navigate to the Documents section in your dashboard and click 'Upload New Document'. Supported formats include PDF, DOC, and DOCX."
    },
    {
      question: "Where can I view my schedule?",
      answer: "Your teaching schedule is available in the 'My Schedule' section of your faculty portal."
    },
    {
      question: "How do I request time off?",
      answer: "Submit time-off requests through the HR portal. Submit requests at least 2 weeks in advance."
    },
    {
      question: "Technical support contact?",
      answer: "Use this chat system or email support@university.edu. Response time is typically within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col lg:flex-row">
      {/* Main Queue Status - Full width on mobile, left side on desktop */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-lg shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Connecting you to support{dots}
            </CardTitle>
            <p className="text-gray-600 text-base sm:text-lg">
              Please wait while we connect you to an available administrator
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-center space-x-3 text-blue-700 mb-3">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Estimated wait time: {countdown} seconds</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Average response time is under 30 seconds
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section - Full width on mobile, right side on desktop */}
      <div className="w-full lg:w-96 xl:w-[420px] bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 sm:p-6 overflow-y-auto">
        <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Quick Help</h2>
          </div>
          <p className="text-sm text-gray-600">Find answers while you wait</p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="border border-gray-200 rounded-xl px-4 hover:shadow-md transition-shadow duration-200"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-gray-800 hover:text-blue-600 py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pb-4 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default QueueScreen;
