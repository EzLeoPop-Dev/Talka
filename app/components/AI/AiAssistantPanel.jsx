"use client";
import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal, X, ChevronDown, Check } from "lucide-react";

export default function AiAssistantPanel({ onClose, availableAgents = [] }) {

    const [activeAgent, setActiveAgent] = useState(availableAgents[0] || {
        id: 'default',
        name: 'General Assistant',
        emoji: '✨',
        role: 'AI Assistant'
    });
  
    const [showModelSelect, setShowModelSelect] = useState(false);
  
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            role: "ai", 
            text: `สวัสดีครับ! ผมคือ ${activeAgent.name} มีอะไรให้ผมช่วยไหมครับ? ${activeAgent.emoji}` 
        }
    ]);
  
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowModelSelect(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectAgent = (agent) => {
        setActiveAgent(agent);
        setShowModelSelect(false);
        setMessages(prev => [
            ...prev, 
            { 
                id: Date.now(), 
                role: "ai", 
                text: `เปลี่ยนโหมดเป็น ${agent.emoji} ${agent.name} แล้วครับ` 
            }
        ]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
    
        const userMsg = { id: Date.now(), role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        setTimeout(() => {
        const aiMsg = { 
            id: Date.now() + 1, 
            role: "ai", 
            text: `[${activeAgent.name}]: รับทราบครับ ข้อมูลเรื่อง "${userMsg.text}" น่าสนใจมาก เดี๋ยวผมจัดการให้ครับ...` 
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e) => { if (e.key === "Enter") handleSend(); };

    return (
        // Container หลัก
        <div className="w-[320px] h-[550px] max-h-[80vh] bg-[rgba(32,41,59,0.95)] border border-[rgba(254,253,253,0.3)] backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden absolute bottom-24 right-5 z-40 animate-fade-in-up origin-bottom-right">

        {/* Header: เลือก Model */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 relative">
        
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setShowModelSelect(!showModelSelect)}
                    className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-xl transition-colors group"
                >
                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-lg">
                        {activeAgent.emoji}
                    </div>
                    <div className="text-left">
                        <h3 className="text-white font-bold text-sm flex items-center gap-1">
                            {activeAgent.name}
                            <ChevronDown size={14} className={`text-white/50 transition-transform ${showModelSelect ? 'rotate-180' : ''}`}/>
                        </h3>
                        <p className="text-white/50 text-[10px]">{activeAgent.role}</p>
                    </div>
                </button>

                {/* Dropdown Menu */}
                {showModelSelect && (
                    <div className="absolute top-full left-0 mt-2 w-60 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                        <div className="p-2 bg-white/5 border-b border-white/5">
                            <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider ml-2">Select Assistant</span>
                        </div>
                    
                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                            {availableAgents.map((agent) => (
                                <button
                                    key={agent.id}
                                    onClick={() => handleSelectAgent(agent)}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors border-b border-white/5 flex items-center gap-3
                                        ${activeAgent.id === agent.id ? 'bg-white/10 text-white' : 'text-white/70'}
                                    `}
                                >
                                    <span className="text-lg">{agent.emoji}</span>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-medium">{agent.name}</span>
                                        <span className="text-[10px] text-white/40">{agent.role}</span>
                                    </div>
                                    {activeAgent.id === agent.id && <Check size={14} className="text-green-400" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ปุ่มปิด */}
            <button onClick={onClose} className="text-white/50 hover:text-white transition bg-white/5 p-1.5 rounded-lg hover:bg-red-500/20 ">
            <X size={18} />
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10">
            {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            
                {msg.role === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-2 mt-1 shrink-0 text-xs">
                        {activeAgent.emoji}
                    </div>
                )}

                <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                    ? "bg-purple-600 text-white rounded-br-none shadow-md"
                    : "bg-[#2d2d3a] text-white/90 border border-white/5 rounded-bl-none shadow-sm"
                }`}
                >
                {msg.text}
                </div>
            </div>
            ))}
            {isLoading && (
                <div className="flex justify-start ml-8">
                    <div className="bg-[#2d2d3a] px-3 py-2 rounded-2xl rounded-bl-none border border-white/5">
                        <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150"></span>
                        </span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white/5 border-t border-white/10">
            <div className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2 border border-white/5 focus-within:border-purple-500/50 transition">
            <input
                type="text"
                className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/30"
                placeholder={`Ask ${activeAgent.name}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <SendHorizontal size={16} />
            </button>
            </div>
        </div>
        </div>
    );
}