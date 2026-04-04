import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWorker } from '../api/authService';
import { useToast } from '../context/ToastContext';
import { Shield, Lock, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import PageBackground from '../components/ui/PageBackground';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorInput(false);
    try {
      const res = await loginWorker({ phone, password });
      login({ id: res.data.id, name: res.data.name, role: res.data.role }, res.data.token);
      addToast?.({ title: 'Successfully logged in!', type: 'success' });
      navigate('/dashboard');
    } catch (err) {
      setErrorInput(true);
      addToast?.({ title: err.response?.data || 'Invalid credentials', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper min-h-screen bg-gray-950 pt-32 pb-12 px-4 flex flex-col items-center">
      <PageBackground />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-white font-bold text-4xl mb-2 flex items-center justify-center gap-2">🛡️ GigGuard AI</h1>
          <p className="text-gray-400 text-sm italic">"Disruption hits. We pay. You deliver."</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-500 ${errorInput ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-teal-400 to-indigo-500'}`}></div>

          <h2 className="text-3xl font-display font-bold text-white mb-2 text-center tracking-tight">Welcome Warrior</h2>
          <p className="text-slate-500 text-sm mb-10 text-center font-medium">Authentication required to access dashboard</p>

          {errorInput && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border border-red-500/20 bg-red-500/5 p-4 rounded-xl flex items-center gap-3 mb-8"
            >
              <AlertCircle className="text-red-400 shrink-0" size={20} />
              <p className="text-red-400 text-xs font-bold leading-tight">Invalid credentials detected. Please check your credentials and try again.</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Identity</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  required
                  className={`input-glass pl-12 ${errorInput ? 'border-red-500/30' : ''}`}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrorInput(false); }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Security Pin</label>
                <a href="#" className="text-[10px] font-bold text-teal-500 hover:text-teal-400 transition-colors uppercase tracking-widest">Forgot Pin?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className={`input-glass pl-12 ${errorInput ? 'border-red-500/30' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorInput(false); }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-10 h-14"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-bold tracking-wide">Validating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 group">
                  <span className="font-bold tracking-wide">Access Dashboard</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <p className="text-slate-500 text-xs font-semibold">
              Don't have an account? 
              <Link to="/register" className="ml-2 text-teal-400 hover:text-teal-300 transition-colors">Create Identity →</Link>
            </p>
            
            <Link to="/admin/login" className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-white/10 hover:text-slate-300 transition-all">
              System Administrator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
