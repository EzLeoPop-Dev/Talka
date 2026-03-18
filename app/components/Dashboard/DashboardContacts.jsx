"use client";
import React, { useState, useEffect } from "react";

export default function DashboardContacts() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 [BACKEND NOTE]: ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);

        // 🟢 [API CALL]: ตัวอย่างโค้ดสำหรับดึงข้อมูล Contacts มาแสดงบน Dashboard (อาจจำกัดแค่ 5-10 คนล่าสุด)
        // const response = await fetch('/api/dashboard/contacts?limit=10');
        // const data = await response.json();
        // setContacts(data);

        // ==========================================
        // [Mock Processing] ข้อมูลจำลองเพื่อให้หน้าเว็บแสดงผลได้ระหว่างรอ API
        const mockData = [
          { id: 1, name: "Alice", channel: "Facebook", status: "Open", tags: ["VIP"], imgUrl: "https://ui-avatars.com/api/?name=Alice&background=random" },
          { id: 2, name: "Bob", channel: "Line", status: "Pending", tags: [], imgUrl: "https://ui-avatars.com/api/?name=Bob&background=random" },
          { id: 3, name: "Charlie", channel: "Facebook", status: "New Chat", tags: ["Hot Lead", "New"], imgUrl: "https://ui-avatars.com/api/?name=Charlie&background=random" }
        ];
        
        // จำลอง Delay
        setTimeout(() => {
            setContacts(mockData);
            setIsLoading(false);
        }, 300);
        // ==========================================

      } catch (error) {
        console.error("Error loading contacts:", error);
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // ==========================================================
  // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ 100%
  // ==========================================================
  return (
    <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-4 h-90 w-193 flex flex-col">
      
      <h2 className="text-white/90 text-sm pb-3 mb-4 border-b border-white/20">
        Contacts
      </h2>
      
      <div className="flex flex-col gap-y-4 overflow-y-auto custom-scrollbar pr-2">
        {isLoading ? (
             <p className="text-white/40 text-xs text-center py-4 animate-pulse">Loading contacts...</p>
        ) : contacts.length === 0 ? (
             <p className="text-white/40 text-xs text-center py-4">No contacts found.</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between w-full">
              
              <div className="flex items-start gap-3">
                
                {/* 1. Avatar */}
                <div className="relative shrink-0 w-[45px] h-[45px]">
                  {contact.imgUrl ? (
                    <img
                      src={contact.imgUrl}
                      alt={contact.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {contact.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                
                {/* 2. Info */}
                <div className="flex flex-col">
                  <p className="text-white font-medium text-sm">{contact.name}</p>
                  
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    
                    {/* Channel Icon */}
                    {contact.channel === 'Facebook' && <i className="fa-brands fa-facebook text-blue-500 text-xs"></i>}
                    {contact.channel === 'Line' && <i className="fa-brands fa-line text-green-500 text-xs"></i>}
                    
                    {/* Status */}
                    <p className="text-white/60 text-[10px]">{contact.status}</p>

                    {/* Tags */}
                    {(() => {
                      let tagsArray = [];
                      if (Array.isArray(contact.tags)) tagsArray = contact.tags;
                      else if (contact.tags) tagsArray = [contact.tags];

                      return tagsArray.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          {tag}
                        </span>
                      ));
                    })()}
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