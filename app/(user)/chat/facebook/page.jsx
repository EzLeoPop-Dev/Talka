"use client";

import { useState, useEffect, useMemo, Suspense } from "react"; 
import { useSearchParams } from "next/navigation";

import ChatList from "@/app/components/Chat/ChatList.jsx";
import ChatMessage from '@/app/components/Chat/ChatMessage.jsx';
import ChatFitter from "@/app/components/Chat/ChatFitter";
import ControlPanel from "@/app/components/Actions/ControlPanel";
import AddTag from "@/app/components/Actions/AddTag";
import ContactDetails from "@/app/components/Chat/ChatContactDetail"; 
import AddNote from "@/app/components/Actions/AddNote";
import AiSuppBtn from "@/app/components/AI/AiSuppBtn";
import ChangeStatus from "@/app/components/Actions/Changestatus"; 
import AiAssistantPanel from "@/app/components/AI/AiAssistantPanel";
import ActivityLogPanel from "@/app/components/Actions/ActivityLogPanel";

import "@/app/assets/css/other.css";

// 🟢 [BACKEND NOTE]: ลบการ Import MockData เหล่านี้ออกเมื่อเปลี่ยนไปดึงข้อมูลจาก API จริง
import { unifiedMockData } from '@/app/data/mockData';
import { DEFAULT_TAGS } from "@/app/data/defaultTags";
import { DEFAULT_AI_PROMPTS } from "@/app/data/defaultPrompts";

const CHANNEL_FILTER = "Facebook"; 
const ALL_AVAILABLE_STATUS = ["New Chat", "Open", "Pending", "Closed"];

const DEFAULT_AI_AGENTS = [
    { id: 'receptionist', name: 'Receptionist', emoji: '🛎️', role: 'Front Desk' },
    { id: 'sales', name: 'Sales Agent', emoji: '😝', role: 'Sales' },
    { id: 'support', name: 'Support Agent', emoji: '❤️', role: 'Support' },
];

const processInitialData = (data) => {
    return data.map(chat => ({
        ...chat,
        email: chat.email || null,
        country: chat.country || null,
        tags: Array.isArray(chat.tags) ? chat.tags : (chat.tags ? [chat.tags] : []),
        notes: Array.isArray(chat.notes) ? chat.notes : [],
        status: chat.status || "New Chat",
        openTime: chat.time,
        messages: (chat.messages || []).filter(msg => msg.from !== 'me')
    }));
};

