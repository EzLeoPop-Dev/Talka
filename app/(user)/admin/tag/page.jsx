"use client";
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X, Tag, Sparkles, Hash, Info, AlertTriangle } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTag, setEditTag] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [deleteTag, setDeleteTag] = useState(null);
  const [newTag, setNewTag] = useState({ name: "", color: "#BE7EC7", description: "", emoji: "🏷️" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const colors = ["#FF4D4D", "#FF8C00", "#FFD700", "#4ade80", "#60a5fa", "#BE7EC7", "#BA55D3", "#FF69B4"];

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoaded(false);
      const response = await fetch("/api/tags");
      if (!response.ok) throw new Error("Failed to fetch tags");
      const tagsData = await response.json();
      setTags(tagsData);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch tags", error);
      setError("Failed to load tags");
    } finally {
      setIsLoaded(true);
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.name) return;
    try {
      setIsLoading(true);
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag)
      });
      if (!response.ok) throw new Error("Failed to create tag");
      const createdTag = await response.json();
      setTags([...tags, createdTag]);
      setNewTag({ name: "", color: "#BE7EC7", description: "", emoji: "🏷️" });
      setIsModalOpen(false);
      setError(null);
    } catch (error) {
      console.error("Error creating tag:", error);
      setError("Failed to create tag");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteTag = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tags/${deleteTag.id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete tag");
      setTags(tags.filter((t) => t.id !== deleteTag.id));
      setDeleteTag(null);
      setError(null);
    } catch (error) {
      console.error("Error deleting tag:", error);
      setError("Failed to delete tag");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditColor = async (id, color) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color })
      });
      if (!response.ok) throw new Error("Failed to update tag");
      setTags(tags.map((tag) => (tag.id === id ? { ...tag, color } : tag)));
      setIsEditModalOpen(false);
      setEditTag(null);
      setError(null);
    } catch (error) {
      console.error("Error updating tag:", error);
      setError("Failed to update tag");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.03] border border-white/10 focus:border-[#BE7EC7]/50 focus:bg-white/[0.08] outline-none rounded-xl py-2.5 px-4 text-white text-sm transition-all";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-1.5 ml-1";

  return (
    <div className="w-full h-[94vh] p-4 lg:p-6 ">
      <div className="bg-[#161223] border border-white/5 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-6 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#BE7EC7] flex items-center justify-center shadow-[0_0_20px_rgba(190,126,199,0.3)]">
                <Tag className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Tags Management</h1>
                <p className="text-white/30 text-xs mt-1.5 font-medium">Categorize and organize your workspace conversations</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#BE7EC7] hover:bg-[#a66bb0] disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl transition-all font-bold text-sm shadow-lg shadow-[#BE7EC7]/20"
            >
              <Plus size={18} /> Create New Tag
            </button>
          </div>
        </div>

        <div className="h-px bg-white/5 mx-8"></div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-sm flex items-center gap-3">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Tags Display Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/20 animate-pulse">
              <Sparkles size={48} className="mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs">Syncing Tags...</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5">
                <Tag size={40} className="text-white/10" />
              </div>
              <h2 className="text-white text-xl font-bold mb-2">No Tags Found</h2>
              <p className="text-white/30 text-sm max-w-xs mx-auto">Start organizing your workspace by creating your first custom tag.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div key={tag.id} className="group bg-[#1F192E] border border-white/5 rounded-[1.8rem] p-5 hover:border-[#BE7EC7]/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                        {tag.emoji}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base group-hover:text-[#BE7EC7] transition-colors">{tag.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></div>
                          <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Color Code</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditTag(tag); setIsEditModalOpen(true); }} disabled={isLoading} className="p-2 text-white/20 hover:text-white hover:bg-white/5 disabled:opacity-50 rounded-lg transition-all"><Edit size={16} /></button>
                      <button onClick={() => setDeleteTag(tag)} disabled={isLoading} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed font-medium line-clamp-2">{tag.description || "No description provided for this tag."}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTag && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-[#1F192E] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 size={32} />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Delete Tag?</h2>
            <p className="text-white/40 text-sm mb-8">Are you sure you want to remove <span className="text-white font-bold">"{deleteTag.name}"</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTag(null)} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 disabled:opacity-50 transition-all">Cancel</button>
              <button onClick={confirmDeleteTag} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50 transition-all">{isLoading ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-[#161223] border border-white/5 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Plus className="text-[#BE7EC7]" size={20} />
                <h2 className="text-xl font-bold text-white tracking-tight">Create New Tag</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white transition-all"><X size={24} /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Tag Appearance</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl hover:bg-white/10 transition-all shrink-0">
                    {newTag.emoji}
                  </button>
                  <input type="text" placeholder="Tag Name (VIP, Urgent)" className={inputClass} value={newTag.name} onChange={(e) => setNewTag({ ...newTag, name: e.target.value })} />
                </div>
                {showEmojiPicker && (
                  <div className="absolute z-[110] mt-2 shadow-2xl left-8">
                    <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)}></div>
                    <div className="relative">
                      <EmojiPicker onEmojiClick={(emoji) => { setNewTag({ ...newTag, emoji: emoji.emoji }); setShowEmojiPicker(false); }} theme="dark" width={300} height={400} />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Color Label</label>
                <div className="flex flex-wrap gap-2.5 p-3 bg-white/5 rounded-2xl border border-white/5">
                  {colors.map((c) => (
                    <button key={c} onClick={() => setNewTag({ ...newTag, color: c })} className={`w-7 h-7 rounded-full transition-all ${newTag.color === c ? "ring-2 ring-white ring-offset-4 ring-offset-[#161223] scale-110" : "opacity-40 hover:opacity-100"}`} style={{ backgroundColor: c }}></button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Description (Optional)</label>
                <textarea placeholder="How should team members use this tag?" className={`${inputClass} resize-none`} rows={3} value={newTag.description} onChange={(e) => setNewTag({ ...newTag, description: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} disabled={isLoading} className="flex-1 py-3.5 rounded-2xl bg-white/5 text-white/50 font-bold text-xs uppercase tracking-widest hover:bg-white/10 disabled:opacity-50 transition-all">Cancel</button>
                <button onClick={handleCreateTag} disabled={isLoading} className="flex-1 py-3.5 rounded-2xl bg-[#BE7EC7] text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#BE7EC7]/20 hover:bg-[#a66bb0] disabled:opacity-50 transition-all transform active:scale-95">{isLoading ? "Saving..." : "Save Tag"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editTag && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-[#161223] border border-white/5 rounded-[2.5rem] p-8 w-full max-w-sm text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Edit size={18} className="text-[#BE7EC7]" />
                    <h2 className="text-lg font-bold">Update Color</h2>
                </div>
                <button onClick={() => { setIsEditModalOpen(false); setEditTag(null); }} className="text-white/20 hover:text-white transition-all"><X size={20} /></button>
            </div>
            
            <div className="flex items-center gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-3xl">{editTag.emoji}</span>
                <span className="font-bold">{editTag.name}</span>
            </div>

            <label className={labelClass}>Pick New Color</label>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {colors.map((c) => (
                <button key={c} onClick={() => handleEditColor(editTag.id, c)} disabled={isLoading} className={`w-full aspect-square rounded-xl transition-all border-2 disabled:opacity-50 ${editTag.color === c ? "border-white scale-105" : "border-transparent opacity-50 hover:opacity-100"}`} style={{ backgroundColor: c }}></button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}