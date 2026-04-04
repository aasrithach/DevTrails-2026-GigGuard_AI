import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard, getClaims } from '../api/adminService';
import { triggerDisruption, resolveDisruption, resetDemo, getZoneSummary } from '../api/demoService';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Users, Shield, Zap, FileText, IndianRupee, AlertTriangle, CheckCircle2, XCircle, Activity, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import ZoneCard from '../components/ZoneCard';
import DemoControlPanel from '../components/DemoControlPanel';
import GuidedDemo from '../components/GuidedDemo';
import ClaimReceiptModal from '../components/ClaimReceiptModal';
import api from '../api/axios';
import PageBackground from '../components/ui/PageBackground';
import ZoneRiskDashboard from '../components/ZoneRiskDashboard';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [zoneSummaries, setZoneSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [clockTime, setClockTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const id = setInterval(() => {
      setClockTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, claimsRes, zonesRes] = await Promise.all([
        getDashboard(),
        getClaims(),
        getZoneSummary()
      ]);
      setStats(dashRes.data);
      setClaims(claimsRes.data);
      setZoneSummaries(zonesRes.data);
    } catch (err) {
      console.error("Admin fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleDemoAction = async (action, payload = null) => {
    try {
      if (action === 'trigger') {
        await triggerDisruption(payload);
        addToast?.({ title: 'Action Simulated', message: `${payload.severity} ${payload.disruptionType} triggered in ${payload.zone}`, type: 'warning' });
      } else if (action === 'resolveAll') {
        await resetDemo();
        addToast?.({ title: 'System Reset', message: 'All disruptions resolved and demo reset', type: 'success' });
      }
      fetchData(); 
    } catch (err) {
      addToast?.({ title: 'Error', message: 'Demo action failed', type: 'error' });
    }
  };

  const handleApproveClaim = async (id) => {
    try {
      await api.put(`/admin/claims/${id}/approve`);
      addToast?.({ title: 'Claim Approved', message: `Manual override successful. Payout initiated.`, type: 'success' });
      fetchData();
    } catch (e) {
      addToast?.({ title: 'Override Failed', message: e.response?.data?.message || e.message, type: 'error' });
    }
  };

  const handleRejectClaim = async (id) => {
    try {
      await api.put(`/admin/claims/${id}/reject`);
      addToast?.({ title: 'Claim Rejected', message: `Manual rejection confirmed. Worker notified.`, type: 'warning' });
      fetchData();
    } catch (e) {
      addToast?.({ title: 'Rejection Failed', message: e.response?.data?.message || e.message, type: 'error' });
    }
  };

  if (loading && !stats) {
    return (
      <div className="page-wrapper min-h-screen pt-20 px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <PageBackground />
        <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
          <div className="h-12 w-64 glass rounded-xl mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 glass rounded-2xl"></div>)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="h-96 glass rounded-3xl"></div>
              <div className="h-96 glass rounded-3xl"></div>
            </div>
            <div className="space-y-8">
              <div className="h-80 glass rounded-3xl"></div>
              <div className="h-64 glass rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Approved', value: stats.claimsApprovedToday, color: '#10B981' },
    { name: 'Pending', value: stats.pendingClaimsCount, color: '#F59E0B' },
    { name: 'Flagged', value: stats.fraudFlaggedCount, color: '#F97316' },
    { name: 'Rejected', value: Math.max(0, claims.length - stats.claimsApprovedToday - stats.pendingClaimsCount - stats.fraudFlaggedCount), color: '#EF4444' }
  ];

  const flaggedClaims = claims.filter(c => c.status === 'FLAGGED');

  return (
    <div className="page-wrapper min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <PageBackground />
      
      {/* BRANDED HEADER */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex flex-col">
          <span className="text-white font-bold text-xl flex items-center gap-2">🛡️ GigGuard AI</span>
          <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Operations Center</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-mono text-sm bg-emerald-950/30 px-3 py-1 rounded-md border border-emerald-500/20">{clockTime}</span>
        </div>
      </div>

      {/* SYSTEM STATUS BAR */}
      <div className="bg-gray-800 px-6 py-2 flex items-center gap-4 border-b border-white/5">
        <span className="flex items-center gap-1 text-[10px] px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/20">
          <span className="animate-pulse">●</span> System Online
        </span>
        <span className="flex items-center gap-1 text-[10px] px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/20">
          <span className="animate-pulse">●</span> H2 Database Active
        </span>
        <span className="flex items-center gap-1 text-[10px] px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 font-bold uppercase tracking-wider border border-amber-500/20">
          <span className="animate-pulse">●</span> Demo Mode
        </span>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-6 relative z-10 p-6">
        
        {/* DEMO BANNER */}
        {demoInProgress && (
          <div className="fixed top-16 left-0 right-0 bg-amber-500 text-black py-2 px-4 flex justify-center items-center gap-2 font-bold text-sm z-40 shadow-lg animate-pulse">
            🎬 <span>Live Demo — Guided Sequence Running</span>
          </div>
        )}

        <ClaimReceiptModal 
          isOpen={!!selectedClaim} 
          onClose={() => setSelectedClaim(null)} 
          claim={selectedClaim} 
        />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
              <Globe className="text-teal-400" /> Operations Center
            </h1>
            <p className="text-slate-400 mt-1">Live monitoring and risk management</p>
          </div>
          <div className="flex items-center gap-4">
            <GuidedDemo 
              inProgress={demoInProgress} 
              setInProgress={setDemoInProgress} 
              triggerRefresh={fetchData} 
              onComplete={() => addToast?.({title: 'Demo Complete', message:'Guided tour finished', type:'success'})} 
            />
            
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>

        {/* ZONE RISK DASHBOARD */}
        <ZoneRiskDashboard />

        {/* TOP ROW — 6 KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPITile title="Active Workers" value={stats.totalActiveWorkers} icon={<Users />} />
          <KPITile title="Active Policies" value={stats.totalActivePolicies} icon={<Shield />} />
          <KPITile title="Active Disruptions" value={stats.totalActiveDisruptions} icon={<Zap />} color={stats.totalActiveDisruptions > 0 ? 'text-red-400' : 'text-slate-400'} />
          <KPITile title="Pending Claims" value={stats.pendingClaimsCount} icon={<FileText />} color={stats.pendingClaimsCount > 5 ? 'text-amber-400' : 'text-slate-400'} />
          <KPITile title="Today's Payouts" value={`₹${stats.todayPayoutTotal.toLocaleString()}`} icon={<IndianRupee />} color="text-teal-400" />
          <KPITile title="Fraud Flags Today" value={stats.fraudFlaggedCount} icon={<AlertTriangle />} color={stats.fraudFlaggedCount > 0 ? 'text-orange-400' : 'text-emerald-400'} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content (2 cols) */}
          <div className="xl:col-span-2 space-y-6">
            
            {stats.totalActiveDisruptions === 0 && (
              <div className="glass rounded-2xl p-4 border-l-4 border-l-emerald-500 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">All zones normal</h3>
                  <p className="text-sm text-slate-400">No active disruptions detected across the network.</p>
                </div>
              </div>
            )}
            
            {/* ZONE RISK OVERVIEW */}
            <div className="glass-strong rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-display font-bold text-white mb-6">Zone Risk Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zoneSummaries.map((zone, i) => (
                  <ZoneCard key={i} zone={zone} />
                ))}
              </div>
            </div>

            {/* FRAUD REVIEW PANEL */}
            {flaggedClaims.length > 0 && (
              <div className="rounded-3xl p-6 border border-orange-500/30 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(15,23,42,0.8) 100%)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <h3 className="text-xl font-display font-bold text-orange-400 mb-6 flex items-center gap-2 relative z-10">
                  <AlertTriangle /> <span>Needs Review ({flaggedClaims.length})</span>
                </h3>
                
                <div className="space-y-4 relative z-10">
                  {flaggedClaims.map(fc => (
                    <div key={fc.id} className="glass rounded-xl p-5 border border-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-bold text-white text-lg">{fc.worker?.name || 'Worker'}</span>
                          <span className="text-slate-400 text-sm bg-white/5 px-2 py-0.5 rounded-md">{fc.worker?.zone || 'Zone'}</span>
                          <span className="text-teal-400 font-mono font-bold text-lg">₹{fc.claimAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge-high !text-[10px]">GPS_MISMATCH</span>
                          <span className="badge-medium !text-[10px]">FREQ_ALERT</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center px-6 md:border-x border-white/10 my-4 md:my-0">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Fraud Score</span>
                        <span className="text-3xl font-display font-bold text-orange-400">{fc.fraudScore}<span className="text-lg text-slate-500">/100</span></span>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[160px]">
                        <button onClick={() => handleApproveClaim(fc.id)} className="btn-ghost !border-emerald-500/50 hover:!bg-emerald-500/20 !text-emerald-400 flex justify-center gap-2 w-full text-sm">
                          <CheckCircle2 size={16} /> Override Approve
                        </button>
                        <button onClick={() => handleRejectClaim(fc.id)} className="glass flex items-center justify-center gap-2 w-full text-sm !bg-red-500/20 !text-red-400 hover:!bg-red-500/30 transition-colors border border-red-500/30 py-2 rounded-lg font-bold">
                          <XCircle size={16} /> Confirm Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LIVE CLAIMS FEED */}
            <div className="glass-strong rounded-3xl p-6 border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Activity className="text-teal-400" /> Live Claims Feed
                </h3>
                <span className="text-[10px] font-medium text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span> Auto-refreshing
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase text-slate-400 font-bold tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-4 py-4">Worker</th>
                      <th className="px-4 py-4">Zone</th>
                      <th className="px-4 py-4">Disruption</th>
                      <th className="px-4 py-4">Amount</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Fraud Score</th>
                      <th className="px-4 py-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.slice(0, 10).map((claim, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="px-4 py-4 font-medium text-white">
                          <span className={claim.worker?.name === 'Ravi Kumar' ? 'text-teal-400 font-bold' : ''}>
                            {claim.worker?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-400">{claim.worker?.zone || 'Unknown'}</td>
                        <td className="px-4 py-4">
                          <span className="glass px-2 py-1 rounded-md border-white/10 text-xs">
                            {claim.disruption?.disruptionType || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-white font-mono font-medium">₹{claim.claimAmount?.toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className={`badge-${claim.status === 'APPROVED' ? 'success' : claim.status === 'PENDING' ? 'medium' : claim.status === 'FLAGGED' ? 'high' : 'high'}`}>
                            {claim.status}
                          </span>
                          {claim.status === 'APPROVED' && (
                            <button 
                              onClick={() => setSelectedClaim(claim)}
                              className="ml-3 text-[10px] font-bold tracking-wider uppercase bg-white/5 text-white px-2 py-1 rounded hover:bg-white/10 transition-colors border border-white/10"
                            >
                              Receipt
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-mono font-bold ${
                            claim.fraudScore < 30 ? 'text-emerald-400' : 
                            claim.fraudScore < 60 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {claim.fraudScore}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-500 text-xs text-right font-mono">{new Date(claim.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar (1 col) */}
          <div className="space-y-6">
            
            {/* DEMO CONTROL PANEL */}
            <DemoControlPanel onRefresh={fetchData} />

            {/* ANALYTICS CHARTS */}
            <div className="glass-strong rounded-3xl p-6 border border-white/5">
              <h3 className="text-sm font-display font-semibold mb-6 text-slate-400 uppercase tracking-wider">Today's Pipeline</h3>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pieData.map((item, i) => (
                  <div key={i} className="glass p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                      <span className="text-xs text-slate-400 font-medium">{item.name}</span>
                    </div>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPITile = ({ title, value, icon, color = "text-teal-400" }) => (
  <div className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors flex flex-col justify-between h-32 relative overflow-hidden group">
    <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity ${color} transform scale-150`}>
      {icon}
    </div>
    <div className="flex justify-between items-start relative z-10">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider max-w-[70%] leading-tight">{title}</p>
      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color} border border-white/5 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 16 })}
      </div>
    </div>
    <p className={`text-3xl font-display font-bold relative z-10 ${color === 'text-slate-400' ? 'text-white' : color}`}>{value}</p>
  </div>
);

export default AdminDashboard;
