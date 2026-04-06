"use client";
import React, { useState } from "react";
import { 
  BriefcaseBusiness, X, Plus, CheckCircle2, 
  AlertTriangle, Trash2, Facebook, MessageCircle, 
  Link2, Unlink, Info, ShieldCheck, Globe
} from "lucide-react";

export default function ChannelCatalog({ onConnectFacebook, onConnectLine }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // จำลองข้อมูลรายการที่เชื่อมต่อ
  const [connectedAccounts, setConnectedAccounts] = useState([
    { id: 'fb_01', name: "OneChat Facebook Page", platform: "Facebook", type: 'facebook', color: "border-[#1877f2]" },
    { id: 'fb_02', name: "Talka Page", platform: "Facebook", type: 'facebook', color: "border-[#1877f2]" },
    { id: 'line_01', name: "OneChat LINE OA", platform: "LINE OA", type: 'line', color: "border-[#06c755]" },
    { id: 'line_02', name: "Talka LINE", platform: "LINE OA", type: 'line', color: "border-[#06c755]" },
  ]);

  const [confirmTarget, setConfirmTarget] = useState(null);

  const handleRemoveAccount = () => {
    setConnectedAccounts(prev => prev.filter(acc => acc.id !== confirmTarget.id));
    setConfirmTarget(null);
  };

  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2 block";

  return (
    <div className="w-full h-[95vh] p-4 lg:p-6">
      {/* 1. MAIN BACKGROUND CANVAS (สไตล์เดียวกับ User Setting) */}
      <div className="bg-[#161223] border border-white/5 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 pb-6 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#BE7EC7] flex items-center justify-center shadow-[0_0_20px_rgba(190,126,199,0.3)]">
                <BriefcaseBusiness className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Channel Catalog</h1>
                <p className="text-white/30 text-xs mt-2 font-medium">Manage and link your customer communication platforms.</p>
              </div>
            </div>
            <button 
                onClick={() => setIsOpen(true)} 
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 px-6 py-2.5 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
            >
               Active Links ({connectedAccounts.length})
            </button>
          </div>
        </div>

        <div className="h-px bg-white/5 mx-8 mb-8"></div>

        {/* Catalog Cards (หน้าหลัก) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            
            {/* Facebook Card */}
            <div className="p-8 rounded-[2rem] bg-[#1F192E] border border-white/5 flex flex-col hover:border-[#BE7EC7]/30 transition-all duration-300 group shadow-xl">
               <div className="w-16 h-16 rounded-2xl bg-[#1877f2]/10 border border-[#1877f2]/20 flex items-center justify-center text-[#1877f2] mb-8 shadow-inner">
                  <Facebook size={32} fill="currentColor" />
               </div>
               <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Facebook Messenger</h2>
               <p className="text-white/30 text-sm font-medium mb-10 leading-relaxed">Connect your Business Pages to centralize chats and automate your responses.</p>
               <button onClick={onConnectFacebook} className="mt-auto w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-[#BE7EC7] hover:border-[#BE7EC7] transition-all shadow-sm transform active:scale-95">
                  Connect Platform
               </button>
            </div>

            {/* LINE Card */}
            <div className="p-8 rounded-[2rem] bg-[#1F192E] border border-white/5 flex flex-col hover:border-[#BE7EC7]/30 transition-all duration-300 group shadow-xl">
               <div className="w-16 h-16 rounded-2xl bg-[#06c755]/10 border border-[#06c755]/20 flex items-center justify-center text-[#06c755] mb-8 shadow-inner">
                  <MessageCircle size={32} fill="currentColor" />
               </div>
               <h2 className="text-xl font-bold text-white mb-2 tracking-tight">LINE Official Account</h2>
               <p className="text-white/30 text-sm font-medium mb-10 leading-relaxed">Sync your LINE OA messages to respond to customers from a single dashboard.</p>
               <button onClick={onConnectLine} className="mt-auto w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-[#BE7EC7] hover:border-[#BE7EC7] transition-all shadow-sm transform active:scale-95">
                  Connect Platform
               </button>
            </div>

          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="px-10 py-4 bg-black/10 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                <ShieldCheck size={12} className="text-emerald-500/50" />
                <span>Encrypted Connection Active</span>
            </div>
            <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.3em]">Channel Manager v1.4</p>
        </div>
      </div>

      {/* 2. POPUP: CONNECTED LIST (สไตล์เดียวกับ User List) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="relative bg-[#161223] text-white w-full max-w-[500px] rounded-[2.5rem] border border-white/5 shadow-2xl p-8 max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#BE7EC7] shadow-inner">
                    <Link2 size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold tracking-tight">Connected</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#BE7EC7]">Active Integrations</p>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/30 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {connectedAccounts.length > 0 ? (
                connectedAccounts.map((acc) => (
                  <div key={acc.id} className={`group flex items-center justify-between p-5 bg-[#1F192E] border-l-[6px] ${acc.color} rounded-2xl shadow-sm hover:shadow-md transition-all`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        {acc.type === 'facebook' ? <Facebook className="text-[#1877f2]" size={22} fill="currentColor" /> : <MessageCircle className="text-[#06c755]" size={22} fill="currentColor" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight leading-tight">{acc.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1">{acc.platform}</p>
                      </div>
                    </div>
                    <button 
                        onClick={() => setConfirmTarget(acc)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/5 text-white/10 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-20">
                    <Globe size={48} className="mx-auto mb-4 text-white" />
                    <p className="text-xs font-black uppercase tracking-[0.3em]">No Active Links</p>
                </div>
              )}
            </div>

            <button 
                onClick={() => setIsOpen(false)}
                className="mt-8 w-full py-4 rounded-2xl bg-white/5 text-white/40 font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all border border-white/5"
            >
                Close View
            </button>
          </div>
        </div>
      )}

      {/* 3. DISCONNECT CONFIRMATION MODAL */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-[#1F192E] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Disconnect Account?</h2>
            <p className="text-white/40 text-sm mb-10 leading-relaxed font-medium">
                Are you sure you want to unlink <span className="text-white font-bold">{confirmTarget.name}</span>? 
                Synchronizing will stop immediately.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmTarget(null)} className="flex-1 py-3.5 rounded-xl bg-white/5 text-white/50 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleRemoveAccount} className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}