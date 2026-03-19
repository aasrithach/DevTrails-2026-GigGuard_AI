import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import GlobalPoller from './components/GlobalPoller';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';

import LandingPage from './pages/LandingPage';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DemoChecklist from './pages/DemoChecklist';
import TestDashboard from './pages/TestDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
      if (user.role === 'SUPER_ADMIN') return <Navigate to="/admin" replace />;
      return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <GlobalPoller />
      <main className="flex-1 relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/demo-checklist" element={<DemoChecklist />} />
          <Route path="/test-dashboard" element={<TestDashboard />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="WORKER">
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="SUPER_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
