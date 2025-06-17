
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Users, UserCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Faculty-Admin Chat
          </CardTitle>
          <CardDescription className="text-gray-600">
            Connect with admins for instant support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label>Select Role</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as 'faculty' | 'admin')}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="faculty" id="faculty" />
                  <Users className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="faculty" className="flex-1 cursor-pointer">
                    Faculty Member
                    <p className="text-sm text-gray-500">Get support from admin staff</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="admin" id="admin" />
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <Label htmlFor="admin" className="flex-1 cursor-pointer">
                    Administrator
                    <p className="text-sm text-gray-500">Provide support to faculty</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Start Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
