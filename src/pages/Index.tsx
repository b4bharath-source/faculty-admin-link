
import React from 'react';
import { useChatStore } from '../store/chatStore';
import LoginForm from '../components/LoginForm';
import FacultyDashboard from '../components/FacultyDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Index = () => {
  const { currentUser, login } = useChatStore();

  const handleLogin = (name: string, role: 'faculty' | 'admin') => {
    login(name, role);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return currentUser.role === 'faculty' ? <FacultyDashboard /> : <AdminDashboard />;
};

export default Index;
