import React from 'react';
import { Users, FileText, IndianRupee } from 'lucide-react';

const ZoneCard = ({ zone }) => {
  // calculate risk color group
  const score = zone.riskScore || 0;
  let riskColor = "bg-success text-white";
  let borderColor = "border-l-success";
  
  if (score >= 60) {
    riskColor = "bg-danger text-white";
    borderColor = "border-l-danger";
  } else if (score >= 40) {
    riskColor = "bg-secondary text-white";
    borderColor = "border-l-secondary";
  }

  // Calculate ratio
  const ratio = zone.totalPremiums > 0 ? (zone.totalPayouts / zone.totalPremiums) : 0;
  let ratioColor = "bg-success";
  if (ratio > 1.0) ratioColor = "bg-danger";
  else if (ratio >= 0.8) ratioColor = "bg-secondary";
  
  // Cap ratio visually at 1.5 for the progress bar
  const visualRatio = Math.min((ratio / 1.5) * 100, 100);

  return (
    <div className={`glass-panel p-5 rounded-xl border-l-4 ${borderColor} transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:brightness-110 flex flex-col group`}>
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">{zone.zoneName}</h3>
        <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${riskColor}`}>
          {zone.riskLevel || 'Unknown'} Risk
        </span>
      </div>

      {/* Middle */}
      <div className="mb-6 flex flex-col items-center py-4 bg-background/50 rounded-lg border border-white/5">
        <span className="text-5xl font-display font-bold tabular-nums">
          {score}
        </span>
        <span className="text-xs text-textSecondary uppercase tracking-widest mt-1">Risk Score / 100</span>
      </div>

      <div className="flex justify-between mb-6 px-2">
        <div className="flex flex-col items-center">
          <div className="flex items-center text-textSecondary mb-1"><Users className="w-4 h-4 mr-1" /></div>
          <span className="font-semibold">{zone.activeWorkers}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center text-textSecondary mb-1"><FileText className="w-4 h-4 mr-1" /></div>
          <span className="font-semibold">{zone.pendingClaims}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center text-textSecondary mb-1"><IndianRupee className="w-4 h-4 mr-1" /></div>
          <span className="font-semibold">{zone.totalPayouts}</span>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="mt-auto pt-4 border-t border-border/50">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-textSecondary">Payout Ratio</span>
          <span className="font-medium text-white">{(ratio * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-background rounded-full h-2 overflow-hidden">
          <div className={`h-full ${ratioColor} transition-all duration-1000 ease-out`} style={{ width: `${visualRatio}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] text-textSecondary mt-1 opacity-70">
          <span>₹{zone.totalPremiums || 0} Collected</span>
          <span>₹{zone.totalPayouts || 0} Paid</span>
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;
