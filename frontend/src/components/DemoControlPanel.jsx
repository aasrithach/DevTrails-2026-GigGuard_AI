import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { simulateClaims } from '../api/demoService';

const DemoControlPanel = ({ onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Simulation State
  const [simulatedClaims, setSimulatedClaims] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simParams, setSimParams] = useState({
    zone: 'Kondapur',
    disruptionType: 'RAIN',
    severity: 'MEDIUM'
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true' || localStorage.getItem('demoMode') === 'true') {
      setIsVisible(true);
      localStorage.setItem('demoMode', 'true');
    }
  }, []);

  if (!isVisible) return null;

  const handleSimulate = async () => {
    setLoading(true);
    setIsSimulating(true);
    setMessage(null);
    setSimulatedClaims([]);
    
    try {
      const data = await simulateClaims(simParams);
      const claims = data.claims || [];
      
      if (claims.length === 0) {
        setMessage({ type: 'error', text: `No active workers found in ${simParams.zone}` });
      }

      setSimulatedClaims([]);
      setDisplayedCount(0);
      
      for (let i = 0; i < claims.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setSimulatedClaims(prev => [...prev, claims[i]]);
        setDisplayedCount(prev => prev + 1);
      }
      
      if (onRefresh) onRefresh();
    } catch (err) {
      setMessage({ type: 'error', text: 'Simulation failed' });
    } finally {
      setLoading(false);
      setIsSimulating(false);
    }
  };

  const triggerDisruption = async (type, zone) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.post('/demo/disruption', { disruptionType: type, zone: zone });
      const { message, payout } = response.data;
      
      const icon = type.includes('RAIN') ? '🌧️' : type.includes('HEAT') ? '🌡️' : '🚗';
      setMessage({ type: 'success', text: `${icon} ${message} | Claim created | ₹${payout} payout processed` });
      
      if (onRefresh) onRefresh();
    } catch (err) {
      setMessage({ type: 'error', text: 'Action failed. Check console.' });
    }
    setLoading(false);
  };

  const resolveAll = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/demo/sim/payout'); 
      setMessage({ type: 'success', text: `Simulated Automation` });
      if (onRefresh) onRefresh();
    } catch (err) {
      setMessage({ type: 'error', text: 'Action failed.' });
    }
    setLoading(false);
  };
  
  const resetDemo = async () => {
    setLoading(true);
    try {
      await api.post('/demo/reset');
      setSimulatedClaims([]);
      setDisplayedCount(0);
      setMessage({ type: 'success', text: 'Demo environment reset successfully' });
      if (onRefresh) onRefresh();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reset demo' });
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[5000] w-full max-w-2xl px-4 sm:px-0">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-t-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500">
        
        {/* Header Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-3 px-6 bg-slate-800/40 hover:bg-slate-800/60 transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Operations Control Panel</span>
          </div>
          <svg className={`w-4 h-4 text-slate-500 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Expanded Content */}
        {isOpen && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/20">
                  <Zap size={20} />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold mb-1">⚡ Disruption Simulation Engine</h2>
                  <p className="text-gray-400 text-xs italic">Trigger parametric events and watch the system respond in real time</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            {/* Simulation Header */}
            <div className="mb-6">
               <div className="grid grid-cols-3 gap-3 mb-4">
                  <select 
                    value={simParams.zone}
                    onChange={e => setSimParams({...simParams, zone: e.target.value})}
                    className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    {['Kondapur', 'Madhapur', 'Gachibowli', 'Miyapur', 'Hitech City'].map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                  <select 
                    value={simParams.disruptionType}
                    onChange={e => setSimParams({...simParams, disruptionType: e.target.value})}
                    className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    {['RAIN', 'AQI', 'HEAT', 'TRAFFIC'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select 
                    value={simParams.severity}
                    onChange={e => setSimParams({...simParams, severity: e.target.value})}
                    className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    {['LOW', 'MEDIUM', 'HIGH'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               
               <button 
                 onClick={handleSimulate}
                 disabled={loading || isSimulating}
                 className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)] flex items-center justify-center gap-2 mb-4"
               >
                 {isSimulating ? (
                   <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> Triggering claims...</>
                 ) : (
                   "🚀 Simulate Claims Trigger"
                 )}
               </button>
            </div>

            <hr className="border-gray-700 my-4" />

            {/* Simulated Claims List (Animated) */}
            <div className="mb-2 flex justify-between items-center px-1">
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                 Live Claims Feed
               </p>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                 Showing {displayedCount} of {simulatedClaims.length} claims processed
               </p>
            </div>

            {simulatedClaims.length > 0 && (
              <div className="mb-4 max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {simulatedClaims.map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-black/40 border border-slate-700 p-3 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-1000">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-[10px]">
                        {c.workerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{c.workerName}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Automatic Claim</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-xs font-mono font-bold text-teal-400">₹{Math.round(c.predictedIncomeLoss)}</p>
                      <p className="text-[9px] text-slate-500">Fraud Score: {c.fraudScore}</p>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        c.status === 'APPROVED' ? 'bg-emerald-400 text-black' : 
                        c.status === 'FLAGGED' ? 'bg-amber-400 text-black' : 
                        'bg-rose-400 text-white'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Bar */}
            {simulatedClaims.length > 0 && !isSimulating && (
              <div className="mb-6 py-4 px-4 bg-gray-900 border border-emerald-500 rounded-xl flex justify-between items-center animate-in fade-in slide-in-from-bottom-1 duration-500 mt-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Simulation Complete</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{simulatedClaims.length} Claims Triggered</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-400">Total Payout: ₹{Math.round(simulatedClaims.filter(c => c.status === 'APPROVED').reduce((acc, c) => acc + c.predictedIncomeLoss, 0)).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex gap-2">
                 <button onClick={resolveAll} className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/5">Resolve All</button>
                 <button onClick={resetDemo} className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/5">Reset</button>
              </div>
              {message && (
                <p className={`text-[10px] font-bold uppercase tracking-wider ${message.type === 'error' ? 'text-red-400' : 'text-teal-400'}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoControlPanel;
