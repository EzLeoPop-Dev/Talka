"use client";
import React, { useState } from "react";

export default function ChatList({ chats = [], onSelectChat, selectedId, availableTags = [] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const getInitials = (name) => {
        return name
            ?.split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "?";
    };

    const getAvatarColor = (name) => {
        const colors = [
            "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-pink-500",
            "bg-amber-500", "bg-rose-500", "bg-indigo-500", "bg-cyan-500"
        ];
        return colors[(name || "").charCodeAt(0) % colors.length] || "bg-[#BE7EC7]";
    };

    const filteredChats = chats.filter(chat =>
        chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 lg:w-96 bg-[#1E1B29] border border-[#BE7EC7]/10 rounded-3xl flex flex-col overflow-hidden shadow-xl shrink-0">
            {/* Header */}
            <div className="p-5 border-b border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Chat List</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 text-white text-sm placeholder:text-white/30 rounded-xl border border-white/10 focus:border-[#BE7EC7] focus:ring-1 focus:ring-[#BE7EC7] focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredChats.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-white/40 text-sm">
                        No chats found
                    </div>
                ) : (
                    filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat)}
                            className={`p-4 border-b border-white/5 cursor-pointer transition-all ${selectedId === chat.id
                                    ? "bg-[#BE7EC7]/10 border-l-4 border-l-[#BE7EC7]"
                                    : "hover:bg-white/5 border-l-4 border-l-transparent"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold shadow-sm ${getAvatarColor(chat.name)}`}>
                                    {getInitials(chat.name)}
                                </div>

                                {/* Chat Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold text-white truncate text-sm">
                                            {chat.name || "Unknown"}
                                        </h3>
                                        <span className="text-[10px] text-white/40 ml-2 shrink-0">
                                            {chat.time}
                                        </span>
                                    </div>

                                    {/* Last Message */}
                                    <p className={`text-xs truncate ${selectedId === chat.id ? "text-white/80" : "text-white/50"}`}>
                                        {chat.lastMessage || "No messages"}
                                    </p>

                                    {/* Status Badge & Tags */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border shrink-0 ${chat.status === "OPEN"
                                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                : chat.status === "PENDING"
                                                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                    : "bg-white/5 text-white/50 border-white/10"
                                            }`}>
                                            {chat.status}
                                        </span>

                                        {/* วนลูปแสดง Tags */}
                                        {chat.tags && chat.tags.map(tagName => {
                                            // ค้นหาข้อมูล Tag จาก availableTags เพื่อดึงสีและ Emoji
                                            const tagObj = availableTags.find(t => (typeof t === 'object' ? t.name : t) === tagName);
                                            const tagColor = tagObj?.color || '#BE7EC7';
                                            const tagEmoji = tagObj?.emoji || '';

                                            return (
                                                <span
                                                    key={tagName}
                                                    className="text-[9px] tracking-wider font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 shrink-0"
                                                    style={{
                                                        backgroundColor: `${tagColor}15`, // เพิ่ม 15 เพื่อทำ Opacity แบบ Hex
                                                        color: tagColor,
                                                        borderColor: `${tagColor}30`
                                                    }}
                                                >
                                                    {tagEmoji && <span>{tagEmoji}</span>}
                                                    {tagName}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}