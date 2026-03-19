import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';

const CoverageShield = ({ status = 'ACTIVE' }) => {
  // status: 'ACTIVE', 'DISRUPTION_ACTIVE', 'PAYOUT_COMPLETE'
  
  if (status === 'ACTIVE') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-glow-pulse"></div>
          <div className="bg-background rounded-full p-4 relative z-10 border border-primary/30">
            <Shield className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-textPrimary">Coverage Active</h3>
          <p className="text-sm text-textSecondary">Your income is protected</p>
        </div>
      </div>
    );
  }

  if (status === 'DISRUPTION_ACTIVE') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <div className="relative">
          {/* Pulsing ring for disruption */}
          <div className="absolute inset-0 rounded-full border-2 border-secondary animate-ping opacity-20"></div>
          {/* Loader spinning ring */}
          <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-secondary/60 animate-spin"></div>
          
          <div className="bg-background rounded-full p-4 relative z-10 border border-secondary/30">
            <ShieldAlert className="w-16 h-16 text-secondary" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-center animate-pulse">
          <h3 className="text-lg font-semibold text-secondary">Protection Triggered</h3>
          <p className="text-sm text-textSecondary">Disruption event detected</p>
        </div>
      </div>
    );
  }

  if (status === 'PAYOUT_COMPLETE') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <div className="relative transition-all duration-500 ease-out transform scale-110">
          <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-20"></div>
          <div className="bg-success/10 rounded-full p-4 relative z-10 border border-success/40">
            <ShieldCheck className="w-16 h-16 text-success" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-success">Protected</h3>
          <p className="text-sm text-textSecondary">Claim processed successfully</p>
        </div>
      </div>
    );
  }

  return null;
};

export default CoverageShield;
