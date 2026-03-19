import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Home, ShieldCheck, FileText, Bell, User, LogOut, Activity, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItemClass = (path) => `
    flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium
    ${location.pathname === path 
      ? 'bg-primary/10 text-primary' 
      : 'text-textSecondary hover:text-textPrimary hover:bg-white/5'}
  `;

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="text-primary h-8 w-8" />
            <span className="font-display font-bold text-xl text-textPrimary tracking-tight">GigGuard <span className="text-primary">AI</span></span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {user.role === 'WORKER' ? (
                <>
                  <Link to="/dashboard" className={navItemClass('/dashboard')}>
                    <Home size={18} /> Dashboard
                  </Link>
                  <Link to="/dashboard" className={navItemClass('/coverage')}>
                    <ShieldCheck size={18} /> Coverage
                  </Link>
                  <Link to="/dashboard" className={navItemClass('/claims')}>
                    <FileText size={18} /> Claims
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/admin" className={navItemClass('/admin')}>
                    <Monitor size={18} /> Dashboard
                  </Link>
                  <Link to="/admin" className={navItemClass('/admin/claims')}>
                    <FileText size={18} /> Claims
                  </Link>
                  <Link to="/admin" className={navItemClass('/admin/fraud')}>
                    <Activity size={18} /> Fraud Monitor
                  </Link>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button className="text-textSecondary hover:text-primary transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                </button>
                <div className="h-6 w-px bg-border mx-2"></div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-medium text-textPrimary">{user.name}</span>
                    <span className="text-xs text-textSecondary">{user.role}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-seondary flex items-center justify-center border border-border">
                    <User size={16} className="text-background" />
                  </div>
                  <button onClick={handleLogout} className="text-textSecondary hover:text-danger ml-2" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary hover:bg-teal-400 text-background font-medium px-4 py-2 rounded-md transition-colors text-sm">
                  Get Protected
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
