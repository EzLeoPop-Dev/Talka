"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, ShieldCheck, Mail, MoreHorizontal, Shield } from 'lucide-react';

export default function DashboardTeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4; // ปรับเป็น 4 เพื่อให้เต็มพื้นที่ h-550px

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard/my-team-members');
        if (res.ok) {
           const data = await res.json();
           setMembers(data.members || []);
        }
        setLoading(false);
      } catch (error) { setLoading(false); }
    };
    fetchTeamMembers();
  }, []);

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE) || 1;
  const currentItems = members.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-[#161223] border border-white/5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-7 h-[550px] w-full flex flex-col overflow-hidden transition-all duration-300">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-7 shrink-0 px-1">
        <div className="flex flex-col">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#BE7EC7] flex items-center justify-center shadow-[0_0_20px_rgba(190,126,199,0.3)]">
                    <Users size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-white font-bold text-xl tracking-tight leading-none">Team Members</h2>
                    <p className="text-[#BE7EC7] text-[10px] mt-1.5 font-black uppercase tracking-[0.2em] opacity-80">Support Team A</p>
                </div>
            </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
            <MoreHorizontal size={20} />
        </button>
      </div>
      
      {/* Members List Section */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
          {loading ? (
             <div className="space-y-3 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-[84px] bg-white/5 rounded-[1.8rem] w-full"></div>)}
             </div>
          ) : (
            currentItems.map((member) => ( 
              <div key={member.id} className="group relative flex items-center justify-between p-4 bg-[#1F192E] border border-white/[0.03] rounded-[1.8rem] hover:bg-[#251E38] hover:border-[#BE7EC7]/30 transition-all duration-300"> 
                
                {/* Accent Side Bar */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-[#BE7EC7] rounded-r-full transition-all duration-300"></div>

                <div className="flex items-center gap-4">
                  <div className="relative shrink-0 w-14 h-14">
                    <img 
                        src={member.avatar} 
                        className="w-full h-full rounded-2xl border-2 border-white/5 object-cover shadow-lg group-hover:scale-105 transition-transform duration-300" 
                        alt={member.name}
                    />
                    {member.isOnline && (
                      <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center bg-emerald-500 rounded-full border-[3px] border-[#1F192E] group-hover:border-[#251E38] shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold text-base tracking-tight">{member.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        {member.role === "Owner" ? (
                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                <Shield size={10} className="text-amber-500" />
                                <span className="text-amber-500 text-[9px] font-black uppercase tracking-tighter">Owner</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md">
                                <ShieldCheck size={10} className="text-white/40" />
                                <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">{member.role}</span>
                            </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button className="w-10 h-10 rounded-xl bg-[#BE7EC7]/10 text-[#BE7EC7] hover:bg-[#BE7EC7] hover:text-white border border-[#BE7EC7]/20 transition-all flex items-center justify-center shadow-lg">
                        <Mail size={16} />
                    </button>
                </div>
              </div>
            ))
          )}
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage(c => Math.max(1, c-1))} 
            disabled={currentPage === 1} 
            className="w-11 h-11 rounded-2xl bg-[#1F192E] border border-white/5 hover:bg-[#BE7EC7]/20 hover:text-[#BE7EC7] text-white/60 flex items-center justify-center transition-all disabled:opacity-20"
          >
            <ChevronLeft size={22} />
          </button>
          <button 
            onClick={() => setCurrentPage(c => Math.min(totalPages, c+1))} 
            disabled={currentPage === totalPages} 
            className="w-11 h-11 rounded-2xl bg-[#1F192E] border border-white/5 hover:bg-[#BE7EC7]/20 hover:text-[#BE7EC7] text-white/60 flex items-center justify-center transition-all disabled:opacity-20"
          >
            <ChevronRight size={22} />
          </button>
        </div>
        
        <div className="bg-[#1F192E] px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                Page <span className="text-[#BE7EC7]">{currentPage}</span> <span className="mx-1">/</span> {totalPages}
            </span>
        </div>
      </div>
    </div>
  );
}