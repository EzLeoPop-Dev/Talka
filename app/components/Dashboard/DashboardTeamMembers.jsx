"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 

export default function DashboardTeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 [BACKEND NOTE]: ไม่จำเป็นต้องเก็บ State 'myTeamName' ถ้าไม่ได้โชว์บน UI แต่ถ้าจะโชว์ก็เก็บมาด้วยได้ครับ
  const [myTeamName, setMyTeamName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3; 

  // 🟢 [BACKEND NOTE]: เปลี่ยนการโหลดข้อมูลมาใช้ API แทน LocalStorage
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);

        // 🟢 [API CALL]: ขอรายชื่อเพื่อนร่วมทีมของฉัน
        // const response = await fetch('/api/dashboard/my-team-members');
        // const data = await response.json();
        // setMyTeamName(data.teamName);
        // setMembers(data.members); 

        // ==========================================
        // [Mock Processing] จำลองข้อมูลระหว่างรอ API
        const mockMyTeamName = "Support Team A";
        const mockMembers = [
            { id: 1, name: "Somchai Admin", role: "Owner", avatar: "https://ui-avatars.com/api/?name=Somchai+Admin&background=random" },
            { id: 2, name: "Employee A", role: "Member", avatar: "https://ui-avatars.com/api/?name=Employee+A&background=random" },
            { id: 3, name: "Employee B", role: "Member", avatar: "https://ui-avatars.com/api/?name=Employee+B&background=random" },
            { id: 4, name: "Employee C", role: "Member", avatar: "https://ui-avatars.com/api/?name=Employee+C&background=random" },
        ];

        setMyTeamName(mockMyTeamName);
        
        // จำลอง Delay ให้เห็นหน้า Loading แบบสวยๆ
        setTimeout(() => {
            setMembers(mockMembers);
            setLoading(false);
        }, 300);
        // ==========================================

      } catch (error) {
        console.error("Error fetching team members", error);
        setMembers([]);
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Pagination Logic 
  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE) || 1; // กัน Error หารด้วย 0
  const currentItems = members.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(curr => curr + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(curr => curr - 1);
  };


  // ==========================================================
  // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ 100%
  // ==========================================================
  return (
    <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-4 h-90 w-193 ml-3 flex flex-col">
      
      <h2 className="text-white/90 text-sm pb-3 mb-4 border-b border-white/20 shrink-0">
        Team Members
      </h2>
      
      <div className="flex flex-col gap-y-4 grow">
        
        <div className="transition-opacity duration-150 opacity-100">
          
          {loading ? (
             <div className="text-white/50 p-4 text-xs text-center animate-pulse mt-10">Loading team...</div>
          ) : members.length > 0 ? (
            currentItems.map((member) => ( 
              <div key={member.id} className="flex items-center justify-between w-full py-2"> 
                
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={45} 
                      height={45}
                      className="rounded-full"
                    />
                    {/* ถ้ามี property isOnline ในอนาคตค่อยเปิดใช้ */}
                    {member.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[rgba(32,41,59,0.5)] rounded-full"></span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="text-white text-sm font-medium">{member.name}</p>
                    <p className="text-white/60 text-xs">{member.role}</p>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/40 text-xs italic gap-2 py-8">
                <i className="fa-solid fa-users-slash text-2xl"></i>
                <p>You are not in any team.</p>
            </div>
          )}
        
        </div>
        
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20 shrink-0 ">
        <div className="flex items-center gap-3">
          
          <span 
            onClick={handlePrevPage} 
            className={`text-white/60 cursor-pointer transition-colors ${currentPage === 1 ? 'opacity-40 pointer-events-none' : 'hover:text-white'}`}
          >
            &lt;
          </span>
          
          <span 
            onClick={handleNextPage} 
            className={`text-white/60 cursor-pointer transition-colors ${currentPage === totalPages ? 'opacity-40 pointer-events-none' : 'hover:text-white'}`}
          >
            &gt;
          </span>
        </div>
        
        <span className="text-white/60 text-xs">
          Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
        </span>
      </div>

    </div>
  );
}