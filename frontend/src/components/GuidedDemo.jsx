import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { triggerDisruption } from '../api/demoService';
import api from '../api/axios';

const DEMO_STEPS = [
    {
        title: "Meet Ravi Kumar",
        caption: "Zepto delivery partner in Kondapur. Earns ₹900/day. Weekly premium: ₹35.",
        targetSelector: ".worker-row-ravi", // we will need to add this class to Ravi's row or similar logic
    },
    {
        title: "Weather Data Updates",
        caption: "Rain probability rises to 89% for Kondapur tomorrow. Risk level: HIGH.",
        action: async () => {
            await api.post('/demo/set-weather', { zone: 'Kondapur', rainfall: 89, aqi: 165, temp: 41, traffic: 78 });
        }
    },
    {
        title: "Heavy Rain Detected at 7:14 AM",
        caption: "GigGuard AI automatically initiates claim for all covered workers in Kondapur.",
        action: async () => {
             await triggerDisruption({ zone: 'Kondapur', disruptionType: 'RAIN', severity: 'HIGH' });
        }
    },
    {
        title: "Automated Fraud Check",
        caption: "GPS verified ✓ Weather confirmed ✓ Activity drop confirmed ✓ Fraud score: 0/100 — CLEAN. Claim approved in 4 seconds.",
    },
    {
        title: "Instant Payout",
        caption: "₹765 instantly credited to Ravi's UPI account. Transaction ID: TXN17234891234.",
    },
    {
        title: "Worker Receives Funds",
        caption: "Ravi's dashboard updates in real-time. Full transparency. Zero paperwork. Zero phone calls.",
    },
    {
        title: "Live Admin Analytics",
        caption: "Insurer gets full visibility: loss ratios, fraud flags, zone-level analytics — all live.",
    }
];

const GuidedDemo = ({ onComplete, inProgress, setInProgress, triggerRefresh }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!inProgress) return;

        const runStep = async () => {
            const step = DEMO_STEPS[currentStep];
            if (step.action) {
                try {
                    await step.action();
                    triggerRefresh();
                } catch (e) {
                    console.error("Demo action failed", e);
                }
            }

            // Move to next step after 4000ms delay
            if (currentStep < DEMO_STEPS.length - 1) {
                const timer = setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                }, 4000);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => {
                    setInProgress(false);
                    if(onComplete) onComplete();
                }, 5000);
                return () => clearTimeout(timer);
            }
        };

        runStep();
    }, [currentStep, inProgress]);

    const startDemo = () => {
        setCurrentStep(0);
        setInProgress(true);
    };

    const cancelDemo = () => {
        setInProgress(false);
    };

    if (!inProgress) {
        return (
            <button 
                onClick={startDemo}
                className="flex items-center gap-2 bg-primary hover:bg-teal-400 text-background px-6 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(20,184,166,0.4)] transition-all hover:scale-105"
            >
                <Play size={20} className="fill-current" /> Start Live Demo
            </button>
        );
    }

    const progressPercent = ((currentStep + 1) / DEMO_STEPS.length) * 100;

    return (
        <AnimatePresence>
            {inProgress && (
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-8 pointer-events-none"
                >
                    <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-3xl pointer-events-auto relative overflow-hidden">
                        
                        {/* Progress Bar underlay */}
                        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
                            <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: `${((currentStep) / DEMO_STEPS.length) * 100}%` }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                                        Guided Demo Active
                                    </span>
                                    <span className="text-textSecondary text-sm font-medium">Step {currentStep + 1} of {DEMO_STEPS.length}</span>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-2">
                                    {DEMO_STEPS[currentStep].title}
                                </h3>
                                <p className="text-lg text-teal-100/80 leading-relaxed">
                                    {DEMO_STEPS[currentStep].caption}
                                </p>
                            </div>
                            <button 
                                onClick={cancelDemo}
                                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                                title="End Demo"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GuidedDemo;
