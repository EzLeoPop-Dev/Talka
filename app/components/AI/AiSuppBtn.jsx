"use client";
import { Sparkles, X } from "lucide-react";

export default function AiSuppBtn({ onClick, isOpen }) {
    return (
        <button 
            onClick={onClick}
            className={`absolute bottom-6 right-15 z-50 group flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]
                ${isOpen 
                    ? "bg-white text-purple-900 rotate-0 hover:bg-gray-200" 
                    : "bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                }
            `}
        >
            {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
        </button>
    );
}