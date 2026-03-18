"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassBackground } from '../Shared/GlassBackground'; 

export default function TutorialModal({ tutorial, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        setCurrentStep(0);
    }, [tutorial]);

    if (!tutorial) return null;

    const nextStep = () => {
        if (currentStep < tutorial.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: -10 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-3xl w-full relative"
            >
                <GlassBackground className="p-8">
                    {/* Close Button */}
                    <motion.button
                        whileHover={{ scale: 1.2, rotate: 90, boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all border border-white/30"
                    >
                        <X className="w-6 h-6 text-white" />
                    </motion.button>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -50, filter: 'blur(5px)' }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="relative"
                        >
                            <div className="relative h-80 rounded-2xl overflow-hidden mb-8">
                                <img
                                    src={tutorial.steps[currentStep].image}
                                    alt={tutorial.steps[currentStep].title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30" />
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="absolute top-6 left-6 bg-linear-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg"
                                >
                                    Step {currentStep + 1} / {tutorial.steps.length}
                                </motion.div>
                            </div>

                            <h2
                                className="text-4xl font-extrabold mb-4"
                                style={{
                                    background: 'linear-gradient(90deg, #f9a8d4, #93c5fd)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {tutorial.steps[currentStep].title}
                            </h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-gray-300 text-xl mb-10"
                            >
                                {tutorial.steps[currentStep].description}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === 0
                                ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/10'
                                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            ย้อนกลับ
                        </motion.button>

                        <div className="flex gap-2">
                            {tutorial.steps.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setCurrentStep(index)}
                                    animate={{
                                        scale: currentStep === index ? 1.5 : 1,
                                        opacity: currentStep === index ? 1 : 0.6,
                                        background: currentStep === index
                                            ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.6), rgba(168, 85, 247, 0.6))'
                                            : 'rgba(255, 255, 255, 0.3)',
                                        boxShadow: currentStep === index ? "0 0 15px rgba(168, 85, 247, 0.6)" : "none"
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className={`w-3 h-3 rounded-full transition-all`}
                                    style={{
                                        backgroundColor: currentStep === index ? undefined : 'rgba(255, 255, 255, 0.3)'
                                    }}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextStep}
                            disabled={currentStep === tutorial.steps.length - 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === tutorial.steps.length - 1
                                ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/10'
                                : 'bg-[rgba(190,126,199,0.56)] text-white shadow-lg'
                                }`}
                        >
                            ถัดไป
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </GlassBackground>
            </motion.div>
        </motion.div>
    );
}