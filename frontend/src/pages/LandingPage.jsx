import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import PageBackground from '../components/ui/PageBackground';
import { 
  Shield, 
  ChevronRight, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  ShieldCheck, 
  CloudRain, 
  ThermometerSun, 
  Wind, 
  AlertTriangle,
  Store,
  Smartphone,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

// Floating particles for added depth
function Particles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p, i) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: i % 2 === 0 ? '#14B8A6' : '#818CF8',
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
}

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper min-h-screen">
      <PageBackground />
      <Particles />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 border-teal-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">AI-Driven Income Protection</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            Your Income. <br />
            <span className="text-gradient">Protected.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            GigGuard AI detects disruptions automatically and pays you instantly. 
            No forms, no waiting, just seamless protection for India's delivery warriors.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button 
              onClick={() => navigate('/register')}
              className="btn-primary group"
            >
              <span>Get Protected Free</span>
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="btn-ghost group">
              <span>See How It Works</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { label: 'Protection Score', value: '40M+', desc: 'Workers covered', icon: <ShieldCheck className="text-teal-400" /> },
              { label: 'Avg. Payout', value: '₹850', desc: 'Per disruption', icon: <Zap className="text-amber-400" /> },
              { label: 'Approval Speed', value: '< 60s', desc: 'Fully automated', icon: <Clock className="text-indigo-400" /> },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 text-left group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-all">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </div>
                <h4 className="text-3xl font-display font-bold text-white mb-1">{stat.value}</h4>
                <p className="text-xs text-slate-400">{stat.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="relative z-10 py-24 px-4 border-t border-white/5 bg-slate-950/20 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">How GigGuard Works</h2>
            <p className="text-slate-400 text-lg">Fully automated. Zero paperwork. Always protecting you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Easy Onboarding', icon: <User className="text-teal-400" />, desc: 'Register in 2 minutes. Connect your platform and select your usual delivery zones.' },
              { title: 'AI Risk Monitoring', icon: <BarChart3 className="text-indigo-400" />, desc: 'Our AI monitors weather, traffic, and platform uptime 24/7 across your zones.' },
              { title: 'Premium Micro-Plans', icon: <ShieldCheck className="text-emerald-400" />, desc: 'Get protected from just ₹20/week. Pay only for the risk level of your actual zones.' },
              { title: 'Instant Detection', icon: <Zap className="text-amber-400" />, desc: 'Disruptions are detected in real-time. We know before you lose a single order.' },
              { title: 'Auto-Verification', icon: <CheckCircle2 className="text-teal-400" />, desc: 'Zero human touch. Our system verifies the disruption through GPS and local data.' },
              { title: 'UPI Payouts', icon: <Zap className="text-amber-400" />, desc: 'Money hits your account in seconds. No forms, no calls, just instant relief.' },
            ].map((step, i) => (
              <div key={i} className="glass-hover p-8 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE SECTION */}
      <section id="coverage" className="relative z-10 py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center uppercase tracking-tight">
          <div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Comprehensive <br />
              <span className="text-gradient">Disruption Coverage</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-xl">
              Life on the road is unpredictable. GigGuard AI covers every factor that hits your daily earnings, 
              ensuring your financial stability no matter what happens.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <CloudRain className="text-blue-400" />, name: 'Heavy Rain' },
                { icon: <ThermometerSun className="text-orange-400" />, name: 'Extreme Heat' },
                { icon: <Wind className="text-slate-400" />, name: 'Air Pollution' },
                { icon: <AlertTriangle className="text-amber-400" />, name: 'Traffic Gridlock' },
                { icon: <Store className="text-red-400" />, name: 'Zone Closures' },
                { icon: <Smartphone className="text-teal-400" />, name: 'Platform Outages' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 glass border-white/5 hover:bg-white/5 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                    {item.icon}
                  </div>
                  <span className="font-bold text-white text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 blur-[100px] pointer-events-none rounded-full" />
            <div className="glass-strong p-8 relative border-white/10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="text-white font-bold text-xl">Hyderabad Central</h4>
                  <p className="text-slate-500 text-xs">Live Zone Monitoring</p>
                </div>
                <span className="badge-high animate-pulse">High Risk</span>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                    <span className="text-slate-400">Current Weather</span>
                    <span className="text-white">Rainy (12mm/hr)</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[80%] h-full bg-blue-500" />
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                    <span className="text-slate-400">Traffic Density</span>
                    <span className="text-white">Heavy (82%)</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[82%] h-full bg-orange-500" />
                  </div>
                </div>
                <div className="p-6 glass border-teal-500/30">
                  <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2">Automated Payout Triggered</p>
                  <p className="text-white font-bold text-lg mb-4">Income disruption detected. Payout of ₹250 initiated.</p>
                  <button className="w-full btn-primary !py-2 !text-xs">
                    View Verification Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-20 px-4 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <Shield className="text-teal-400 h-8 w-8" />
                <span className="font-display font-bold text-2xl text-white tracking-tight">
                  GigGuard <span className="text-teal-400">AI</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-8">
                Revolutionizing social protection for the gig economy. Instant, automated, and fair coverage for the modern workforce.
              </p>
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'github'].map(social => (
                  <div key={social} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                    <span className="capitalize text-[10px] font-bold">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-6">Product</h5>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="hover:text-teal-400 cursor-pointer">How it Works</li>
                <li className="hover:text-teal-400 cursor-pointer">Coverage Details</li>
                <li className="hover:text-teal-400 cursor-pointer">Pricing</li>
                <li className="hover:text-teal-400 cursor-pointer">API Integration</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="hover:text-teal-400 cursor-pointer">About Us</li>
                <li className="hover:text-teal-400 cursor-pointer">Careers</li>
                <li className="hover:text-teal-400 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-teal-400 cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs font-medium">GigGuard AI © 2026. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_#14B8A6]" />
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">System Status: Optimal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
