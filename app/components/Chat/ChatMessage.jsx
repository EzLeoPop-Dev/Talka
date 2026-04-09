"use client";
import React, { useRef, useState, useEffect } from "react";
import { Tooltip } from 'react-tooltip';
import Picker from "emoji-picker-react";

export default function ChatMessage({ chat, availableAgents, onSelectAiAgent, aiPrompts = [], currentUser, onSendMessage, availableTags = [] }) {
    if (!chat) {
        return (
            <div className="flex-1 min-w-0 h-full bg-[#1E1B29] border border-[#BE7EC7]/10 rounded-3xl shadow-xl flex justify-center items-center text-[#BE7EC7] font-medium text-sm">
                เลือกแชททางซ้ายเพื่อดูข้อความ
            </div>
        );
    }

    const textareaRef = useRef(null);
    const [height, setHeight] = useState(100);
    const [messages, setMessages] = useState(chat?.messages || []);
    const messagesEndRef = useRef(null);

    const [showAiPrompts, setShowAiPrompts] = useState(false);
    const dropdownRef = useRef(null);

    const [showAiModelSelect, setShowAiModelSelect] = useState(false);
    const aiModelDropdownRef = useRef(null);

    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // ✅ ใช้ chat.messages จาก props แทนการ fetch
    useEffect(() => {
        if (chat?.messages) {
            setMessages(chat.messages);
        }
    }, [chat?.messages, chat?.id]);

    // 🟢 Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // =========================
    // 🔥 SEND MESSAGE
    // =========================
    const handleSendClick = async () => {
        const text = textareaRef.current?.value;

        // เช็คว่าถ้าไม่มีทั้งข้อความและไฟล์ ให้ return กลับไป
        if (!text?.trim() && files.length === 0) return;

        // ✅ Clear input immediately
        textareaRef.current.value = "";
        setHeight(100);
        setFiles([]); // เคลียร์ไฟล์ที่แนบหลังจากกดส่ง
        setShowEmojiPicker(false);

        // ✅ Call parent handler (ในอนาคตถ้า API รองรับไฟล์ ต้องส่ง files ไปด้วย)
        if (onSendMessage) {
            await onSendMessage(chat.id, text);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.value = "";
            setHeight(100);
            setFiles([]);
            setShowEmojiPicker(false);
        }
    }, [chat?.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowAiPrompts(false);
            }
            if (aiModelDropdownRef.current && !aiModelDropdownRef.current.contains(event.target)) {
                setShowAiModelSelect(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = textareaRef.current.offsetHeight;

        const onMouseMove = (e) => {
            const delta = startY - e.clientY;
            const newHeight = Math.max(50, startHeight + delta);
            setHeight(newHeight);
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const handleAttachClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
        event.target.value = "";
    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const onEmojiClick = (emojiData) => {
        const editor = textareaRef.current;
        if (!editor) return;
        const startPos = editor.selectionStart;
        const endPos = editor.selectionEnd;
        const text = editor.value;
        editor.value = text.substring(0, startPos) + emojiData.emoji + text.substring(endPos);
        editor.selectionStart = editor.selectionEnd = startPos + emojiData.emoji.length;
        editor.focus();
    };

    return (
        <div className="flex-1 min-w-0 h-full bg-[#1E1B29] border border-[#BE7EC7]/10 rounded-3xl shadow-xl p-5 flex flex-col overflow-hidden">

            {/* --- Header --- */}
            <div className="shrink-0 flex items-center justify-between border-b border-white/5 pb-4 mb-4 gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-12 h-12 shrink-0">
                        {chat?.imgUrl ? (
                            <img src={chat.imgUrl} alt={chat?.name} className="w-full h-full rounded-2xl object-cover shadow-sm bg-white/5 border border-white/10" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#BE7EC7] to-[#8a55b5] rounded-2xl flex items-center justify-center text-2xl shadow-lg font-bold text-white border border-white/10">
                                {chat?.avatar || "?"}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-white font-semibold text-lg truncate leading-tight mb-1">{chat?.name}</h2>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status Badge */}
                            <span className="text-[10px] text-[#BE7EC7] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-[#BE7EC7]/20 bg-[#BE7EC7]/10 shrink-0">
                                {chat?.status}
                            </span>

                            {/* Tags Badge */}
                            {chat?.tags && chat.tags.map(tagName => {
                                const tagObj = availableTags.find(t => (typeof t === 'object' ? t.name : t) === tagName);
                                const tagColor = tagObj?.color || '#BE7EC7';
                                const tagEmoji = tagObj?.emoji || '';

                                return (
                                    <span
                                        key={tagName}
                                        className="text-[10px] tracking-wider font-semibold px-2 py-0.5 rounded border flex items-center gap-1 shrink-0"
                                        style={{
                                            backgroundColor: `${tagColor}15`,
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

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 text-white/90 pr-2 mb-4 flex flex-col">
                {messages && messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isMe = msg.from === 'me' || msg.from === 'AGENT';
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-white/30 mb-1 px-1">
                                    {msg.time}
                                </span>
                                <div className={`px-4 py-2.5 rounded-2xl max-w-[70%] text-sm wrap-break-words shadow-sm ${isMe
                                        ? 'bg-[#BE7EC7] text-white rounded-br-sm'
                                        : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center h-full text-white/30 text-sm">
                        No messages yet
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative shrink-0 border-t border-white/5 pt-4">

                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 z-50">
                        <Picker onEmojiClick={onEmojiClick} theme="dark" />
                    </div>
                )}

                {/* File Preview Area */}
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-lg border border-white/10">
                                <i className="fa-solid fa-file text-[#BE7EC7]"></i>
                                <span className="max-w-[100px] truncate">{file.name}</span>
                                <button onClick={() => handleRemoveFile(index)} className="hover:text-red-400 ml-1 transition-colors">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    onKeyDown={handleKeyDown}
                    style={{ height: `${Math.min(height, 150)}px` }}
                    className="w-full p-3.5 bg-white/5 text-white text-sm placeholder:text-white/30 rounded-xl border border-white/10 focus:border-[#BE7EC7] focus:ring-1 focus:ring-[#BE7EC7] focus:outline-none resize-none custom-scrollbar transition-all"
                    placeholder="Type a message..."
                />

                <div className="flex gap-2 mt-3 items-center">
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Attach Button */}
                    <button
                        onClick={handleAttachClick}
                        data-tooltip-id="attach-tooltip"
                        data-tooltip-content="Attach file"
                        className="w-10 h-10 flex items-center justify-center shrink-0 bg-white/5 hover:bg-white/10 text-white/50 hover:text-[#BE7EC7] rounded-xl transition-all border border-white/5 hover:border-[#BE7EC7]/30"
                    >
                        <i className="fa-solid fa-paperclip"></i>
                    </button>

                    {/* Emoji Button */}
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`w-10 h-10 flex items-center justify-center shrink-0 rounded-xl transition-all border ${showEmojiPicker ? 'bg-[#BE7EC7]/20 text-[#BE7EC7] border-[#BE7EC7]/50' : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-[#BE7EC7] border-white/5 hover:border-[#BE7EC7]/30'}`}
                    >
                        <i className="fa-regular fa-face-smile"></i>
                    </button>

                    {/* Send Button */}
                    <button
                        onClick={handleSendClick}
                        className="flex-1 px-4 py-2.5 bg-[#BE7EC7] hover:bg-[#a66bb0] text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#BE7EC7]/20"
                    >
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                        Send
                    </button>
                </div>
            </div>

            {/* Custom Tooltip Style */}
            <Tooltip id="attach-tooltip" className="!bg-[#1E1B29] !text-white/90 !border !border-white/10 !rounded-lg !text-xs !px-2 !py-1 shadow-xl" />
        </div>
    );
}