"use client";
import React, { useRef, useState, useEffect } from "react";
import { Tooltip } from 'react-tooltip';
import Picker from "emoji-picker-react";

export default function ChatMessage({ chat, availableAgents, onSelectAiAgent, aiPrompts = [], currentUser, onSendMessage, availableTags = [] }) {
    if (!chat) {
        return (
            <div className="flex-1 flex justify-center items-center text-white/60 text-lg">
                เลือกแชททางซ้ายเพื่อดูข้อความ
            </div>
        );
    }

    const textareaRef = useRef(null);
    const [height, setHeight] = useState(100);
    const [messages, setMessages] = useState([]);

    const [showAiPrompts, setShowAiPrompts] = useState(false);
    const dropdownRef = useRef(null);

    const [showAiModelSelect, setShowAiModelSelect] = useState(false);
    const aiModelDropdownRef = useRef(null);

    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // =========================
    // 🔥 โหลด message ครั้งแรก
    // =========================
    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?chat_session_id=${chat.id}`);
            const data = await res.json();

            const mapped = data.map((msg) => ({
                text: msg.content,
                from: msg.sender_type === "ADMIN" ? "me" : "user",
                time: new Date(msg.created_at).toLocaleTimeString(),
            }));

            setMessages(mapped);

        } catch (err) {
            console.error("โหลดข้อความ error:", err);
        }
    };

    useEffect(() => {
        if (!chat?.id) return;
        fetchMessages();
    }, [chat?.id]);

    // =========================
    // 🔥 SSE REALTIME
    // =========================
    useEffect(() => {
        if (!chat?.id) return;

        const eventSource = new EventSource("/api/line/webhook?stream=true");

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.chatId !== chat.id) return;

                setMessages((prev) => [
                    ...prev,
                    {
                        text: data.text,
                        from: data.from === "me" ? "me" : "user",
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
            } catch (err) {
                console.error("SSE error:", err);
            }
        };

        return () => {
            eventSource.close();
        };
    }, [chat?.id]);

    // =========================
    // 🔥 SEND MESSAGE (แก้แล้ว)
    // =========================
    const handleSendClick = async () => {
        const text = textareaRef.current.value;

        if (text.trim() !== "") {

            // ✅ แสดงทันที (optimistic UI)
            setMessages((prev) => [
                ...prev,
                {
                    text: text,
                    from: "me",
                    time: new Date().toLocaleTimeString(),
                },
            ]);

            try {
                await fetch("/api/messages/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chat_session_id: chat.id,
                        text: text,
                    }),
                });

            } catch (err) {
                console.error("send message error:", err);
            }

            textareaRef.current.value = "";
            textareaRef.current.focus();
            setHeight(100);
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
        <div className="flex-1 min-w-0 h-[85vh] bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-5 mt-3 ml-3 flex flex-col">

            {/* --- Header --- */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-white/20 pb-3 mb-3 gap-3 relative">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-12 h-12 shrink-0">
                        {chat.imgUrl ? (
                            <img src={chat.imgUrl} alt={chat.name} className="w-full h-full rounded-full object-cover shadow-sm bg-gray-700" />
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                {chat.avatar}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-white font-semibold text-lg truncate">{chat.name}</h2>
                        <span className="text-white/60 text-xs">Open : {chat.openTime || chat.time}</span>
                    </div>
                </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-auto space-y-4 text-white/90 pr-2 py-4 flex flex-col">
                {messages.map((msg, index) => {
                    const isMe = msg.from === 'me';
                    return (
                        <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`text-xs ${isMe ? 'text-right' : 'text-left'}`}>
                                {msg.time}
                            </div>
                            <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="mt-4">
                <textarea
                    ref={textareaRef}
                    onKeyDown={handleKeyDown}
                    style={{ height }}
                    className="w-full p-2 bg-transparent text-white"
                    placeholder="Type a message..."
                />

                <button onClick={handleSendClick} className="text-white mt-2">
                    Send
                </button>
            </div>

            <Tooltip id="attach-tooltip" />
        </div>
    );
}