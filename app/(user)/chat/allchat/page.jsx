"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ส่วนประกอบ UI ต่างๆ
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
import SendToBoardModal from "@/app/components/Modals/SendToBoardModal";

import "@/app/assets/css/other.css";

// 🟢 [BACKEND NOTE]: เมื่อเชื่อมต่อ Backend จริง ให้ลบการ Import MockData เหล่านี้ออก
// และเปลี่ยนไปใช้การ Fetch ข้อมูลจาก API แทน
import { unifiedMockData } from '@/app/data/mockData';
import { DEFAULT_TAGS } from "@/app/data/defaultTags";
import { DEFAULT_AI_PROMPTS } from "@/app/data/defaultPrompts";

const ALL_AVAILABLE_STATUS = ["New Chat", "Open", "Pending", "Closed"];

const DEFAULT_AI_AGENTS = [
    { id: 'receptionist', name: 'Receptionist', emoji: '🛎️', role: 'Front Desk' },
    { id: 'sales', name: 'Sales Agent', emoji: '😝', role: 'Sales' },
    { id: 'support', name: 'Support Agent', emoji: '❤️', role: 'Support' },
];

// ฟังก์ชันจัด Format ข้อมูล (เก็บไว้ใช้จัดการข้อมูลที่ได้จาก API ได้)
const processInitialData = (data) => {
    return data.map(chat => ({
        ...chat,
        email: chat.email || null,
        country: chat.country || null,
        tags: Array.isArray(chat.tags) ? chat.tags : (chat.tags ? [chat.tags] : []),
        notes: chat.notes || [],
        status: chat.status || "New Chat",
        openTime: chat.time,
        messages: (chat.messages || []).filter(msg => msg.from !== 'me')
    }));
};

