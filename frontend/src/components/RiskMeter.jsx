import React, { useEffect, useState } from 'react';

const RiskMeter = ({ riskScore = 0 }) => {
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => {
      setFillWidth(Math.min(100, Math.max(0, riskScore)));
    }, 100);
    return () => clearTimeout(timer);
  }, [riskScore]);

  // Determine text and color based on score
  let riskText = "Very Low";
  let textColor = "text-success";
  
  if (riskScore >= 80) {
    riskText = "Very High";
    textColor = "text-danger";
  } else if (riskScore >= 60) {
    riskText = "High";
    textColor = "text-orange-500";
  } else if (riskScore >= 40) {
    riskText = "Medium";
    textColor = "text-secondary";
  } else if (riskScore >= 20) {
    riskText = "Low";
    textColor = "text-lime-500";
  }

  return (
    <div className="w-full py-4">
      {/* Risk Segments */}
      <div className="relative h-3 rounded-full overflow-hidden flex bg-gray-800">
        <div className="flex-1 bg-success relative"></div>
        <div className="flex-1 bg-lime-500 relative"></div>
        <div className="flex-1 bg-secondary relative"></div>
        <div className="flex-1 bg-orange-500 relative"></div>
        <div className="flex-1 bg-danger relative"></div>
        
        {/* Animated Marker */}
        <div 
          className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 transition-all duration-1000 ease-out"
          style={{ left: `calc(${fillWidth}% - 3px)` }}
        >
          {/* Needle triangle */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-[10px] text-textSecondary mt-2 uppercase tracking-tight font-medium opacity-60">
        <span>Very Low</span>
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Very High</span>
      </div>
      
      {/* Current Value Display */}
      <div className="mt-4 text-center">
        <span className={`text-sm font-semibold uppercase tracking-wider ${textColor}`}>
          {riskText} Risk Level
        </span>
      </div>
    </div>
  );
};

export default RiskMeter;
