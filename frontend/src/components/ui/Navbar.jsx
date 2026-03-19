import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Bell, 
  LayoutDashboard, 
  ShieldCheck, 
  FileText, 
  TrendingUp,
  Settings,
  HelpCircle,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = {
    public: [
      { name: 'How it Works', path: '/#how-it-works' },
      { name: 'Coverage', path: '/#coverage' },
      { name: 'API Status', path: '/test-dashboard' },
    ],
    worker: [
      { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
      { name: 'Policies', path: '/dashboard', icon: <ShieldCheck size={18} /> },
      { name: 'Claims', path: '/dashboard', icon: <FileText size={18} /> },
      { name: 'Earnings', path: '/dashboard', icon: <TrendingUp size={18} /> },
    ],
    admin: [
      { name: 'Control Room', path: '/admin', icon: <LayoutDashboard size={18} /> },
      { name: 'Claims Manager', path: '/admin', icon: <FileText size={18} /> },
      { name: 'Fraud Analytics', path: '/admin', icon: <Activity size={18} /> },
      { name: 'System Logs', path: '/test-dashboard', icon: <Settings size={18} /> },
    ]
  };

  const currentRole = user ? (user.role === 'SUPER_ADMIN' ? 'admin' : 'worker') : 'public';
  const activeLinks = navLinks[currentRole];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 px-4 sm:px-6' 
          : 'py-5 px-4 sm:px-8'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto transition-all duration-500 rounded-2xl border transition-all ${
          isScrolled 
            ? 'glass-strong shadow-2xl border-white/10' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-teal-500/20 rounded-xl group-hover:bg-teal-500/30 transition-colors border border-teal-500/30">
              <Shield className="text-teal-400 h-6 w-6" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              GigGuard <span className="text-teal-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {activeLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3 mr-2">
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-teal-400 rounded-full border-2 border-[#1e293b]"></span>
                  </button>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                      <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mt-1">{user.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 p-[1px]">
                      <div className="w-full h-full rounded-[10px] bg-[#0A0F1E] flex items-center justify-center">
                        <User size={18} className="text-teal-400" />
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  <span>Get Protected</span>
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4"
          >
            <div className="glass-strong border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4 space-y-2">
              {activeLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon || <HelpCircle size={18} />}
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
              {!user && (
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center w-full p-3 rounded-xl text-white font-bold bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center w-full p-3 rounded-xl text-white font-bold bg-teal-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Protected
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
