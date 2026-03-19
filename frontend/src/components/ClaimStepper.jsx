import React, { useEffect, useState } from 'react';
import { CloudRain, MapPin, Thermometer, TrendingDown, ShieldCheck, CheckCircle2, Wallet, Circle } from 'lucide-react';

const ClaimStepper = ({ claim }) => {
  // Steps Definition
  const steps = [
    { id: 1, title: 'Disruption Detected', icon: CloudRain, description: claim ? `${claim.triggerType || 'Weather'} Event in ${claim.zone}` : 'Waiting for event...' },
    { id: 2, title: 'GPS Location Verified', icon: MapPin, description: 'Worker confirmed in zone' },
    { id: 3, title: 'Weather Data Confirmed', icon: Thermometer, description: claim ? `Severity: ${claim.severityLevel || 'Moderate'}` : 'Checking sensors...' },
    { id: 4, title: 'Activity Drop Verified', icon: TrendingDown, description: claim ? `Impact: ${claim.incomeImpact || 0}% drop` : 'Analyzing activity...' },
    { id: 5, title: 'Fraud Check Passed', icon: ShieldCheck, description: claim ? `Score: ${claim.fraudScore || 0}/100` : 'Verifying authenticity...' },
    { id: 6, title: 'Claim Approved', icon: CheckCircle2, description: claim && claim.payoutAmount ? `Amount: ₹${claim.payoutAmount}` : 'Pending approval' },
    { id: 7, title: 'Payout Processing', icon: Wallet, description: claim && claim.transactionId ? `Tx ID: ${claim.transactionId}` : 'Initiating transfer...' },
  ];

  const determineStatus = (stepId, claimStatus) => {
    if (!claimStatus) return 'pending';
    
    // Status mapping to steps length
    // PENDING covers steps 1-4
    // IN_REVIEW covers steps 1-5
    // APPROVED covers steps 1-6
    // PAID covers steps 1-7
    // REJECTED fails at step 5
    
    let currentStep = 1;
    if (claimStatus === 'PENDING') currentStep = 4;
    else if (claimStatus === 'IN_REVIEW') currentStep = 5;
    else if (claimStatus === 'APPROVED') currentStep = 6;
    else if (claimStatus === 'PAID') currentStep = 7;
    else if (claimStatus === 'REJECTED') {
      if (stepId <= 4) return 'completed';
      if (stepId === 5) return 'failed';
      return 'pending';
    }

    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const [activeSteps, setActiveSteps] = useState([]);

  useEffect(() => {
    // Cascading animation
    const animateSteps = () => {
      if (!claim) return;
      
      const newActive = [];
      const interval = setInterval(() => {
        if (newActive.length < steps.length) {
          newActive.push(steps[newActive.length].id);
          setActiveSteps([...newActive]);
        } else {
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    };

    if (claim && (claim.status === 'APPROVED' || claim.status === 'PAID')) {
        animateSteps();
    } else {
        // Just show instantly for pending/review
        setActiveSteps(steps.map(s => s.id));
    }
  }, [claim]);

  return (
    <div className="w-full">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const visible = activeSteps.includes(step.id);
          const status = determineStatus(step.id, claim?.status);
          const isLast = index === steps.length - 1;
          
          if (!visible) return null;

          return (
            <div key={step.id} className="relative flex items-start group animation-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Connector line */}
              {!isLast && (
                <div className={`absolute top-8 left-4 w-px h-full -ml-[0.5px] transition-colors duration-500
                  ${status === 'completed' ? 'bg-primary' : 'bg-border'}`}
                ></div>
              )}

              {/* Icon Container */}
              <div className="relative shrink-0 mr-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background
                  ${status === 'completed' ? 'border-primary text-primary shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 
                    status === 'active' ? 'border-secondary text-secondary animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 
                    status === 'failed' ? 'border-danger text-danger' :
                    'border-border text-textSecondary'}
                `}>
                  <step.icon className="w-4 h-4" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4 pt-1">
                <h4 className={`text-sm font-medium transition-colors
                  ${status === 'completed' ? 'text-textPrimary' : 
                    status === 'active' ? 'text-secondary' : 
                    status === 'failed' ? 'text-danger' :
                    'text-textSecondary'}
                `}>
                  {step.title}
                  {status === 'failed' && ' (Failed)'}
                </h4>
                <p className="text-xs text-textSecondary mt-1">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClaimStepper;
