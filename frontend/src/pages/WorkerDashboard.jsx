import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/workerService';
import { Activity, Shield, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import PageBackground from '../components/ui/PageBackground';
import WorkerPolicyCard from '../components/WorkerPolicyCard';
import DemoControlPanel from '../components/DemoControlPanel';
import ClaimStepper from '../components/ClaimStepper';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await getDashboard(user.id);
      setData(res.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, [user.id]);

  if (loading && !data) {
    return (
      <div className="page-wrapper pt-20 px-4 min-h-screen animate-pulse">
        <PageBackground />
        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <div className="h-64 glass rounded-3xl w-full"></div>
          <div className="h-32 glass rounded-2xl w-full"></div>
          <div className="h-64 glass rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  const { activePolicy, recentClaims: cList, unreadAlerts: aList, totalEarningsProtectedThisMonth } = data || {};
  const recentClaims = Array.isArray(cList) && Array.isArray(cList[0]) ? cList[0] : (cList || []);
  const unreadAlerts = Array.isArray(aList) && Array.isArray(aList[0]) ? aList[0] : (aList || []);

  // Find most recent active/pending claim for stepper
  const activeClaim = recentClaims.find(c => c.status === 'PENDING' || c.status === 'APPROVED');

  return (
    <div className="page-wrapper pt-20 px-4 pb-20 min-h-screen">
      <PageBackground />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* 1. WorkerPolicyCard (TOP) */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <WorkerPolicyCard policy={activePolicy} user={user} />
        </section>

        {/* 2. DemoControlPanel (MIDDLE) */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
          <DemoControlPanel onRefresh={fetchDashboardData} />
          
          {/* Subtle spacing for control panel visualization */}
          <div className="glass rounded-2xl p-4 border border-white/5 bg-white/5 text-center mt-4">
             <div className="flex items-center justify-center gap-3 text-slate-400 text-sm font-medium">
               <Activity className="w-4 h-4 text-teal-400" />
               Automated Claim Simulator Active — Trigger disruptions below
             </div>
          </div>
        </section>

        {/* 3. ClaimStepper (BOTTOM - Conditional) */}
        {activeClaim && (
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></div>
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest">Active Protection Flow</h3>
            </div>
            <ClaimStepper claim={activeClaim} />
          </section>
        )}

        {/* Secondary Stats/History (Visual Polish) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
           {/* Summary Stats */}
           <div className="glass-strong rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Shield className="text-teal-400" size={20} /> Protection Status
              </h3>
              <div className="flex items-center justify-between p-4 glass rounded-2xl mb-4">
                 <div className="text-sm text-slate-400">Monthly Protection</div>
                 <div className="text-xl font-bold text-white">₹{totalEarningsProtectedThisMonth?.toFixed(0) || 0}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 glass rounded-2xl">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Days</div>
                    <div className="text-lg font-bold text-white">7</div>
                 </div>
                 <div className="p-4 glass rounded-2xl">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Alerts</div>
                    <div className="text-lg font-bold text-teal-400">{unreadAlerts.length}</div>
                 </div>
              </div>
           </div>

           {/* Quick Alerts List */}
           <div className="glass-strong rounded-3xl p-6 border border-white/10 overflow-hidden relative">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Bell className="text-amber-400" size={20} /> System Alerts
              </h3>
              <div className="space-y-3">
                {unreadAlerts.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-8 italic font-light">No environment alerts in your zone.</p>
                ) : (
                  unreadAlerts.slice(0, 3).map((a, i) => (
                    <div key={i} className="text-xs p-3 glass rounded-xl border-l-2 border-l-teal-500 text-slate-300">
                      {a.message}
                    </div>
                  ))
                )}
              </div>
              {/* Background Glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-3xl"></div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default WorkerDashboard;
