import React, { useEffect, useState } from 'react';
import { CloudRain, CheckCircle2, Wallet, CheckCircle } from 'lucide-react';

const ClaimStepper = ({ claim }) => {
  // Steps Definition - Simplified for Demo
  const steps = [
    { id: 1, title: 'Disruption Triggered', icon: CloudRain, description: claim ? `${claim.disruption?.disruptionType || 'Weather'} Event` : 'Event detected' },
    { id: 2, title: 'Claim Created', icon: CheckCircle2, description: 'Automatic validation passed' },
    { id: 3, title: 'Payout Processed', icon: Wallet, description: claim && claim.claimAmount ? `₹${claim.claimAmount} settled` : 'Instant settlement' },
  ];

  const determineStatus = (stepId, claimStatus) => {
    if (!claimStatus) return 'pending';
    
    // Status mapping for 3 steps
    let currentStep = 1;
    if (claimStatus === 'PENDING') currentStep = 2;
    else if (claimStatus === 'APPROVED' || claimStatus === 'PAID') currentStep = 3;
    else if (claimStatus === 'REJECTED') {
      return stepId === 1 ? 'completed' : 'failed';
    }

    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'completed'; // For demo, we mark current as completed instantly
    return 'pending';
  };

  const [activeSteps, setActiveSteps] = useState([]);

  useEffect(() => {
    if (!claim) return;
    
    // Animate steps for demo impact
    const newActive = [];
    const interval = setInterval(() => {
      if (newActive.length < steps.length) {
        newActive.push(steps[newActive.length].id);
        setActiveSteps([...newActive]);
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [claim]);

  if (!claim) return null;

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 relative">
        {/* Progress Line (Desktop) */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 hidden sm:block z-0"></div>
        <div className="absolute top-4 left-4 h-0.5 bg-teal-500 hidden sm:block z-0 transition-all duration-1000" 
             style={{ width: `${claim.status === 'APPROVED' ? 100 : 50}%` }}></div>
        
        {steps.map((step, index) => {
          const visible = activeSteps.includes(step.id);
          const status = determineStatus(step.id, claim?.status);
          
          if (!visible) return <div key={step.id} className="flex-1"></div>;

          return (
            <div key={step.id} className="relative z-10 flex flex-row sm:flex-col items-center gap-4 flex-1 group animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Icon Container */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0
                ${status === 'completed' ? 'bg-teal-500 border-teal-400 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 
                  'bg-slate-800 border-slate-700 text-slate-500'}
              `}>
                {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="text-left sm:text-center">
                <h4 className={`text-sm font-bold transition-colors duration-300
                  ${status === 'completed' ? 'text-white' : 'text-slate-500'}
                `}>
                  {step.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClaimStepper;
