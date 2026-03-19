import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Shield } from 'lucide-react';

const ClaimReceiptModal = ({ isOpen, onClose, claim }) => {
    if (!isOpen || !claim) return null;

    const handlePrint = () => {
        window.print();
    };

    // Calculate formatted strings
    const txnId = `TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const dateStr = new Date(claim.createdAt).toLocaleDateString();
    const timeStr = new Date(claim.createdAt).toLocaleTimeString();
    const fraudPassedStr = claim.fraudScore < 60 ? `PASSED (${claim.fraudScore}/100)` : `OVERRIDE (${claim.fraudScore}/100)`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 print:absolute print:inset-0 print:p-0 print:bg-white print:z-auto">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden"
                />

                {/* Modal Container */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-surface border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden print:shadow-none print:border-none print:bg-white print:text-black print:rounded-none"
                >
                    {/* Header Controls (hide on print) */}
                    <div className="flex justify-between items-center bg-background/50 p-4 border-b border-white/5 print:hidden">
                        <h2 className="text-white font-display font-bold flex items-center gap-2">
                            <Shield className="text-primary w-5 h-5" /> Claim Receipt
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={handlePrint} className="bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-md transition-colors">
                                <Printer size={18} />
                            </button>
                            <button onClick={onClose} className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-md transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Receipt Body */}
                    <div className="p-8 font-mono text-sm leading-relaxed print:text-black" id="printable-receipt">
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-2">
                                <Shield className="text-primary print:text-black w-10 h-10" />
                            </div>
                            <h1 className="text-xl font-bold uppercase tracking-widest text-white print:text-black mb-1">GigGuard AI</h1>
                            <p className="text-textSecondary print:text-gray-500 text-xs">Digitally Verified Parametric Insurance</p>
                        </div>

                        <div className="border-t border-dashed border-white/20 print:border-gray-400 py-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Worker</span>
                                <span className="text-white print:text-black font-bold">{claim.worker?.name || 'Unknown Worker'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Zone</span>
                                <span className="text-white print:text-black">{claim.worker?.zone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Coverage Type</span>
                                <span className="text-white print:text-black">Parametric Income Protection</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-white/20 print:border-gray-400 py-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Disruption Event</span>
                                <span className="text-white print:text-black font-bold">{claim.disruption?.disruptionType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Date</span>
                                <span className="text-white print:text-black">{dateStr}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Time</span>
                                <span className="text-white print:text-black">{timeStr}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-white/20 print:border-gray-400 py-4 space-y-2 bg-primary/5 print:bg-transparent -mx-8 px-8">
                            <div className="flex justify-between items-center">
                                <span className="text-textSecondary print:text-gray-600">Claim Amount</span>
                                <span className="text-2xl text-primary print:text-black font-bold">₹{claim.claimAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Status</span>
                                <span className="text-success print:text-black font-bold uppercase">{claim.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Fraud Check</span>
                                <span className="text-white print:text-black">{fraudPassedStr}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-white/20 print:border-gray-400 py-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Payout Method</span>
                                <span className="text-white print:text-black">UPI</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Account</span>
                                <span className="text-white print:text-black opacity-50">XXXXXX@upi</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary print:text-gray-600">Transaction ID</span>
                                <span className="text-white print:text-black font-bold">{txnId}</span>
                            </div>
                            <div className="flex justify-between mt-4">
                                <span className="text-textSecondary print:text-gray-600">Processed</span>
                                <span className="text-white print:text-black">{timeStr}</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-center border-t border-white/10 print:border-gray-300 pt-6">
                            <p className="text-xs text-textSecondary print:text-gray-500">
                                This receipt is digitally generated by GigGuard AI's automated claims engine. No physical signature required.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ClaimReceiptModal;
