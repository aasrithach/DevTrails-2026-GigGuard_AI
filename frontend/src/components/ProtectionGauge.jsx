import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ProtectionGauge = ({ score = 0 }) => {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        // Trigger stroke animation after component mount
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);
        return () => clearTimeout(timer);
    }, [score]);

    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    let color = '#EF4444'; // red
    let label = 'High Risk';
    if (score >= 80) {
        color = '#14B8A6'; // teal
        label = 'Trusted Partner';
    } else if (score >= 60) {
        color = '#3B82F6'; // blue
        label = 'Active Partner';
    } else if (score >= 40) {
        color = '#F59E0B'; // amber
        label = 'Under Review';
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-surface/50 border border-white/5 rounded-2xl w-full max-w-[200px]">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle 
                        cx="60" cy="60" r={radius} 
                        fill="none" 
                        stroke="#334155" 
                        strokeWidth="8" 
                    />
                    <circle 
                        cx="60" cy="60" r={radius} 
                        fill="none" 
                        stroke={color} 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out, stroke 0.5s ease' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-3xl font-display font-bold"
                    >
                        {score}
                    </motion.span>
                </div>
            </div>
            <div className="mt-3 text-center">
                <p className="text-textSecondary text-xs uppercase tracking-widest font-bold">Protection Score</p>
                <p className="font-semibold text-sm mt-1" style={{ color }}>{label}</p>
            </div>
        </div>
    );
};

export default ProtectionGauge;
