"use client";
import { useState, useEffect } from "react";
import { Bot, Plus, Edit, Trash2, X, BookOpenText } from "lucide-react";
import { DEFAULT_AI_PROMPTS } from "@/app/data/defaultPrompts";

export default function AiPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [newPrompt, setNewPrompt] = useState({ name: "", action: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState(null);
  const [deletePrompt, setDeletePrompt] = useState(null);

  // 🟢 [BACKEND NOTE]: โหลดข้อมูลจาก API เมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/prompts');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setPrompts(data);
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  // เปิด modal สำหรับ add หรือ edit
  const openAddModal = () => {
    setNewPrompt({ name: "", action: "" });
    setEditingPromptId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prompt) => {
    setNewPrompt({ name: prompt.name, action: prompt.action });
    setEditingPromptId(prompt.id);
    setIsModalOpen(true);
  };

  // 🟢 [BACKEND NOTE]: ฟังก์ชันบันทึก (Add / Edit) ต้องยิง API
  const handleSavePrompt = async () => {
    if (!newPrompt.name.trim()) return alert("Please enter a prompt name");

    try {
      if (editingPromptId) {
        await fetch(`/api/prompts/${editingPromptId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPrompt)
        });

        setPrompts(
          prompts.map((p) =>
            p.id === editingPromptId ? { ...p, ...newPrompt } : p
          )
        );
      } else {
        const response = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPrompt)
        });
        const createdPrompt = await response.json();

        setPrompts([
          ...prompts,
          createdPrompt,
        ]);
      }

      setNewPrompt({ name: "", action: "" });
      setEditingPromptId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save prompt:", error);
      alert("Failed to save prompt. Please try again.");
    }
  };

  // เปิด modal ลบ
  const handleOpenDeleteModal = (prompt) => {
    setDeletePrompt(prompt);
  };

  // ยกเลิก modal ลบ
  const handleCloseDeleteModal = () => {
    setDeletePrompt(null);
  };

  // 🟢 [BACKEND NOTE]: ยืนยันลบด้วยการยิง API DELETE
  const handleConfirmDelete = async () => {
    if (!deletePrompt) return;

    try {
      await fetch(`/api/prompts/${deletePrompt.id}`, { method: 'DELETE' });

      setPrompts(prompts.filter((p) => p.id !== deletePrompt.id));
      setDeletePrompt(null);
    } catch (error) {
      console.error("Failed to delete prompt:", error);
      alert("Failed to delete prompt. Please try again.");
    }
  };

  // 🟢 [BACKEND NOTE]: อัปเดตสถานะ Active/Inactive ผ่าน API
  const handleToggle = async (id, currentStatus) => {
    try {
      await fetch(`/api/prompts/${id}`, { // Using the same ID endpoint but PUT method or PATCH based on old backend. Let's send PATCH to the ID route as before
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      });

      setPrompts(
        prompts.map((p) => (p.id === id ? { ...p, active: !currentStatus } : p))
      );
    } catch (error) {
      console.error("Failed to toggle prompt status:", error);
      // อาจจะเพิ่ม Toast Notification แจ้งเตือนผู้ใช้ตรงนี้
    }
  };

  return (
    <div className="w-full h-[95vh] p-4 lg:p-6">
      <div className="bg-[#161223] border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header Section */}
        <div className="p-8 pb-6 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#BE7EC7] flex items-center justify-center shadow-[0_0_20px_rgba(190,126,199,0.3)]">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight leading-none">AI Prompts</h1>
                <p className="text-white/30 text-xs mt-1.5 font-medium">
                  Use AI Prompts to customize and improve how responses are written.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button onClick={openAddModal} className="flex items-center gap-2 bg-[#BE7EC7] hover:bg-[#a66bb0] disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#BE7EC7]/20 transition-all">
                <Plus size={18} /> New Prompt
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 mx-8"></div>

        {/* Prompt list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6">
          <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-white text-center mt-20 animate-pulse font-bold tracking-widest uppercase text-xs">Loading prompts...</div>
          ) : (
            prompts.map((p) => (
              <div
                key={p.id}
                className="group relative bg-[#1F192E] border border-white/5 rounded-[1.8rem] p-4 px-6 flex justify-between items-center transition-all duration-300 hover:border-[#BE7EC7]/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner bg-white/5 text-white/20">
                     <BookOpenText size={24} />
                   </div>
                   <div className="flex flex-col text-left">
                     <div className="flex items-center gap-3">
                       <span className="text-white font-bold tracking-tight">{p.name}</span>
                       {p.isDefault && <span className="bg-amber-500 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest text-white">Default</span>}
                       {!p.active && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest text-white/40">Inactive</span>}
                     </div>
                     <p className="text-white/40 text-xs mt-0.5 font-medium line-clamp-1 max-w-[300px] md:max-w-md lg:max-w-xl">{p.action}</p>
                   </div>
                </div>

                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  {!p.isDefault && (
                    <button onClick={() => handleOpenDeleteModal(p)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button onClick={() => openEditModal(p)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-all border border-white/10 font-bold text-xs uppercase tracking-widest">
                    <Edit size={14} /> Manage
                  </button>

                  <label className="relative inline-flex items-center cursor-pointer ml-3">
                    <input
                      type="checkbox"
                      checked={p.active}
                      onChange={() => handleToggle(p.id, p.active)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:bg-[#BE7EC7] transition-all border border-white/5"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-all shadow-sm"></div>
                  </label>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </div>

      {/* Add / Edit Prompt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[110] p-4">
          <div className="relative bg-[#161223] text-white w-full max-w-[480px] rounded-[2.5rem] border border-white/5 shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white/30 transition-all">
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#BE7EC7] flex items-center justify-center shadow-[0_0_20px_rgba(190,126,199,0.3)]">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{editingPromptId ? "Edit AI Prompt" : "Add AI Prompt"}</h2>
                <p className="text-white/40 text-xs font-medium">Customize your assistant's behavior</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-1.5 ml-1">Prompt Name</label>
                <input
                  type="text"
                  placeholder="e.g. Formal Tone"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#BE7EC7]/50 focus:bg-white/[0.08] outline-none rounded-xl py-2.5 px-4 text-white text-sm transition-all placeholder:text-white/20"
                  value={newPrompt.name}
                  onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-1.5 ml-1">Prompt Action</label>
                <textarea
                  placeholder="Describe what this prompt does..."
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#BE7EC7]/50 focus:bg-white/[0.08] outline-none rounded-xl py-2.5 px-4 text-white text-sm transition-all placeholder:text-white/20 resize-none"
                  rows={4}
                  value={newPrompt.action}
                  onChange={(e) => setNewPrompt({ ...newPrompt, action: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 rounded-2xl bg-white/5 text-white/50 font-bold text-xs uppercase tracking-widest hover:bg-white/10 border border-white/5 transition-all">Cancel</button>
              <button onClick={handleSavePrompt} className="flex-1 py-3.5 rounded-2xl bg-[#BE7EC7] text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#BE7EC7]/20 hover:bg-[#a66bb0] transition-all transform active:scale-95">
                {editingPromptId ? "Save Changes" : "Create Prompt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletePrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[110] p-4">
          <div className="bg-[#1F192E] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 size={32} />
            </div>
            <h2 className="text-white text-xl font-bold mb-2 tracking-tight">Remove Prompt?</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">Are you sure you want to delete <span className="text-white font-bold">"{deletePrompt.name}"</span>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleCloseDeleteModal} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10">Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}