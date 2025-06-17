
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Users, UserCheck, MessageCircle } from 'lucide-react';

interface LoginFormProps {
  onLogin: (name: string, role: 'faculty' | 'admin') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'faculty' | 'admin'>('faculty');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim(), role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Support</h1>
          <p className="text-gray-600">Connect instantly with admin support</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to start your support session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Select Your Role</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(value) => setRole(value as 'faculty' | 'admin')}
                  className="space-y-3"
                >
                  <div className="relative">
                    <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                      <RadioGroupItem value="faculty" id="faculty" className="text-blue-600" />
                      <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <Label htmlFor="faculty" className="text-sm font-medium text-gray-900 cursor-pointer">
                          Faculty Member
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">Get instant support from our admin team</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 cursor-pointer">
                      <RadioGroupItem value="admin" id="admin" className="text-green-600" />
                      <UserCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <Label htmlFor="admin" className="text-sm font-medium text-gray-900 cursor-pointer">
                          Administrator
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">Provide support and assistance to faculty</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
              >
                Start Support Session
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
