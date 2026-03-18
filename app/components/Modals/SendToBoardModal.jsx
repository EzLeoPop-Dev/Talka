"use client";
import { useState, useEffect } from "react";

export default function SendToBoardModal({ onClose, chat }) {
    const [columns, setColumns] = useState([]);
    const [selectedColId, setSelectedColId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 🟢 [BACKEND NOTE]: โหลดรายชื่อ Column ของ Board จาก API
    useEffect(() => {
        const fetchBoardColumns = async () => {
            try {
                // 🟢 [API CALL]: ขอข้อมูล Column ทั้งหมด
                // const response = await fetch('/api/board/columns');
                // const data = await response.json();
                // setColumns(data);
                // if (data.length > 0) setSelectedColId(data[0].id);

                // ==========================================
                // [Mock Processing] ข้อมูลจำลองระหว่างรอ Backend
                const defaultCols = [
                    { id: "col-1", title: "Inbox" },
                    { id: "col-2", title: "In Progress" },
                    { id: "col-3", title: "Done" }
                ];
                setColumns(defaultCols);
                setSelectedColId("col-1");
                // ==========================================

            } catch (error) {
                console.error("Error loading columns", error);
            }
        };

        fetchBoardColumns();
    }, []);

    // 🟢 [BACKEND NOTE]: ส่งข้อมูลแชทเข้า Board ผ่าน API
    const handleConfirm = async () => {
        if (!selectedColId || !chat) return;
        setIsLoading(true);

        try {
            const payload = {
                chatId: chat.id,
                columnId: selectedColId,
                platform: chat.platform || (chat.channel === 'Line' ? 'line' : 'facebook'),
                lastMessage: chat.messages && chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1].text 
                    : (chat.message || "No messages"),
                tags: chat.tags || [],
                notes: chat.notes || [],
            };

            // 🟢 [API CALL 1]: บันทึก/อัปเดตแชทลงใน Board
            // await fetch('/api/board/chats', {
            //     method: 'POST', // หรือ PUT ถ้าเป็นการย้ายคอลัมน์
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });

            // 🟢 [API CALL 2]: สร้าง Activity Log ว่ามีการย้ายแชท
            // const targetCol = columns.find(c => c.id === selectedColId);
            // const colName = targetCol ? targetCol.title : "Board";
            // await fetch('/api/activity-logs', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         chatId: chat.id,
            //         type: 'status', 
            //         detail: `Moved chat to list: "${colName}"`,
            //     })
            // });

            // จำลอง Delay เพื่อโชว์ปุ่ม Saving...
            setTimeout(() => {
                setIsLoading(false);
                onClose(); 
            }, 300);

        } catch (error) {
            console.error("Error sending to board:", error);
            setIsLoading(false);
            alert("Failed to send to board.");
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-6 w-[400px] shadow-2xl flex flex-col relative" onClick={e => e.stopPropagation()}>
                
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">Send to Board</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>

                <div className="text-white/70 text-sm mb-4">
                    Select a list to move <b>{chat.name}</b> to:
                </div>

                <div className="space-y-2 mb-6 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {columns.map((col) => (
                        <button
                            key={col.id}
                            onClick={() => setSelectedColId(col.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                selectedColId === col.id 
                                ? "bg-purple-600/20 border-purple-500 text-white" 
                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                            }`}
                        >
                            <span className="font-medium">{col.title}</span>
                            {selectedColId === col.id && (
                                <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Confirm"}
                </button>

            </div>
        </div>
    );
}