function ChatPageContent() {
    const searchParams = useSearchParams();

    // 🟢 [BACKEND NOTE]: เปลี่ยนค่าเริ่มต้นจาก processInitialData(unifiedMockData) เป็น [] (อาเรย์ว่าง)
    const [chats, setChats] = useState(() => processInitialData(unifiedMockData));
    const [selectedChatId, setSelectedChatId] = useState(null);
    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    
    // 🟢 [BACKEND NOTE]: เมื่อต่อ Backend ให้เริ่มที่ false เพื่อรอโหลดข้อมูลจาก API ก่อนค่อยแสดงผล
    const [isLoaded, setIsLoaded] = useState(true);

    // State สำหรับ UI Modals
    const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
    const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
    const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
    const [isSendToBoardOpen, setIsSendToBoardOpen] = useState(false);

    const [activeFilter, setActiveFilter] = useState("All");
    const [activeCompanyFilter, setActiveCompanyFilter] = useState(null);
    
    // 🟢 [BACKEND NOTE]: ข้อมูล User ควรดึงมาจาก Auth Session หรือ API /me
    const [currentUser, setCurrentUser] = useState({ name: "Admin", role: "Admin", avatar: "A" });

    // 🟢 [BACKEND NOTE]: ข้อมูลพวกนี้ในอนาคตควร Fetch มาจาก API ทั้งหมด (เช่น GET /tags, GET /logs)
    const [activityLogs, setActivityLogs] = useState([]);
    const [activePrompts, setActivePrompts] = useState(DEFAULT_AI_PROMPTS.filter(p => p.active === true));
    const [availableAgents, setAvailableAgents] = useState(DEFAULT_AI_AGENTS);
    const [availableTags, setAvailableTags] = useState(DEFAULT_TAGS);

    // 🟢 [BACKEND NOTE]: เพิ่ม useEffect สำหรับดึงข้อมูลจาก API ครั้งแรกที่นี่
    /* useEffect(() => {
        const loadData = async () => {
           const res = await fetch('/api/chats');
           const data = await res.json();
           setChats(processInitialData(data));
           setIsLoaded(true);
        }
        loadData();
    }, []); 
    */

    useEffect(() => {
        const urlId = searchParams.get('id');
        if (urlId) {
            const idNum = parseInt(urlId);
            const targetChat = chats.find(c => c.id === idNum);
            if (targetChat) {
                setSelectedChatId(idNum);
                if (targetChat.status === 'New Chat') {
                    handleUpdateStatus('Open'); 
                }
            }
        }
    }, [searchParams, chats]);

    // 🟢 [BACKEND NOTE]: ทุกฟังก์ชัน handle ด้านล่างนี้ ต้องเปลี่ยนเป็น async และยิง API ก่อนค่อย setChats
    
    const addLog = (chatId, type, detail) => {
        if (!chatId) return;
        const newLog = {
            id: Date.now() + Math.random(),
            chatId,
            type,
            detail,
            timestamp: new Date().toISOString(),
            by: currentUser.name
        };
        // 🟢 ตรงนี้ต้องเพิ่ม: await fetch('/api/logs', { method: 'POST', ... })
        setActivityLogs(prev => [...prev, newLog]);
    };

    const handleToggleTag = async (tagName) => {
        if (!selectedChat) return;
        // 🟢 ตรงนี้ต้องเพิ่ม: await fetch(`/api/chats/${selectedChat.id}/tags`, { method: 'PATCH', ... })
        setChats(currentChats =>
            currentChats.map(chat => {
                if (chat.id === selectedChat.id) {
                    const currentTags = Array.isArray(chat.tags) ? chat.tags : [];
                    const isSelected = currentTags.includes(tagName);
                    addLog(chat.id, 'tag', isSelected ? `Removed tag "${tagName}"` : `Changed tag to "${tagName}"`);
                    return { ...chat, tags: isSelected ? [] : [tagName] };
                }
                return chat;
            })
        );
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedChat) return;
        // 🟢 ตรงนี้ต้องเพิ่ม: await fetch(`/api/chats/${selectedChat.id}/status`, { method: 'PATCH', ... })
        addLog(selectedChat.id, 'status', `Changed status from "${selectedChat.status}" to "${newStatus}"`);
        setChats(currentChats =>
            currentChats.map(chat =>
                chat.id === selectedChat.id ? { ...chat, status: newStatus } : chat
            )
        );
    };

    const handleUpdateContactInfo = async (contactId, updatedInfo) => {
        // 🟢 ตรงนี้ต้องเพิ่ม: await fetch(`/api/contacts/${contactId}`, { method: 'PUT', ... })
        addLog(contactId, 'contact', `Updated information`);
        setChats(currentChats =>
            currentChats.map(chat =>
                chat.id === contactId ? { ...chat, ...updatedInfo } : chat
            )
        );
    };

    const handleAddNote = async (noteData) => {
        if (!selectedChatId) return;
        // 🟢 ตรงนี้ต้องเพิ่ม: await fetch(`/api/chats/${selectedChatId}/notes`, { method: 'POST', ... })
        addLog(selectedChatId, 'note', `Added note: "${noteData.title}"`);
        setChats(currentChats =>
            currentChats.map(chat =>
                chat.id === selectedChatId ? { ...chat, notes: [...chat.notes, noteData] } : chat
            )
        );
    };

    const handleSendMessage = async (chatId, text) => {
        if (!chatId || !text.trim()) return;
        // 🟢 ตรงนี้ต้องเพิ่ม: await fetch(`/api/chats/${chatId}/messages`, { method: 'POST', ... })
        addLog(chatId, 'message', `Sent message`);
        setChats(currentChats =>
            currentChats.map(chat => {
                if (chat.id === chatId) {
                    const newMessage = {
                        from: "me",
                        text: text,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    return { ...chat, messages: [...chat.messages, newMessage], message: text, time: newMessage.time };
                }
                return chat;
            })
        );
    };

    // Filter & Sort Logic (ส่วนนี้เก็บไว้ใช้ได้เลย ไม่ต้องลบ)
    const availableCompanies = useMemo(() => [...new Set(chats.map(c => c.company).filter(Boolean))], [chats]);
    const statusPriority = { "New Chat": 1, "Open": 2, "Pending": 2, "Closed": 3 };

    const filteredChats = chats
        .filter(chat => {
            const statusMatch = activeFilter === "All" || chat.status === activeFilter;
            const companyMatch = !activeCompanyFilter || chat.company === activeCompanyFilter;
            return statusMatch && companyMatch;
        })
        .sort((a, b) => (statusPriority[a.status] || 2) - (statusPriority[b.status] || 2));

    const closeAllPanels = () => {
        setIsAddTagModalOpen(false);
        setIsContactDetailsOpen(false);
        setIsAddNoteOpen(false);
        setIsChangeStatusOpen(false);
        setIsActivityLogOpen(false);
        setIsSendToBoardOpen(false);
    };

    return (
        <div className="container mx-auto">
            <ChatFitter onFilterChange={setActiveFilter} availableCompanies={availableCompanies} onCompanyChange={setActiveCompanyFilter} />
            <div className="flex">
                <ChatList chats={filteredChats} onSelectChat={(chat) => setSelectedChatId(chat.id)} selectedId={selectedChatId} availableTags={availableTags} />
                <ChatMessage 
                    chat={selectedChat} 
                    availableAgents={availableAgents} 
                    onSelectAiAgent={(id, agent) => {
                        setChats(prev => prev.map(c => c.id === id ? { ...c, activeAiAgent: agent, isAiMode: !!agent } : c));
                    }} 
                    aiPrompts={activePrompts} 
                    currentUser={currentUser} 
                    onSendMessage={handleSendMessage} 
                    availableTags={availableTags} 
                />
                
                {/* Right Side Panels */}
                {isAddTagModalOpen && <AddTag onClose={() => setIsAddTagModalOpen(false)} availableTags={availableTags} currentTargets={selectedChat?.tags || []} onToggleTag={handleToggleTag} />}
                {isContactDetailsOpen && <ContactDetails onClose={() => setIsContactDetailsOpen(false)} contact={selectedChat} onUpdateContact={handleUpdateContactInfo} />}
                {isAddNoteOpen && <AddNote onClose={() => setIsAddNoteOpen(false)} onSaveNote={handleAddNote} currentNotes={selectedChat?.notes || []} onDeleteNote={(id) => {
                    // 🟢 ตรงนี้ต้องเพิ่ม: await fetch(`/api/notes/${id}`, { method: 'DELETE' })
                    setChats(prev => prev.map(c => c.id === selectedChatId ? { ...c, notes: c.notes.filter(n => n.id !== id) } : c));
                }} />}
                {isChangeStatusOpen && <ChangeStatus onClose={() => setIsChangeStatusOpen(false)} availableStatus={ALL_AVAILABLE_STATUS} currentTargets={selectedChat?.status ? [selectedChat.status] : []} onToggleStatus={handleUpdateStatus} />}
                {isActivityLogOpen && <ActivityLogPanel onClose={() => setIsActivityLogOpen(false)} logs={activityLogs.filter(log => log.chatId === selectedChatId)} />}
                
                {selectedChatId && (
                    <ControlPanel 
                        onOpenAddTagModal={() => { closeAllPanels(); setIsAddTagModalOpen(true); }}
                        onOpenContactDetails={() => { closeAllPanels(); setIsContactDetailsOpen(true); }}
                        onOpenAddNote={() => { closeAllPanels(); setIsAddNoteOpen(true); }}
                        onOpenChangeStatus={() => { closeAllPanels(); setIsChangeStatusOpen(true); }}
                        onOpenActivityLog={() => { closeAllPanels(); setIsActivityLogOpen(true); }}
                        onOpenSendToBoard={() => { closeAllPanels(); setIsSendToBoardOpen(true); }}
                    />
                )}
                <AiSuppBtn onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)} isOpen={isAiAssistantOpen} />
                {isAiAssistantOpen && <AiAssistantPanel onClose={() => setIsAiAssistantOpen(false)} availableAgents={availableAgents} />}
            </div>
            {isSendToBoardOpen && selectedChat && <SendToBoardModal onClose={() => setIsSendToBoardOpen(false)} chat={selectedChat} />}
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="text-white text-center mt-20 animate-pulse">Loading Chat Data...</div>}>
            <ChatPageContent />
        </Suspense>
    );
}