
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, MessageCircle, HelpCircle } from 'lucide-react';

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
    {
      question: "Who do I contact for technical issues?",
      answer: "For technical support, you can either use this chat system or email support@university.edu. Response time is typically within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Queue status */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Connecting you to an admin{dots}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Please wait while we connect you to an available administrator.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Estimated wait time: {countdown} seconds</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - FAQ */}
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-2">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-4">
              <AccordionTrigger className="text-left text-sm font-medium text-gray-700">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pt-2">
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
