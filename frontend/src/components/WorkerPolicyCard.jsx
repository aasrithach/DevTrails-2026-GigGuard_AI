import React from 'react';
import { Shield, Info } from 'lucide-react';

const WorkerPolicyCard = ({ policy, riskLevel }) => {
    if (!policy) return null;

    const startDate = new Date(policy.createdAt).toLocaleDateString();
    // Assuming policy expires in 7 days
    const expDate = new Date(new Date(policy.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

    return (
        <div className="relative w-[340px] h-[200px] perspective-1000 group">
            <div className="w-full h-full absolute preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                {/* FRONT FACE */}
                <div className="absolute w-full h-full backface-hidden flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-tr from-slate-900 via-[#1E293B] to-slate-800 border border-white/10 shadow-2xl overflow-hidden">
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <Shield className="text-primary w-5 h-5" />
                            <span className="text-white font-display font-bold text-sm tracking-wider uppercase">GigGuard AI</span>
                        </div>
                        <span className="text-[10px] text-primary/80 uppercase tracking-widest font-semibold bg-primary/10 px-2 py-1 rounded">
                            Parametric Coverage
                        </span>
                    </div>

                    <div className="relative z-10">
                        <p className="text-xs text-textSecondary uppercase tracking-widest mb-1">Weekly Premium</p>
                        <p className="text-4xl text-primary font-display font-bold">₹{policy.weeklyPremium}</p>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-textSecondary uppercase tracking-widest">Valid Thru</p>
                            <p className="text-sm text-white font-mono">{startDate} - {expDate}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                            </span>
                            <span className="text-xs font-bold text-success uppercase">{policy.status}</span>
                        </div>
                    </div>
                </div>

                {/* BACK FACE */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 p-6 rounded-2xl bg-slate-800 border border-white/10 shadow-xl flex flex-col text-sm text-white overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                        <Info className="w-4 h-4 text-primary" />
                        <span className="font-bold uppercase tracking-wider text-xs">Coverage Terms</span>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-textSecondary">Max Payout / Day</span>
                            <span className="font-mono font-bold">₹{Math.floor(policy.coverageMultiplier * 900)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-textSecondary">Zone</span>
                            <span className="font-bold text-primary">{policy.worker?.zone}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-textSecondary">Risk Segment</span>
                            <span className="font-bold text-amber-400">{riskLevel || 'Standard'}</span>
                        </div>
                    </div>

                    <div className="text-[10px] text-textSecondary text-center border-t border-white/10 pt-2">
                        Triggered automatically via verified APIs.<br/>
                        Zero manual claim process.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerPolicyCard;
