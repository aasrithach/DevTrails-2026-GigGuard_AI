import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const DemoControlPanel = ({ onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true' || localStorage.getItem('demoMode') === 'true') {
      setIsVisible(true);
      localStorage.setItem('demoMode', 'true');
    }
  }, []);

  if (!isVisible) return null;

  const triggerDisruption = async (type, zone) => {
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/demo/disruption', { disruptionType: type, zone: zone });
      setMessage({ type: 'success', text: `Triggered ${type} in ${zone}` });
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
      await api.post('/demo/sim/payout'); // Hack to simulate processing payouts 
      setMessage({ type: 'success', text: `Simulated Automation` });
      if (onRefresh) onRefresh();
    } catch (err) {
      setMessage({ type: 'error', text: 'Action failed.' });
    }
    setLoading(false);
  };
  
  const resetDemo = async () => {
      setLoading(true);
      setMessage({ type: 'success', text: `Reset complete [Simulated]` });
      if (onRefresh) onRefresh();
      setLoading(false);
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[5000] w-full max-w-2xl px-4 sm:px-0">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-t-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
        
        {/* Header Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center py-2 px-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <span className="text-sm font-semibold tracking-wide text-slate-300">🎮 Demo Controls</span>
          <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Expanded Content */}
        {isOpen && (
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              <button 
                onClick={() => triggerDisruption('HEAVY_RAIN', 'Kondapur')}
                disabled={loading}
                className="px-3 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors"
              >
                🌧️ Rain — Kondapur
              </button>
              <button 
                onClick={() => triggerDisruption('EXTREME_HEAT', 'Miyapur')}
                disabled={loading}
                className="px-3 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors"
              >
                🌡️ Heat — Miyapur
              </button>
              <button 
                onClick={() => triggerDisruption('ROAD_BLOCK', 'Hitech City')}
                disabled={loading}
                className="px-3 py-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-lg text-sm font-medium hover:bg-yellow-500/30 transition-colors"
              >
                🚗 Traffic — Hitech City
              </button>
              
              <div className="w-full sm:w-auto h-px bg-slate-700 my-1 sm:my-0 sm:w-px sm:h-8 sm:mx-1"></div>
              
              <button 
                onClick={resolveAll}
                disabled={loading}
                className="px-3 py-2 bg-success/20 text-success border border-success/30 rounded-lg text-sm font-medium hover:bg-success/30 transition-colors"
              >
                ✅ Resolve All
              </button>
              <button 
                onClick={resetDemo}
                disabled={loading}
                className="px-3 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                🔄 Reset
              </button>
            </div>
            
            {(message || loading) && (
              <div className="mt-3 text-center transition-opacity">
                {loading ? (
                   <span className="text-sm border border-slate-700 bg-slate-800 px-3 py-1 rounded inline-flex items-center text-slate-400">
                     <span className="animate-spin w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full mr-2"></span>
                     Processing...
                   </span>
                ) : (
                  <span className={`text-sm tracking-wide ${message.type === 'error' ? 'text-danger' : 'text-success'}`}>
                    {message.text}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoControlPanel;
