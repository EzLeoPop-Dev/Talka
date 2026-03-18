"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/app/assets/css/other.css";

//Import Data
// 🟢 [BACKEND NOTE]: ลบข้อมูลจำลองนี้ออกเมื่อต่อ API จริง
import initialChatData from "@/app/data/mockData.js";

// Helper Data Processing
const processInitialData = (data) => {
  if (!data) return [];
  return data.map((chat, index) => ({
    ...chat,
    lastMessage: chat.message,
    platform: chat.platform || (index % 2 === 0 ? "line" : "facebook"),
    columnId: chat.columnId || "col-1",
    messages: chat.messages || []
  }));
};

export default function ChatBoardInlineFinal() {
  // State 
  // 🟢 [BACKEND NOTE]: เปลี่ยนค่าเริ่มต้นเป็น [] (อาเรย์ว่าง) เพื่อรอข้อมูลจาก API
  const [chats, setChats] = useState([]);
  const [columns, setColumns] = useState([
    { id: "col-1", title: "Inbox" },
  ]);

  // 🟢 [BACKEND NOTE]: ให้เริ่มต้นเป็น false พอ fetch ข้อมูลเสร็จค่อยเปลี่ยนเป็น true
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [activeDropdownChatId, setActiveDropdownChatId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageDrafts, setMessageDrafts] = useState({});
  const [showAiModelSelectId, setShowAiModelSelectId] = useState(null);
  const [editingColId, setEditingColId] = useState(null);
  const [tempColTitle, setTempColTitle] = useState("");
  const [isSelectChatModalOpen, setIsSelectChatModalOpen] = useState(false);
  const [targetColumnIdForAdd, setTargetColumnIdForAdd] = useState(null);
  const [chatFilter, setChatFilter] = useState("ALL");
  const [isAddColumnMode, setIsAddColumnMode] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // จำลองฐานข้อมูลหลัก (ทดแทน LocalStorage เพื่อให้กดเพิ่มแชทลง Board ได้)
  // 🟢 [BACKEND NOTE]: ลบตัวแปรนี้ออกเมื่อต่อ API จริง
  const mockDatabaseChats = processInitialData(initialChatData);

  useEffect(() => {
    // 🟢 [BACKEND NOTE]: ตรงนี้ให้เรียกฟังก์ชัน Fetch API เช่น GET /api/board
    loadData();
    
    // จำลองการดึง User (ในของจริงดึงจาก Session/Token)
    setCurrentUser({ username: "Admin", role: "Owner" });
  }, []);

  const loadData = () => {
    // 🟢 [BACKEND NOTE]: จุดนี้คือการ Set ข้อมูลจาก API ใส่ State (ตอนนี้ใช้ Mock ไปก่อน)
    setChats(mockDatabaseChats.map(c => ({ ...c, columnId: "col-1" }))); // สมมติให้อยู่ col-1 หมด
    setColumns([
      { id: "col-1", title: "Inbox" },
      { id: "col-2", title: "In Progress" }
    ]);
    setIsLoaded(true);
  };

  //Logic Functions

  const handleInputChange = (chatId, value) => {
    setMessageDrafts(prev => ({ ...prev, [chatId]: value }));
  };

  const handleSendMessage = async (chatId) => {
    const text = messageDrafts[chatId]?.trim();
    if (!text) return;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 🟢 [BACKEND NOTE]: ใส่คำสั่ง POST ข้อความไปที่เซิร์ฟเวอร์
    // await fetch(`/api/chat/${chatId}/message`, { method: 'POST', body: JSON.stringify({ text }) });

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...(chat.messages || []), { text, from: "me", time: currentTime }];
        return { ...chat, messages: updatedMessages, lastMessage: text, time: currentTime };
      }
      return chat;
    });
    setChats(updatedChats);
    setMessageDrafts(prev => ({ ...prev, [chatId]: "" }));
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;
    if (columns.length >= 3) return;
    
    // 🟢 [BACKEND NOTE]: ใส่คำสั่ง POST สร้าง Column ใหม่ที่เซิร์ฟเวอร์
    // const res = await fetch('/api/board/columns', { method: 'POST', ... });
    // const newCol = await res.json();
    
    const newColId = `col-${Date.now()}`;
    setColumns([...columns, { id: newColId, title: newColumnTitle }]);
    setNewColumnTitle("");
    setIsAddColumnMode(false);
  };

  const handleDeleteColumn = async (colId, e) => {
    e.stopPropagation();
    // 🟢 [BACKEND NOTE]: ใส่คำสั่ง DELETE Column ที่เซิร์ฟเวอร์
    // await fetch(`/api/board/columns/${colId}`, { method: 'DELETE' });

    setColumns(columns.filter((c) => c.id !== colId));
    setChats((prev) => prev.map((chat) => chat.columnId === colId ? { ...chat, columnId: "col-1" } : chat));
  };

  const startEditColumn = (col) => {
    setEditingColId(col.id);
    setTempColTitle(col.title);
  };

  const saveColumnTitle = async () => {
    if (tempColTitle.trim()) {
      // 🟢 [BACKEND NOTE]: ใส่คำสั่ง PATCH แก้ไขชื่อ Column ที่เซิร์ฟเวอร์
      // await fetch(`/api/board/columns/${editingColId}`, { method: 'PATCH', ... });

      setColumns((prev) => prev.map((c) => c.id === editingColId ? { ...c, title: tempColTitle } : c));
    }
    setEditingColId(null);
  };

  const openAddChatModal = (columnId) => {
    setTargetColumnIdForAdd(columnId);
    setChatFilter("ALL");
    setIsSelectChatModalOpen(true);
  };

  const handleAddChatToColumn = async (chatId) => {
    // 🟢 [BACKEND NOTE]: ตรงนี้ต้องเรียก API เพื่ออัปเดต columnId ของ Chat นั้นใน Database
    // await fetch(`/api/board/chats/${chatId}/move`, { method: 'PATCH', body: JSON.stringify({ columnId: targetColumnIdForAdd }) });

    const existingInBoard = chats.find(c => c.id === chatId);
    const freshChat = mockDatabaseChats.find(c => c.id === chatId); // ในของจริงดึงจาก All Chats API

    if (existingInBoard) {
      setChats((prev) => prev.map((chat) =>
        chat.id === chatId ? { ...chat, columnId: targetColumnIdForAdd } : chat
      ));
    } else if (freshChat) {
      const newBoardChat = { ...freshChat, columnId: targetColumnIdForAdd, messages: freshChat.messages || [] };
      setChats(prev => [...prev, newBoardChat]);
    }
    setIsSelectChatModalOpen(false);
  };

  const getFilteredChats = () => {
    // 🟢 [BACKEND NOTE]: ในของจริง ข้อมูลส่วนนี้อาจจะดึงมาจาก API (GET /api/chats) แยกต่างหากเพื่อแสดงรายชื่อทั้งหมด
    let available = mockDatabaseChats;
    if (chatFilter === "LINE") return available.filter((c) => (c.platform || c.channel) === "Line" || c.platform === "line");
    if (chatFilter === "FACEBOOK") return available.filter((c) => (c.platform || c.channel) === "Facebook" || c.platform === "facebook");
    return available;
  };

  const handleToggleChat = (chatId) => {
    setSelectedChatIds((prev) => prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]);
    setActiveDropdownChatId(null);
    setShowAiModelSelectId(null);
  };

  const toggleAiDropdown = (e, chatId) => {
    e.stopPropagation();
    setShowAiModelSelectId((prev) => (prev === chatId ? null : chatId));
  };

  if (!isLoaded) return <div className="bg-slate-900 h-screen w-full flex items-center justify-center text-white/50">Loading...</div>;


  return (
    <div className="relative w-full h-screen overflow-hidden p-4 font-sans text-white" onClick={() => { setActiveDropdownChatId(null); setShowAiModelSelectId(null); }}>
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800 -z-10" />

      <div className="flex h-full gap-4 overflow-x-auto pb-2 items-start no-scrollbar">
        {columns.map((col) => (
          <div key={col.id} className="bg-[rgba(43,50,63,0.2)] border border-[rgba(253,254,253,0.1)] backdrop-blur-md rounded-3xl shadow-xl pt-4 px-3 pb-3 h-full flex flex-col min-w-[85vw] md:min-w-[40vw] lg:min-w-[24vw] shrink-0 transition-all">
            <div className="flex justify-between items-center mb-4 px-2 shrink-0 h-8">
              {editingColId === col.id ? (
                <input autoFocus value={tempColTitle} onChange={(e) => setTempColTitle(e.target.value)} onBlur={saveColumnTitle} onKeyDown={(e) => e.key === "Enter" && saveColumnTitle()} className="bg-black/20 border border-white/20 rounded px-2 py-1 text-lg font-bold text-white w-full mr-2 outline-none" />
              ) : (
                <h2 onClick={() => startEditColumn(col)} className="font-bold text-lg text-white/90 cursor-pointer hover:text-white hover:bg-white/5 px-2 py-1 rounded transition-colors truncate flex-1">{col.title}</h2>
              )}
              <button onClick={(e) => handleDeleteColumn(col.id, e)} className="text-white/40 hover:text-red-400 ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1 min-h-0">
              {chats.filter((c) => c.columnId === col.id).map((chat) => {
                const isOpen = selectedChatIds.includes(chat.id);
                return (
                  <motion.div key={chat.id} className={`border transition-colors duration-300 overflow-hidden rounded-2xl relative flex flex-col ${isOpen ? "bg-slate-800/10 border-white/20 shadow-xl ring-1 ring-white/10" : "bg-white/30 hover:bg-white/10 border-white/10 cursor-pointer"}`}>

                    {!isOpen && (
                      <div onClick={() => handleToggleChat(chat.id)} className="p-3 flex justify-between items-start cursor-pointer select-none shrink-0 relative group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="relative">
                            <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-xl shadow-lg shrink-0">{chat.avatar}</div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-800 ${chat.platform === "line" || chat.channel === "Line" ? "bg-[#06c755]" : "bg-[#1877f2]"}`}>
                              {chat.platform === "line" || chat.channel === "Line" ? (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white" viewBox="0 0 16 16"><path d="M8 0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zM8 2C4.686 2 2 4.686 2 8c0 1.818.813 3.444 2.098 4.604-.15.557-.536 1.623-1.146 2.237.798-.052 1.979-.29 2.778-.998a5.96 5.96 0 0 0 2.27.457c3.314 0 6-2.686 6-6S11.314 2 8 2z" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" /></svg>)}
                            </div>
                          </div>
                          <div className="min-w-0 flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h3 className="font-semibold truncate text-white/90 text-sm">{chat.name}</h3>
                            </div>
                            <p className="text-xs text-white/50 truncate">{chat.lastMessage || chat.message || "Click to chat"}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1"><span className="text-[9px] text-white/30 mt-1">{chat.time}</span></div>
                      </div>
                    )}

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 420, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} className="flex flex-col h-full">
                          <div className="flex items-center justify-between border-b border-white/10 p-3 bg-black/10 shrink-0 relative" onClick={() => handleToggleChat(chat.id)}>
                            <div className="flex items-center gap-3 cursor-pointer">
                              <div className="relative">
                                <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-xl shadow-lg shrink-0">{chat.avatar}</div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-800 ${chat.platform === "line" || chat.channel === "Line" ? "bg-[#06c755]" : "bg-[#1877f2]"}`}>
                                  {chat.platform === "line" || chat.channel === "Line" ? (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white" viewBox="0 0 16 16"><path d="M8 0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zM8 2C4.686 2 2 4.686 2 8c0 1.818.813 3.444 2.098 4.604-.15.557-.536 1.623-1.146 2.237.798-.052 1.979-.29 2.778-.998a5.96 5.96 0 0 0 2.27.457c3.314 0 6-2.686 6-6S11.314 2 8 2z" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" /></svg>)}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h2 className="text-white font-semibold text-sm">{chat.name}</h2>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5"><span className="border border-white/20 bg-white/10 text-white/90 text-[9px] px-2 py-0.5 rounded-full">{chat.status || "Open"}</span></div>
                              </div>
                            </div>
                            <div className="relative">
                              <button onClick={(e) => toggleAiDropdown(e, chat.id)} className={`flex items-center gap-2 border border-white/20 rounded-lg px-3 py-1.5 transition-colors ${showAiModelSelectId === chat.id ? "bg-white/20" : "bg-white/5 hover:bg-white/10"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                                  <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
                                </svg>
                                <span className="text-white text-xs font-medium hidden sm:inline">Select AI</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-white/50 transition-transform ${showAiModelSelectId === chat.id ? "rotate-180" : ""}`}>
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </button>
                              {showAiModelSelectId === chat.id && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                  <div className="px-4 py-2 text-[10px] font-bold text-white/40 tracking-wider uppercase border-b border-white/5">Available Models</div>
                                  <div className="py-1">
                                    {['Receptionist', 'Sales Agent', 'Support Agent'].map((m, i) => {
                                      const emojis = ['🛎️', '😆', '❤️'];
                                      return (
                                        <button key={m} className="w-full text-left px-4 py-2.5 hover:bg-white/5 flex items-center gap-3 transition-colors group">
                                          <div className="text-xl group-hover:scale-110 transition-transform">{emojis[i]}</div>
                                          <div className="text-white text-sm font-medium">{m}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 bg-transparent">
                            {chat.messages && chat.messages.map((msg, index) => {
                              const isMe = msg.from === "me";
                              return (
                                <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"} mb-2`}>
                                  <div className={`flex items-center gap-2 mb-1 text-[10px] text-white/50 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className="font-semibold">{isMe ? (currentUser?.username || "Me") : chat.name}</span>
                                    {msg.time && <span>{msg.time}</span>}
                                  </div>
                                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? "bg-white text-gray-900 rounded-tr-none" : "bg-white/10 text-white/90 rounded-tl-none border border-white/10"}`}>
                                    {msg.text}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="p-3 shrink-0 mt-2">
                            <div className="bg-[#2b2b2b]/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-lg relative group">
                              <textarea
                                placeholder="Type a message..."
                                value={messageDrafts[chat.id] || ""}
                                onChange={(e) => handleInputChange(chat.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(chat.id);
                                  }
                                }}
                                className="w-full bg-transparent text-white text-sm px-1 outline-none resize-none h-14 placeholder-white/30 custom-scrollbar"
                              />
                              <div className="h-1 w-full bg-white/10 my-2"></div>

                              <div className="flex justify-between items-center pt-2">
                                <div className="flex gap-3 text-white/60">
                                  <button className="hover:text-purple-400 transition" title="AI Rewrite"><i className="fa-solid fa-wand-magic-sparkles"></i></button>
                                  <button className="hover:text-white transition" title="Add Media"><i className="fa-solid fa-icons"></i></button>
                                  <button className="hover:text-white transition" title="Attach File"><i className="fa-solid fa-paperclip"></i></button>
                                </div>
                                <button onClick={() => handleSendMessage(chat.id)} className="text-white hover:text-blue-400 transition-transform hover:scale-110">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              <button onClick={() => openAddChatModal(col.id)} className="w-full py-3 border-2 border-dashed border-white/10 rounded-2xl text-white/40 hover:text-white/80 hover:bg-white/5 transition-all flex justify-center items-center gap-2 mt-2 shrink-0">
                <span>+ Add Card</span>
              </button>
            </div>
          </div>
        ))}

        {columns.length < 3 && (
          <div className="min-w-[250px] pt-2">
            {isAddColumnMode ? (
              <div className="bg-[rgba(32,41,59,0.25)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl p-4">
                <input autoFocus className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 outline-none mb-2" placeholder="List Name..." value={newColumnTitle} onChange={(e) => setNewColumnTitle(e.target.value)} />
                <div className="flex gap-2 mt-2"><button onClick={handleAddColumn} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm">Add</button><button onClick={() => setIsAddColumnMode(false)} className="text-white/50 text-sm">X</button></div>
              </div>
            ) : (
              <button onClick={() => setIsAddColumnMode(true)} className="w-full bg-[rgba(32,41,59,0.25)] hover:bg-[rgba(32,41,59,0.4)] border border-[rgba(254,253,253,0.2)] text-white/70 h-14 rounded-3xl backdrop-blur-xl transition-all">+ Add another list</button>
            )}
          </div>
        )}
      </div>

      {isSelectChatModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-white/20 rounded-3xl p-6 w-[600px] shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-white text-xl font-semibold">Select Chat</h3>
              <button onClick={() => setIsSelectChatModalOpen(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
            <div className="flex bg-slate-700/50 rounded-xl p-1 mb-4 shrink-0">
              {["ALL", "LINE", "FACEBOOK"].map((f) => (
                <button key={f} onClick={() => setChatFilter(f)} className={`flex-1 py-2 text-xs rounded-lg transition-all ${chatFilter === f ? "bg-white/20 text-white shadow" : "text-white/40"}`}>{f}</button>
              ))}
            </div>
            <div className="overflow-y-auto space-y-2 no-scrollbar pr-2 flex-1">
              {getFilteredChats().length === 0 ? (<p className="text-center text-white/30 py-8">No chats found</p>) : (
                getFilteredChats().map(chat => {
                  const currentChatOnBoard = chats.find(c => c.id === chat.id);
                  const isInCurrentColumn = currentChatOnBoard?.columnId === targetColumnIdForAdd;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleAddChatToColumn(chat.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all relative overflow-hidden
                                    ${isInCurrentColumn
                          ? "bg-white/5 border-white/5 opacity-70"
                          : "hover:bg-white/10 border-transparent hover:border-white/10"
                        }`}
                    >
                      {isInCurrentColumn && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>}

                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-gray-600 to-gray-500 flex items-center justify-center text-sm font-bold text-white shrink-0">{chat.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-white/90 text-sm font-medium truncate">{chat.name}</span>
                          <span className={`text-[9px] px-1.5 rounded ${chat.platform === "line" || chat.channel === "Line" ? "bg-[#06c755]/20 text-[#06c755]" : "bg-[#1877f2]/20 text-[#1877f2]"}`}>{chat.platform === "line" || chat.channel === "Line" ? "LINE" : "FB"}</span>
                        </div>
                        <p className="text-xs text-white/40 truncate mt-0.5">
                          {isInCurrentColumn
                            ? "Already in this list"
                            : currentChatOnBoard
                              ? `Move from: ${columns.find(c => c.id === currentChatOnBoard.columnId)?.title || "Other List"}`
                              : (chat.lastMessage || chat.message || "No messages")
                          }
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}