import React, { useState, useEffect } from 'react';
import { getZoneRisks } from '../api/riskService';

const ZoneRiskDashboard = () => {
  const [zones, setZones] = useState([]);
  const [lastUpdated, setLastUpdated] = useState({});

  const getTierBorderColor = (tier) => {
    if (tier === 'LOW') return "border-emerald-500";
    if (tier === 'MEDIUM') return "border-amber-500";
    if (tier === 'HIGH') return "border-rose-500";
    return "border-transparent";
  };

  const fetchRisks = async () => {
    try {
      const data = await getZoneRisks();
      
      // Update timestamps if score changed
      data.forEach(newZone => {
        const oldZone = zones.find(z => z.zoneName === newZone.zoneName);
        if (!oldZone || oldZone.riskScore !== newZone.riskScore) {
          setLastUpdated(prev => ({
            ...prev,
            [newZone.zoneName]: new Date().toLocaleTimeString()
          }));
        }
      });

      setZones(data);
    } catch (err) {
      console.error('Error fetching zone risks:', err);
    }
  };

  useEffect(() => {
    fetchRisks();
    const interval = setInterval(fetchRisks, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-white text-xl font-bold mb-1 flex items-center gap-2">🌐 Live Zone Risk Monitor</h2>
        <p className="text-gray-400 text-sm italic">Premiums auto-adjust every 3 seconds based on real-time disruption signals</p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {zones.map((zone) => (
          <div key={zone.zoneName} className={`flex-1 min-w-[300px] bg-gray-800 rounded-xl p-6 shadow-lg border border-white/5 border-t-4 transition-all duration-500 ${getTierBorderColor(zone.premiumTier)}`}>
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">{zone.zoneName}</h3>
            
            <div className="flex flex-col items-center justify-center my-6">
              <span className={`text-6xl font-display font-bold transition-all duration-500 transform hover:scale-110 ${
                zone.riskScore < 40 ? 'text-emerald-400' : 
                zone.riskScore < 70 ? 'text-amber-400' : 
                'text-rose-400'
              }`}>
                {zone.riskScore}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Dynamic Risk Index</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              <div className="bg-slate-900/50 rounded-lg p-2 border border-white/5">
                <span className="block text-[10px] text-slate-400 mb-1 font-bold uppercase">🌧 Rain</span>
                <span className="text-white font-mono text-sm">{zone.rainfall}%</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-2 border border-white/5">
                <span className="block text-[10px] text-slate-400 mb-1 font-bold uppercase">🌫 AQI</span>
                <span className="text-white font-mono text-sm">{zone.aqi}</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-2 border border-white/5">
                <span className="block text-[10px] text-slate-400 mb-1 font-bold uppercase">🚦 Traffic</span>
                <span className="text-white font-mono text-sm">{zone.traffic}%</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg ${
                zone.premiumTier === 'LOW' ? 'bg-emerald-500' : 
                zone.premiumTier === 'MEDIUM' ? 'bg-amber-500' : 
                'bg-rose-500'
              }`}>
                {zone.premiumTier} PROTECTION
              </span>
              <span className="text-xl font-bold text-white">
                ₹{zone.weeklyPremium}<span className="text-xs text-slate-500 italic">/week</span>
              </span>
            </div>
            
            <p className="text-gray-500 text-[10px] mt-4 text-center font-bold uppercase tracking-wider">
              Last updated: <span className="text-slate-400">{lastUpdated[zone.zoneName] || "–"}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZoneRiskDashboard;
