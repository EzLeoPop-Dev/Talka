"use client";
import React from "react";

export default function ChatList({ chats, onSelectChat, selectedId, availableTags = [] }) {
    return (
        <div className="w-[425px] flex items-center mt-3">
            <div className="w-[425px] max-w-md h-[85vh]">
                <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-4 h-full flex flex-col">
                    <h1 className="text-white text-2xl font-bold mb-6">Chat List</h1>

                    {(!chats || chats.length === 0) && (
                        <div className="flex justify-center h-full items-center text-white">
                            <p>ยังไม่มีข้อความ</p>
                        </div>
                    )}

                    <div className="space-y-3 overflow-auto p-2 flex-1 spaceList">
                        {chats?.map((chat) => {
                            const lastMsgObj = chat.messages && chat.messages.length > 0 
                                ? chat.messages[chat.messages.length - 1] 
                                : null;
                            
                            const isMe = lastMsgObj ? lastMsgObj.from === 'me' : false;
                            const displayMessage = lastMsgObj ? lastMsgObj.text : chat.message;

                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => {
                                        onSelectChat(chat);
                                        
                                        window.history.replaceState(null, '', `?id=${chat.id}`);
                                    }} 
                                    className={`bg-white/30 backdrop-blur-lg rounded-2xl p-4 hover:bg-white/40 transition-all cursor-pointer border border-white/20 ${selectedId === chat.id ? "ring-2 ring-blue-400" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        
                                        <div className="relative w-12 h-12 shrink-0">
                                            
                                            {/* picture */}
                                            {chat.imgUrl ? (
                                                <img 
                                                    src={chat.imgUrl} 
                                                    alt={chat.name} 
                                                    className="w-full h-full rounded-full object-cover shadow-sm bg-gray-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl shadow-lg text-white">
                                                    {chat.avatar || chat.name.charAt(0)}
                                                </div>
                                            )}

                                            {/* Channel Badge */}
                                            {chat.channel && (
                                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm ]
                                                    ${chat.channel === 'Facebook' ? 'bg-[#1877F2]' : 
                                                        chat.channel === 'Line' ? 'bg-[#06C755]' : 'bg-gray-500'}
                                                `}>
                                                    {chat.channel === 'Facebook' && <i className="fa-brands fa-facebook-f"></i>}
                                                    {chat.channel === 'Line' && <i className="fa-brands fa-line"></i>}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-white font-semibold text-sm truncate">
                                                    {chat.name}
                                                </h3>
                                                
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white/70 text-xs shrink-0">
                                                        {chat.time}
                                                    </span>
                                                    
                                                    {/* New Chat Badge */}
                                                    {chat.status === 'New Chat' && (
                                                        <div className="min-w-[35px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-2 animate-pulse shadow-lg shadow-red-500/40">
                                                            <span className="text-white text-[9px] font-bold uppercase tracking-wide">
                                                                NEW
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm truncate flex-1 ${chat.unreadCount > 0 ? 'text-white font-medium' : 'text-white/80'}`}>
                                                    {isMe && <span className="text-white/50 mr-1">You:</span>}
                                                    {displayMessage}
                                                </p>
                                                {/* AI Auto Status */}
                                                {chat.isAiMode && (
                                                    <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 animate-pulse">
                                                        {chat.activeAiAgent ? (
                                                            <span className="text-xs">{chat.activeAiAgent.emoji}</span>
                                                        ) : (
                                                            <i className="fa-solid fa-robot"></i>
                                                        )}
                                                        <span>Auto</span>
                                                    </span>
                                                )}
                                                
                                                {/* Status */}
                                                {chat.status && (
                                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0
                                                        ${chat.status === 'Closed' 
                                                            ? 'border-white/10 bg-white/5 text-white/30' 
                                                            : 'border-white/30 bg-white/10 text-white/90' 
                                                        }
                                                    `}>
                                                        {chat.status}
                                                    </span>
                                                )}

                                                {/* Tag */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {(() => {
                                                        let tagsArray = [];
                                                        if (Array.isArray(chat.tags)) {
                                                            tagsArray = chat.tags;
                                                        } else if (chat.tags) {
                                                            tagsArray = [chat.tags];
                                                        }

                                                        return tagsArray.map((tagName, idx) => {
                                                            const tagInfo = availableTags.find(t => t.name === tagName);
                                                            const color = tagInfo ? tagInfo.color : '#666'; 
                                                            const emoji = tagInfo ? tagInfo.emoji : '';

                                                            return (
                                                                <span 
                                                                    key={idx}
                                                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 text-white shadow-sm border border-white/10 flex items-center gap-1"
                                                                    style={{ backgroundColor: color }}
                                                                >
                                                                    {emoji && <span>{emoji}</span>}
                                                                    {tagName}
                                                                </span>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}