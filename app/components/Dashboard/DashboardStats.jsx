"use client";
import React, { useState, useEffect } from 'react';
import { Users, MessageSquareOff, MessageSquareText, CheckCircle2, ChevronRight, ArrowUpRight } from 'lucide-react';

export default function DashboardStats() {
    const [stats, setStats] = useState({
        newCustomers: 0,
        unreplied: 0,
        incomingMessages: 0,
        closedChatPercent: "0.00"
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setIsLoading(true);
                const res = await fetch('/api/dashboard/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchDashboardStats();
    }, []);

    const statCards = [
        {
            label: "New Customers",
            value: stats.newCustomers,
            icon: <Users size={18} />,
            color: "text-[#BE7EC7]",
            bg: "bg-[#BE7EC7]/10",
        },
        {
            label: "Unreplied",
            value: stats.unreplied,
            unit: "Convs",
            icon: <MessageSquareOff size={18} />,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
        {
            label: "Incoming",
            value: stats.incomingMessages,
            unit: "Msgs",
            icon: <MessageSquareText size={18} />,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Resolution",
            value: `${stats.closedChatPercent}%`,
            icon: <CheckCircle2 size={18} />,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
        }
    ];

    return (
        <div className="w-full mb-6"> 
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((card, index) => (
                    <div 
                        key={index} 
                        className="bg-[#1F192E] border border-white/5 rounded-2xl p-4 hover:border-[#BE7EC7]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default shadow-lg shadow-black/20"
                    > 
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-9 h-9 ${card.bg} ${card.color} rounded-xl flex items-center justify-center shadow-inner`}>
                                {card.icon}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-white/20 group-hover:text-[#BE7EC7] transition-colors">
                                STATS <ArrowUpRight size={12} />
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/40">
                                {card.label}
                            </p>
                            
                            <div className="flex items-baseline gap-2">
                                {isLoading ? (
                                    <div className="h-8 w-12 bg-white/5 animate-pulse rounded-md mt-1"></div>
                                ) : (
                                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-white transition-colors">
                                        {card.value}
                                    </h3>
                                )}
                                {card.unit && !isLoading && (
                                    <span className="text-[10px] font-bold text-white/20 uppercase">
                                        {card.unit}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar Style Indicator */}
                        <div className="mt-3 w-full h-1 bg-black/20 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${card.color.replace('text', 'bg')} opacity-60 w-1/4 group-hover:w-full transition-all duration-1000 ease-out`}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}