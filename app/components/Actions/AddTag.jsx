"use client";
import { X, Check } from "lucide-react"; 
import { useState, useEffect } from "react"; 

export default function AddTag({ onClose, availableTags = [], currentTargets = [], onToggleTag }) {
  
  const [tagsList, setTagsList] = useState(availableTags);
  
  useEffect(() => {
    setTagsList(availableTags);
  }, [availableTags]);

  // 🟢 [BACKEND NOTE]: เปลี่ยนจากการอ่าน localStorage เป็นการดึงข้อมูลจาก API (หากต้องการให้ Component นี้โหลดข้อมูลเอง)
  useEffect(() => {
    const loadLatestTags = async () => {
        try {
            // 🟢 [API CALL]: โค้ดตัวอย่างการยิง API เพื่อดึง Tags ล่าสุด
            // const response = await fetch('/api/tags');
            // const data = await response.json();
            // setTagsList(data);

            // หมายเหตุ: โดยปกติหาก Parent Component มีการดึงข้อมูลที่อัปเดตล่าสุด 
            // และส่งผ่านมาทาง Props `availableTags` อยู่แล้ว Component นี้ก็อาจจะไม่ต้อง Fetch เองซ้ำครับ
        } catch(e) {
            console.error("Error loading tags from API:", e);
        }
    };
    
    // loadLatestTags();

    // 🟢 [BACKEND NOTE]: เดิมทีระบบใช้ window.addEventListener("storage", ...) เพื่อซิงค์ข้อมูลระหว่าง Tab
    // ในระบบที่มี Backend แนะนำให้เปลี่ยนไปใช้ State Management อย่าง React Query / SWR (มีฟีเจอร์ Refetch on Focus)
    // หรือถ้าต้องการ Real-time สดๆ ข้ามเครื่อง ให้ใช้ WebSocket (เช่น Socket.io, Pusher) แทนครับ
  }, []); 


  return (
    <div 
      className="w-[320px] max-h-[85vh] mt-3 ml-3 bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col self-start" 
      onClick={(e) => e.stopPropagation()}
    >
      
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white text-2xl font-semibold mb-5">Add Tag</h2>
        <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 overflow-auto custom-scrollbar content-start">
        {tagsList.length === 0 ? ( 
            <div className="flex flex-col items-center justify-center w-full py-8 text-center opacity-50">
                <span className="text-2xl mb-2">🏷️</span>
                <p className="text-white text-xs">No tags available.</p>
                <p className="text-white/50 text-[10px]">Create tags in Settings first.</p>
            </div>
        ) : (
            tagsList.map((tag) => {
              const tagName = typeof tag === 'object' ? tag.name : tag;
              const tagColor = typeof tag === 'object' ? tag.color : '#fbbf24';
              const tagEmoji = typeof tag === 'object' ? tag.emoji : '';

              const safeTargets = Array.isArray(currentTargets) ? currentTargets : [];
              const isActive = safeTargets.includes(tagName);

              return (
                <button
                  key={tagName}
                  onClick={() => onToggleTag(tagName)}
                  className={`rounded-full px-4 py-2 text-sm transition-all h-fit flex items-center gap-2 border border-transparent
                    ${isActive ? 'shadow-lg font-bold text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}
                  `}
                  style={{
                    backgroundColor: isActive ? tagColor : undefined,
                    borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.1)' 
                  }}
                >
                  {tagEmoji && <span className="text-base">{tagEmoji}</span>}
                  <span>{tagName}</span>
                  {isActive && <Check size={12} />} 
                </button>
              );
            })
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all mt-auto border border-white/5 text-sm"
      >
        Done
      </button>
    </div>
  );
}