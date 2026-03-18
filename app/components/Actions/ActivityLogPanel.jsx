"use client";
import React from "react";
import { X, Clock, Tag, User, FileText, MessageSquare, Info } from "lucide-react";

export default function ActivityLogPanel({ onClose, logs = [] }) {

  // ฟังก์ชันแปลงเวลาให้ดูง่าย
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-GB', { 
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
        });
    };

    // เลือกไอคอนตามประเภทกิจกรรม
    const getIcon = (type) => {
        switch (type) {
            case 'tag': return <Tag size={14} className="text-yellow-400" />;
            case 'status': return <Clock size={14} className="text-blue-400" />;
            case 'note': return <FileText size={14} className="text-purple-400" />;
            case 'contact': return <User size={14} className="text-green-400" />;
            case 'message': return <MessageSquare size={14} className="text-pink-400" />;
            default: return <Info size={14} className="text-gray-400" />;
        }
    };

    return (
        <div className="w-[320px] max-h-[85vh] mt-3 ml-3 bg-[rgba(32,41,59,0.25)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col self-start">
    
        <div className="flex justify-between items-center mb-5">
            <h2 className="text-white text-2xl font-semibold">Activity Log</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white transition">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {logs.length === 0 ? (
                <p className="text-white/30 text-center text-sm italic mt-10">No activity recorded yet.</p>
            ) : (
                // วนลูปแสดง Log (เรียงจากใหม่ -> เก่า)
                [...logs].reverse().map((log) => (
                    <div key={log.id} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors border border-white/5">
                    
                        {/* Header: Icon + Action Type + Time */}
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    {getIcon(log.type)}
                                </div>
                                <span className="text-white font-medium text-xs uppercase tracking-wide text-opacity-80">
                                    {log.type}
                                </span>
                            </div>
                            <span className="text-white/30 text-[10px] whitespace-nowrap">
                                {formatTime(log.timestamp)}
                            </span>
                        </div>

                        {/* Detail */}
                        <p className="text-white/80 text-sm ml-8 leading-relaxed">
                            {log.detail}
                        </p>
                    
                        {/* User (Optional: ถ้ามีระบบ Login) */}
                        <p className="text-white/40 text-[10px] ml-8 mt-1">
                            by {log.by || "System"}
                        </p>
                    </div>
                ))
            )}
        </div>

        <button
            onClick={onClose}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all mt-4"
        >
            Close
        </button>
        </div>
    );
}