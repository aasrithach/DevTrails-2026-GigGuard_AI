import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/workerService';
import { Shield, CloudLightning, Activity, ThermometerSun, AlertCircle, Clock, Bell, ChevronDown, CheckCircle, Navigation, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import PageBackground from '../components/ui/PageBackground';
import RiskMeter from '../components/RiskMeter';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedClaim, setExpandedClaim] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard(user.id);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user.id]);

  if (loading && !data) {
    return (
      <div className="page-wrapper pt-20 px-4 sm:px-6 lg:px-8 min-h-screen animate-pulse">
        <PageBackground />
        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <div className="h-48 glass rounded-2xl w-full"></div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 glass rounded-2xl"></div>)}
              </div>
              <div className="h-96 glass-strong rounded-2xl"></div>
            </div>
            <div className="space-y-8">
              <div className="h-80 glass rounded-2xl"></div>
              <div className="h-64 glass rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { activePolicy, protectionScore, recentClaims: cList, unreadAlerts: aList, tomorrowForecast, totalEarningsProtectedThisMonth } = data;
  const recentClaims = Array.isArray(cList) && Array.isArray(cList[0]) ? cList[0] : (cList || []);
  const unreadAlerts = Array.isArray(aList) && Array.isArray(aList[0]) ? aList[0] : (aList || []);

  let bannerState = 'A'; 
  let activeClaim = null;
  
  if (recentClaims.length > 0) {
    const latestInfo = recentClaims[0];
    const claimDate = new Date(latestInfo.createdAt);
    const hoursDiff = (new Date() - claimDate) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      if (latestInfo.status === 'PENDING' || latestInfo.status === 'FLAGGED') {
        bannerState = 'B';
        activeClaim = latestInfo;
      } else if (latestInfo.status === 'APPROVED') {
        bannerState = 'C';
        activeClaim = latestInfo;
      }
    }
  }

  const ClaimStepperVisual = ({ claim }) => {
    const steps = ['Detected', 'Verify GPS', 'Verify Weather', 'Fraud Check', 'Approval', 'Initiate', 'Complete'];
    let currentIdx = claim.status === 'APPROVED' ? 7 : claim.status === 'PENDING' ? 3 : 4;
    
    return (
      <div className="w-full py-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-white -translate-y-1/2 z-0 transition-all duration-1000" style={{ width: `${(currentIdx / 7) * 100}%` }}></div>
          
          {steps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all duration-500
                ${i < currentIdx ? 'bg-white text-black' : i === currentIdx ? 'bg-white animate-pulse' : 'bg-slate-800 border border-white/20'}`}
              >
                {i < currentIdx && <CheckCircle className="w-3 h-3" />}
              </div>
              <span className={`text-[10px] hidden sm:block ${i <= currentIdx ? 'text-white font-bold' : 'text-slate-400'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const riskS = tomorrowForecast?.riskScore || 30;
  const riskColor = riskS > 80 ? '#EF4444' : riskS > 60 ? '#F97316' : riskS > 40 ? '#F59E0B' : riskS > 20 ? '#84CC16' : '#10B981';

  return (
    <div className="page-wrapper pt-20 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
      <PageBackground />
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* HERO STATUS BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl transition-all duration-500 border
            ${bannerState === 'A' ? 'bg-gradient-to-r from-[rgba(13,148,136,0.15)] to-transparent border-teal-500/20' : 
              bannerState === 'B' ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-amber-500/30' :
              'bg-gradient-to-r from-emerald-500/20 to-transparent border-emerald-500/30'}
          `}
        >
          {bannerState === 'A' && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center animate-pulse-glow shrink-0 border border-teal-500/30">
                  <Shield className="w-10 h-10 text-teal-400" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">Coverage Active</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="glass px-3 py-1 rounded-full text-sm text-teal-100">{user?.zone || 'Zone'}</span>
                    <span className="glass px-3 py-1 rounded-full text-sm text-teal-100">{activePolicy?.worker?.platform || 'Platform'}</span>
                    <span className="glass px-3 py-1 rounded-full text-sm font-semibold text-teal-400">₹{activePolicy?.weeklyPremium || 35}/week</span>
                  </div>
                </div>
              </div>

              {/* Protection Score Gauge */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#2DD4BF" strokeWidth="8" fill="none" 
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (protectionScore || 95)) / 100}
                    className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold text-white leading-none">{protectionScore || 95}</span>
                </div>
                <div className="absolute -bottom-2 md:-bottom-6 left-1/2 -translate-x-1/2 w-max">
                  <span className="badge-low">EXCELLENT</span>
                </div>
              </div>
            </div>
          )}

          {bannerState === 'B' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center animate-pulse border border-amber-500/50">
                  <Shield className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-400 mb-1">Disruption Detected</h2>
                  <p className="text-amber-100/80 text-sm sm:text-base">{activeClaim?.disruption?.description} in {activeClaim?.disruption?.zone}</p>
                </div>
              </div>
              <div className="glass-strong rounded-2xl p-6 border-amber-500/20">
                <ClaimStepperVisual claim={activeClaim} />
              </div>
            </div>
          )}

          {bannerState === 'C' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse border border-emerald-500/50">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">₹{activeClaim?.claimAmount?.toFixed(0)} Protected</h2>
                  <p className="text-emerald-100/80 text-sm">Transaction ID: {activeClaim?.transactionId || 'PROCV-9482X'}</p>
                </div>
              </div>
              <div className="glass-strong rounded-2xl p-6 border-emerald-500/20">
                <ClaimStepperVisual claim={activeClaim} />
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* 4 STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Shield size={18}/>, label: 'Earnings Protected', value: `₹${totalEarningsProtectedThisMonth?.toFixed(0) || 0}`, c: 'text-teal-400' },
                { icon: <CheckCircle size={18}/>, label: 'Active Days', value: '7', c: 'text-white' },
                { icon: <Activity size={18}/>, label: 'Claims (Month)', value: recentClaims.length, c: 'text-white' },
                { icon: <CloudLightning size={18}/>, label: 'Protected Weeks', value: '4', c: 'text-emerald-400' }
              ].map((s, i) => (
                <div key={i} className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors group">
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-3 ${s.c} group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <div className={`text-2xl font-display font-bold mb-1 ${s.c}`}>{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CLAIMS TIMELINE */}
            <div className="glass-strong rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="text-teal-400" /> Recent Claims
              </h3>
              
              <div className="space-y-3">
                {recentClaims.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <Shield className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-300">No recent claims. You are safe!</p>
                  </div>
                ) : (
                  recentClaims.map((claim, i) => (
                    <div key={i} className="glass-hover rounded-2xl overflow-hidden cursor-pointer" onClick={() => setExpandedClaim(expandedClaim === i ? null : i)}>
                      <div className="p-4 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-10 rounded-full ${
                            claim.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white text-sm sm:text-base">{claim.disruption?.disruptionType}</span>
                              <span className="badge-medium !text-[9px] !px-2 !py-0.5 opacity-80">{claim.disruption?.zone}</span>
                            </div>
                            <p className="text-xs text-slate-400">{new Date(claim.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="text-right">
                            <p className="font-bold text-white">₹{claim.claimAmount?.toFixed(0)}</p>
                            <p className={`text-xs font-semibold ${claim.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}`}>{claim.status}</p>
                          </div>
                          <ChevronDown className={`text-slate-500 transition-transform ${expandedClaim === i ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedClaim === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-6 py-5 bg-black/20 border-t border-white/5">
                              {/* 7 step mini stepper */}
                              <div className="space-y-4">
                                {['Disruption detected automatically', 'Location verified via platform GPS', 'External data (Weather/AQI) synced', 'Algorithm fraud check passed', 'Claim generated', 'Bank initiation', 'Funds settled in UPI account'].map((desc, idx) => {
                                  let isDone = claim.status === 'APPROVED' ? true : idx < 4;
                                  return (
                                    <div key={idx} className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] z-10 
                                          ${isDone ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                          {isDone ? '✓' : idx + 1}
                                        </div>
                                        {idx !== 6 && <div className={`w-0.5 h-full my-1 ${isDone ? 'bg-teal-500' : 'bg-slate-800'}`}></div>}
                                      </div>
                                      <div className={`text-sm ${isDone ? 'text-slate-300' : 'text-slate-600'} pb-1`}>{desc}</div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* TOMORROW FORECAST */}
            <div className="glass-strong rounded-3xl p-6 border-t-[3px]" style={{ borderColor: riskColor }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Tomorrow's Forecast</h3>
                  <div className="inline-flex mt-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-slate-300">
                    {user?.zone}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                <div className="glass rounded-xl p-2 text-center flex flex-col justify-center items-center">
                  <CloudLightning className="text-blue-400 mb-1" size={18} />
                  <span className="text-white font-bold text-sm">{tomorrowForecast?.rainfallProbability?.toFixed(0) || 0}%</span>
                </div>
                <div className="glass rounded-xl p-2 text-center flex flex-col justify-center items-center">
                  <AlertCircle className="text-purple-400 mb-1" size={18} />
                  <span className="text-white font-bold text-sm">{tomorrowForecast?.aqiLevel || 45}</span>
                </div>
                <div className="glass rounded-xl p-2 text-center flex flex-col justify-center items-center">
                  <ThermometerSun className="text-orange-500 mb-1" size={18} />
                  <span className="text-white font-bold text-sm">{tomorrowForecast?.temperature || 32}°</span>
                </div>
                <div className="glass rounded-xl p-2 text-center flex flex-col justify-center items-center">
                  <Activity className="text-red-400 mb-1" size={18} />
                  <span className="text-white font-bold text-[10px] leading-tight mt-1 truncate w-full">Avg Trffc</span>
                </div>
              </div>

              {/* Custom Risk Meter Slider */}
              <div className="mb-6 relative pt-6 pb-2">
                {/* Pointer */}
                <div className="absolute top-0 -translate-x-1/2 transition-all duration-1000 ease-out" style={{ left: `${Math.min(Math.max(riskS, 5), 95)}%` }}>
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-white mx-auto"></div>
                </div>
                <div className="h-3 w-full rounded-full flex overflow-hidden">
                  <div className="h-full w-1/5 bg-emerald-500"></div>
                  <div className="h-full w-1/5 bg-lime-500"></div>
                  <div className="h-full w-1/5 bg-amber-500"></div>
                  <div className="h-full w-1/5 bg-orange-500"></div>
                  <div className="h-full w-1/5 bg-red-500"></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-medium uppercase px-1">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Med</span>
                  <span>High</span>
                  <span>V.High</span>
                </div>
              </div>

              {(riskS > 40) && (
                <div className="glass border-l-2 border-l-amber-500 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                  <p className="text-amber-100/90 text-sm leading-relaxed">
                    <strong className="text-amber-400">Coverage pre-activated</strong> for tomorrow due to elevated risk. Predicted impact: ₹{(riskS * 3.5).toFixed(0)}.
                  </p>
                </div>
              )}
            </div>

            {/* ALERTS */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white text-lg">Alerts</h3>
                {unreadAlerts.length > 0 && (
                  <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadAlerts.length}</span>
                )}
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {unreadAlerts.length === 0 ? (
                  <div className="text-center py-6">
                    <Bell className="w-8 h-8 mx-auto text-slate-500 mb-2 opacity-50" />
                    <p className="text-slate-400 text-sm">No new alerts.</p>
                  </div>
                ) : (
                  unreadAlerts.slice(0, 10).map((a, i) => (
                    <div key={i} className="glass rounded-xl p-4 border border-white/5 border-l-2 border-l-teal-500 relative overflow-hidden group hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
                      <div className="flex gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                          <Bell className="w-4 h-4 text-teal-400" />
                        </div>
                        <div>
                          <p className="text-slate-200 text-sm font-medium leading-snug">{a.message}</p>
                          <p className="text-xs text-slate-500 mt-1.5">{new Date(a.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