function FacebookChatContent() {
    const searchParams = useSearchParams();
    
    // 🟢 [BACKEND NOTE]: เปลี่ยนค่าเริ่มต้นจาก processInitialData(unifiedMockData) เป็น [] (อาเรย์ว่าง) เพื่อรอรับจาก API
    const [chats, setChats] = useState(() => processInitialData(unifiedMockData));
    const [selectedChatId, setSelectedChatId] = useState(null);
    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    
    // 🟢 [BACKEND NOTE]: เริ่มต้นที่ false เมื่อมี API เพื่อให้โชว์ Loading ระหว่างดึงข้อมูล
    const [isLoaded, setIsLoaded] = useState(true); 

    // Panels 
    const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
    const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
    const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

    // Filters & Data 
    const [activeFilter, setActiveFilter] = useState("All");
    const [activeCompanyFilter, setActiveCompanyFilter] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]); 
    
    // 🟢 [BACKEND NOTE]: ข้อมูลเหล่านี้ควร fetch มาจาก Database ของระบบ (เช่น GET /tags, GET /prompts)
    const [activePrompts, setActivePrompts] = useState(DEFAULT_AI_PROMPTS.filter(p => p.active === true));
    const [availableAgents, setAvailableAgents] = useState(DEFAULT_AI_AGENTS);
    const [availableTags, setAvailableTags] = useState(DEFAULT_TAGS);
    
    // 🟢 [BACKEND NOTE]: ดึงข้อมูลผู้ใช้จาก Token หรือ API /me 
    const [currentUser, setCurrentUser] = useState({ name: "Admin", role: "Owner", avatar: "A" });

    // 🟢 [BACKEND NOTE]: ใช้ useEffect ตัวเดียวสำหรับดึงข้อมูลทั้งหมดเมื่อเข้าหน้าเว็บ
    /*
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // ตัวอย่าง: const resChats = await fetch('/api/chats?channel=Facebook');
                // const chatData = await resChats.json();
                // setChats(processInitialData(chatData));
                setIsLoaded(true);
            } catch (err) { console.error(err); }
        }
        fetchAllData();
    }, []);
    */

    useEffect(() => {
        if (isLoaded) {
            const urlId = searchParams.get('id');
            if (urlId) {
                const idNum = parseInt(urlId);
                const targetChat = chats.find(c => c.id === idNum);
            
                if (targetChat) {
                    setSelectedChatId(idNum);
                    if (targetChat.status === 'New Chat') {
                        // เปลี่ยนสถานะเป็น Open ทันทีที่กดเปิดแชทใหม่
                        handleUpdateStatus('Open'); 
                    }
                }
            }
        }
    }, [searchParams, isLoaded, chats]);

    const addLog = (chatId, type, detail) => {
        if (!chatId) return;
        const newLog = {
            id: Date.now() + Math.random(),
            chatId, type, detail, 
            timestamp: new Date().toISOString(),
            by: currentUser.name
        };
        // 🟢 [BACKEND NOTE]: ควรยิง POST ไปเซฟ Log ที่ Backend ด้วย
        setActivityLogs(prev => [...prev, newLog]);
    };

    const closeAllPanels = () => {
        setIsAddTagModalOpen(false);
        setIsContactDetailsOpen(false);
        setIsAddNoteOpen(false);
        setIsChangeStatusOpen(false);
        setIsActivityLogOpen(false); 
    };

    // Open/Close Modals 
    const handleOpenTagModal = () => { if(selectedChatId) { closeAllPanels(); setIsAddTagModalOpen(true); } else alert("Select a chat first."); };
    const handleCloseTagModal = () => setIsAddTagModalOpen(false);

    const handleOpenContactDetails = () => { if(selectedChatId) { closeAllPanels(); setIsContactDetailsOpen(true); } else alert("Select a chat first."); };
    const handleCloseContactDetails = () => setIsContactDetailsOpen(false);

    const handleOpenAddNote = () => { if(selectedChatId) { closeAllPanels(); setIsAddNoteOpen(true); } else alert("Select a chat first."); };
    const handleCloseAddNote = () => setIsAddNoteOpen(false);

    const handleOpenChangeStatus = () => { if(selectedChatId) { closeAllPanels(); setIsChangeStatusOpen(true); } else alert("Select a chat first."); };
    const handleCloseChangeStatus = () => setIsChangeStatusOpen(false);

    const handleOpenActivityLog = () => { if(selectedChatId) { closeAllPanels(); setIsActivityLogOpen(true); } else alert("Select a chat first."); };
    const handleCloseActivityLog = () => setIsActivityLogOpen(false);

    // ==========================================================
    // 🟢 [BACKEND NOTE]: เปลี่ยนฟังก์ชันด้านล่างนี้ให้เป็น async/await เพื่อยิง API
    // ==========================================================
    const handleToggleTag = async (tagName) => {
        if (!selectedChat) return;
        // 🟢 [BACKEND NOTE]: await fetch(`/api/chats/${selectedChat.id}/tags`, { method: 'PATCH', ... });
        
        setChats(prev => prev.map(chat => {
            if (chat.id === selectedChat.id) {
                const currentTags = Array.isArray(chat.tags) ? chat.tags : [];
                const isSelected = currentTags.includes(tagName);
                addLog(chat.id, 'tag', isSelected ? `Removed tag "${tagName}"` : `Changed tag to "${tagName}"`);
                const newTags = isSelected ? [] : [tagName]; // ถ้าเลือกได้แค่ 1 tag
                return { ...chat, tags: newTags }; 
            }
            return chat; 
        }));
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedChat) return;
        // 🟢 [BACKEND NOTE]: await fetch(`/api/chats/${selectedChat.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
        
        if (selectedChat.status !== newStatus) addLog(selectedChat.id, 'status', `Changed status to "${newStatus}"`);
        setChats(prev => prev.map(c => c.id === selectedChat.id ? { ...c, status: newStatus } : c));
    };

    const handleUpdateContactInfo = async (contactId, info) => {
        const key = Object.keys(info)[0];
        // 🟢 [BACKEND NOTE]: await fetch(`/api/contacts/${contactId}`, { method: 'PUT', body: JSON.stringify(info) });

        addLog(contactId, 'contact', `Updated ${key} to "${info[key]}"`);
        setChats(prev => prev.map(c => c.id === contactId ? { ...c, ...info } : c));
    };

    const handleAddNote = async (noteData) => {
        if (!selectedChatId) return;
        // 🟢 [BACKEND NOTE]: await fetch(`/api/chats/${selectedChatId}/notes`, { method: 'POST', body: JSON.stringify(noteData) });

        addLog(selectedChatId, 'note', `Added note: "${noteData.title}"`);
        setChats(prev => prev.map(c => {
            if (c.id === selectedChatId) {
                const currentNotes = Array.isArray(c.notes) ? c.notes : [];
                return { ...c, notes: [...currentNotes, noteData] };
            }
            return c;
        }));
    };

    const handleDeleteNote = async (noteId) => {
        if (!selectedChatId) return;
        // 🟢 [BACKEND NOTE]: await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });

        addLog(selectedChatId, 'note', `Deleted a note`);
        setChats(prev => prev.map(c => 
            c.id === selectedChatId ? { ...c, notes: c.notes.filter(n => n.id !== noteId) } : c
        ));
    };

    const handleSendMessage = async (chatId, text) => {
        if (!chatId || !text.trim()) return;
        // 🟢 [BACKEND NOTE]: await fetch(`/api/chats/${chatId}/messages`, { method: 'POST', body: JSON.stringify({ text }) });

        addLog(chatId, 'message', `Sent message: "${text.substring(0, 20)}..."`);
        setChats(prev => prev.map(c => {
            if (c.id === chatId) {
                const newMsg = { from: "me", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                return { ...c, messages: [...(c.messages || []), newMsg], message: text, time: newMsg.time };
            }
            return c;
        }));
    };

    const handleSelectAiAgent = (chatId, agent) => {
        if (!chatId) return;
        // 🟢 [BACKEND NOTE]: อัปเดต AI Agent ใน Database ถ้าจำเป็น
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, activeAiAgent: agent, isAiMode: !!agent } : c));
    };

    const handleSelectChat = (chat) => {
        if (selectedChatId === chat.id) { setSelectedChatId(null); closeAllPanels(); }
        else { setSelectedChatId(chat.id); }
    };

    const availableCompanies = useMemo(() => [...new Set(chats.map(c => c.company).filter(Boolean))], [chats]);

    // 🟢 ส่วนนี้คงไว้ กรองเฉพาะ Facebook
    const channelFilteredChats = chats.filter(chat => chat.channel === CHANNEL_FILTER);

    // Filter by Status & Company
    const finalFilteredChats = channelFilteredChats
        .filter(chat => {
            const statusMatch = activeFilter === "All" || chat.status === activeFilter;
            const companyMatch = !activeCompanyFilter || chat.company === activeCompanyFilter;
            return statusMatch && companyMatch; 
        })
        .sort((a, b) => {
            const statusPriority = { "New Chat": 1, "Open": 2, "Pending": 2, "Closed": 3 };
            return (statusPriority[a.status] || 2) - (statusPriority[b.status] || 2);
        });

    // render
    if (!isLoaded) return <div className="text-white text-center mt-20 animate-pulse">Loading...</div>;

    // ==========================================================
    // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ
    // ==========================================================
    return (
        <div className="container mx-auto ">
            
            <ChatFitter 
                onFilterChange={setActiveFilter} 
                availableCompanies={availableCompanies}
                onCompanyChange={setActiveCompanyFilter}
            />

            <div className="flex">
                <ChatList 
                    chats={finalFilteredChats} 
                    onSelectChat={handleSelectChat}
                    selectedId={selectedChatId} 
                    availableTags={availableTags}
                />

                <ChatMessage 
                    chat={selectedChat}
                    availableAgents={availableAgents} 
                    onSelectAiAgent={handleSelectAiAgent}
                    aiPrompts={activePrompts} 
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                    availableTags={availableTags}
                />
                
                {/* Panels */}
                {isAddTagModalOpen && 
                    <AddTag 
                        onClose={handleCloseTagModal} 
                        availableTags={availableTags} 
                        currentTargets={selectedChat ? selectedChat.tags : []} 
                        onToggleTag={handleToggleTag} 
                    />
                }

                {isContactDetailsOpen && 
                    <ContactDetails 
                        onClose={handleCloseContactDetails} 
                        contact={selectedChat} 
                        onUpdateContact={handleUpdateContactInfo} 
                    />
                }

                {isAddNoteOpen && 
                    <AddNote 
                        onClose={handleCloseAddNote} 
                        onSaveNote={handleAddNote} 
                        currentNotes={selectedChat ? selectedChat.notes : []} 
                        onDeleteNote={handleDeleteNote} 
                    />
                }

                {isChangeStatusOpen && 
                    <ChangeStatus 
                        onClose={handleCloseChangeStatus} 
                        availableStatus={ALL_AVAILABLE_STATUS} 
                        currentTargets={selectedChat?.status ? [selectedChat.status] : []} 
                        onToggleStatus={handleUpdateStatus} 
                    />
                }

                {isActivityLogOpen && 
                    <ActivityLogPanel 
                        onClose={handleCloseActivityLog} 
                        logs={activityLogs.filter(log => log.chatId === selectedChatId)} 
                    />
                }
                
                {selectedChatId && (
                    <ControlPanel 
                        onOpenAddTagModal={handleOpenTagModal} 
                        onOpenContactDetails={handleOpenContactDetails} 
                        onOpenAddNote={handleOpenAddNote} 
                        onOpenChangeStatus={handleOpenChangeStatus}
                        onOpenActivityLog={handleOpenActivityLog}
                    />
                )}

                {isAiAssistantOpen && <AiAssistantPanel onClose={() => setIsAiAssistantOpen(false)} availableAgents={availableAgents} />}
                <AiSuppBtn onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)} isOpen={isAiAssistantOpen} />
            </div>
        </div>
    );
}

export default function FacebookChatPage() {
    return (
        <Suspense fallback={<div className="text-white text-center mt-20 animate-pulse">Loading Chat...</div>}>
            <FacebookChatContent />
        </Suspense>
    );
}