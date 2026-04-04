import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerWorker } from '../api/authService';
import { previewCoverage } from '../api/policyService';
import { useToast } from '../context/ToastContext';
import { Shield, ChevronRight, ArrowLeft, User, Phone, Mail, Lock, CheckCircle2, MapPin, Wallet, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import PageBackground from '../components/ui/PageBackground';
import Navbar from '../components/ui/Navbar';

const REGISTER_STEPS = 3;

const PLATFORMS = [
  { id: 'ZEPTO', name: 'Zepto', icon: '🧺', color: 'from-purple-500 to-indigo-600' },
  { id: 'BLINKIT', name: 'Blinkit', icon: '⚡', color: 'from-yellow-400 to-amber-600' },
  { id: 'SWIGGY_INSTAMART', name: 'Swiggy', icon: '🟠', color: 'from-orange-400 to-red-600' },
  { id: 'ZOMATO', name: 'Zomato', icon: '🔴', color: 'from-red-500 to-rose-700' },
  { id: 'AMAZON', name: 'Amazon', icon: '📦', color: 'from-blue-400 to-cyan-600' }
];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '',
    platform: 'ZEPTO', zone: 'Kondapur', avgDailyIncome: 1000
  });

  const [previewData, setPreviewData] = useState(null);
  const [zones, setZones] = useState([
    'Kondapur', 'Miyapur', 'Hitech City', 'Gachibowli', 'Madhapur', 
    'LB Nagar', 'Kukatpally', 'Ameerpet', 'Dilsukhnagar', 'Secunderabad'
  ]);

  useEffect(() => {
    const fetchZones = async () => {
      const FALLBACK_ZONES = [
        'Kondapur', 'Miyapur', 'Hitech City',
        'Gachibowli', 'Madhapur', 'LB Nagar',
        'Kukatpally', 'Ameerpet', 
        'Dilsukhnagar', 'Secunderabad'
      ];

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const res = await fetch('/api/demo/zones', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error('offline');
        const data = await res.json();
        setZones(data?.data || FALLBACK_ZONES);
      } catch (err) {
        setZones(FALLBACK_ZONES);
      }
    };

    fetchZones();
  }, []);

  const AnimatedPremium = ({ target }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
      setVal(0);
      let start = 0;
      const duration = 1500;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setVal(target);
          clearInterval(timer);
        } else {
          setVal(Math.floor(start));
        }
      }, stepTime);
      return () => clearInterval(timer);
    }, [target]);
    return <span>₹{val.toFixed(0)}</span>;
  };

  const handleNext = async () => {
    if (step === 2) {
      setLoading(true);
      try {
        const res = await previewCoverage({
          zone: formData.zone,
          avgDailyIncome: formData.avgDailyIncome
        });
        setPreviewData(res.data);
        setStep(3);
      } catch (err) {
        addToast?.({ title: 'Preview Failed', type: 'error' });
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await registerWorker(formData);
      const token = res.data.token;
      localStorage.setItem('token', token);
      
      try {
        const { createPolicy } = await import('../api/policyService');
        await createPolicy();
      } catch (e) {
        console.log("Policy creation failed, ignoring for demo");
      }
      
      login({ id: res.data.id, name: res.data.name, role: res.data.role }, token);
      
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#14B8A6', '#FCD34D', '#818CF8', '#F472B6']
      });

      addToast?.({ title: 'Registration Successful!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 2500);

    } catch (err) {
      addToast?.({ title: 'Registration Failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.name.trim() && formData.phone.length >= 10 && formData.email.includes('@') && formData.password.length >= 6;

  return (
    <div className="page-wrapper min-h-screen bg-gray-950">
      <PageBackground />
      <Navbar />
      
      <div className="relative z-10 w-full max-w-3xl mx-auto pt-32 pb-20 px-4">
        {step === 1 && (
          <div className="text-center mb-12">
            <h1 className="text-white font-bold text-4xl mb-2 flex items-center justify-center gap-2">🛡️ GigGuard AI</h1>
            <p className="text-gray-400 text-sm italic">"Disruption hits. We pay. You deliver."</p>
          </div>
        )}
        
        {/* PROGRESS INDICATOR */}
        <div className="flex items-center justify-between mb-16 relative px-4">
          <div className="absolute top-[20px] left-0 right-0 h-[2px] bg-white/5 z-0" />
          <div 
            className="absolute top-[20px] left-0 h-[2px] bg-teal-500 z-0 transition-all duration-700 ease-in-out" 
            style={{ width: `${((step - 1) / (REGISTER_STEPS - 1)) * 100}%` }}
          />
          
          {[1, 2, 3].map((num) => (
            <div key={num} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                  step > num 
                    ? 'bg-teal-500 border-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)]'
                    : step === num
                    ? 'glass-strong border-teal-500/50 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                    : 'glass border-white/5 text-slate-500'
                }`}
              >
                {step > num ? <CheckCircle2 size={20} /> : <span className="font-bold">{num}</span>}
              </div>
              <span className={`absolute top-12 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap hidden sm:block ${step >= num ? 'text-teal-400' : 'text-slate-500'}`}>
                {num === 1 ? 'Identity' : num === 2 ? 'Profile' : 'Coverage'}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong p-8 sm:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-indigo-500 opacity-50"></div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Personal Identity</h2>
              <p className="text-slate-500 text-sm mb-10 font-medium">Verify your credentials to start protection</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Legal Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="input-glass pl-12"
                      placeholder="e.g. Rahul Sharma" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="input-glass pl-12"
                      placeholder="10-digit number" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Security Pin</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type="password" 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                      className="input-glass pl-12"
                      placeholder="Min. 6 characters" 
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      className="input-glass pl-12"
                      placeholder="rahul@example.com" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                  className="btn-primary group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Continue</span>
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: WORK PROFILE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong p-8 sm:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-indigo-500 opacity-50"></div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Work Domain</h2>
              <p className="text-slate-500 text-sm mb-10 font-medium">Configure your platform and delivery parameters</p>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Choose your Platform</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setFormData({...formData, platform: p.id})}
                        className={`group relative p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-500 border overflow-hidden ${
                          formData.platform === p.id 
                            ? 'bg-white/5 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]' 
                            : 'glass-hover border-white/5 hover:border-white/10'
                        }`}
                      >
                        {formData.platform === p.id && (
                          <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${p.color}`} />
                        )}
                        <span className="text-3xl group-hover:scale-110 transition-transform">{p.icon}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wide text-center font-mono ${formData.platform === p.id ? 'text-teal-400' : 'text-slate-500'}`}>
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Select Delivery Zone</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10">
                      <MapPin size={18} />
                    </div>
                    <select 
                      value={formData.zone}
                      onChange={e => setFormData({...formData, zone: e.target.value})}
                      className="input-glass pl-12 appearance-none cursor-pointer relative z-0"
                    >
                      {zones.map(z => (
                        <option key={typeof z === 'string' ? z : z.zone} value={typeof z === 'string' ? z : z.zone} className="bg-slate-900">
                          {typeof z === 'string' ? z : z.zone}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ChevronRight className="rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Avg. Daily Income Prediction</label>
                    <div className="text-right">
                      <span className="text-3xl font-display font-bold text-white">₹{formData.avgDailyIncome}</span>
                      <span className="text-slate-500 text-xs font-bold uppercase ml-2 tracking-tighter">/ Day</span>
                    </div>
                  </div>
                  
                  <div className="glass p-6 rounded-3xl border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-white/5 rounded-xl text-teal-400 border border-white/10">
                        <Wallet size={20} />
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm font-bold">₹{(formData.avgDailyIncome * 7).toLocaleString()} / week</p>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Projected Protection Base</p>
                      </div>
                    </div>

                    <input 
                      type="range" 
                      min="300" max="2500" step="50"
                      value={formData.avgDailyIncome}
                      onChange={e => setFormData({...formData, avgDailyIncome: Number(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-teal-400"
                    />
                    <div className="flex justify-between mt-3 px-1">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Entry: ₹300</span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Elite: ₹2500+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-between">
                <button onClick={handleBack} className="btn-ghost flex items-center gap-2 group">
                  <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                  <span>Back</span>
                </button>
                <button onClick={handleNext} disabled={loading} className="btn-primary group">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Generate Coverage</span>
                      <Zap className="ml-2 group-hover:scale-125 transition-transform" size={20} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: COVERAGE PREVIEW */}
          {step === 3 && previewData && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong p-8 sm:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500"></div>
              
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 glass px-3 py-1 rounded-full mb-4 border-teal-500/20">
                  <ShieldCheck size={14} className="text-teal-400" />
                  <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">AI Matching Complete</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">Coverage Summary</h2>
                <p className="text-slate-500 text-sm font-medium">Optimal protection blueprint for {formData.zone}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="glass-hover p-6 rounded-3xl border-white/10 bg-white/[0.02]">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Weekly Contribution</p>
                  <div className="text-4xl font-display font-bold text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                    <AnimatedPremium target={previewData.calculatedPremium} />
                  </div>
                  <p className="text-slate-400 text-xs mt-2">Adjusts dynamically to zone risk</p>
                </div>

                <div className="glass-hover p-6 rounded-3xl border-white/10 bg-white/[0.02]">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Disruption Payout</p>
                  <div className="text-4xl font-display font-bold text-white">
                    ₹{previewData.estimatedCoverage.toFixed(0)}
                  </div>
                  <p className="text-slate-400 text-xs mt-2">Per GPS-verified event</p>
                </div>

                <div className="md:col-span-2 glass-hover p-8 rounded-3xl border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={80} />
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${
                          previewData.riskLevel === 'HIGH' ? 'bg-red-500 shadow-[0_0_10px_#EF4444]' : 'bg-teal-500 shadow-[0_0_10px_#14B8A6]'
                        }`} />
                        <span className="text-white font-bold tracking-tight uppercase text-lg">{previewData.riskLevel} Risk Territory</span>
                      </div>
                      <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                        Data shows {previewData.riskLevel.toLowerCase()} volatility in {formData.zone}. 
                        Your protection score is optimized for instant response.
                      </p>
                    </div>
                    
                    <div className="text-center relative">
                      <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-teal-500 flex items-center justify-center relative">
                        <span className="text-3xl font-display font-bold text-white leading-none">{previewData.initialProtectionScore}</span>
                        <span className="absolute -bottom-1 text-[8px] font-bold text-teal-400 uppercase tracking-widest">Score</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                {[
                  'Automated Disruption Detection',
                  'Instant UPI Settlement',
                  'Zero Claim Documentation',
                  'Cancel Professional Plan Anytime'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                    <CheckCircle2 size={16} className="text-teal-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-between gap-4">
                <button onClick={handleBack} disabled={loading} className="btn-ghost flex items-center gap-2 group flex-1 justify-center">
                  <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                  <span>Review Profile</span>
                </button>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center group">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Activate & Finish</span>
                      <ShieldCheck className="ml-2 group-hover:scale-110 transition-transform" size={20} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center relative z-10">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Institutional-Grade parametric Protection</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
