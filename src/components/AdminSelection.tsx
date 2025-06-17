
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '../store/chatStore';
import { MessageCircle, Clock, Users, ArrowLeft } from 'lucide-react';

const AdminSelection: React.FC = () => {
  const { 
    availableAdmins, 
    selectAdmin, 
    setShowAdminSelection, 
    startQueue 
  } = useChatStore();

  const handleSelectAdmin = (adminId: string) => {
    selectAdmin(adminId);
  };

  const handleRandomAssignment = () => {
    setShowAdminSelection(false);
    startQueue();
  };

  const handleBack = () => {
    setShowAdminSelection(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Choose Your Admin
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Select an available admin or get automatically assigned
            </p>
          </div>
        </div>

        {/* Available Admins */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span>Available Admins</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableAdmins.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">No admins available</p>
                <p className="text-gray-400 text-sm">Please try again later or use automatic assignment</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {availableAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleSelectAdmin(admin.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-lg">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {admin.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            Available
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200"
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRandomAssignment}
            size="lg"
            className="flex-1 max-w-sm h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
          >
            <Clock className="h-5 w-5 mr-2" />
            Auto-Assign Admin
          </Button>
          <Button
            variant="outline"
            onClick={handleBack}
            size="lg"
            className="flex-1 max-w-sm h-12 text-base border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSelection;
