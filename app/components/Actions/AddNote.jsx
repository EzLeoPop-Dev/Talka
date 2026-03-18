"use client";
import React, { useState } from 'react';

export default function AddNote({ onClose, onSaveNote, currentNotes = [], onDeleteNote }) {

    const [title, setTitle] = useState("");
    const [noteText, setNoteText] = useState("");

    const handleSave = () => {
    if (!title || !noteText) {
        alert("Please fill in both title and note.");
        return;
    }
    
    const newNote = {
        id: Date.now(),
        title: title,
        text: noteText,
        timestamp: new Date().toISOString()
    };

    onSaveNote(newNote);

    setTitle("");
    setNoteText("");
};

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

return (
    <div className="w-[320px] max-h-[85vh] mt-3 ml-3 bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col self-start overflow-hidden">

    <h2 className="text-white text-2xl font-semibold mb-4 shrink-0">Add Note</h2>

    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* INPUT SECTION */}
        <div className="flex flex-col gap-4">
            <div>
            <label className="text-white/60 text-xs mb-1 block">Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/20 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Topic..."
            />
            </div>

            <div>
            <label className="text-white/60 text-xs mb-1 block">Note</label>
            <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full h-24 bg-white/20 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                placeholder="Write details..."
            />
            </div>
        </div>

        <button
            onClick={handleSave}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all mt-4 mb-6 shadow-lg"
        >
            Save Note
        </button>

        {/* LIST SECTION */}
        <div className="border-t border-white/10 pt-4">
            <h3 className="text-white/80 font-semibold mb-3 text-sm">
                History ({currentNotes.length})
            </h3>

            <div className="flex flex-col gap-3">
                {currentNotes.length === 0 ? (
                    <p className="text-white/30 text-xs text-center italic">No notes saved yet.</p>
                ) : (
                    [...currentNotes].reverse().map((note) => (
                        <div key={note.id} className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all relative group">
                            
                            {/* ส่วนหัวข้อและปุ่มลบ */}
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-white font-bold text-sm truncate pr-6">{note.title}</h4>
                                <button 
                                    onClick={() => onDeleteNote(note.id)}
                                    className="text-white/40 hover:text-red-400 transition-colors absolute top-3 right-3"
                                    title="Delete Note"
                                >
                                    <i className="fa-solid fa-trash text-xs"></i>
                                </button>
                            </div>

                            {/* เนื้อหา Note */}
                            <p className="text-white/70 text-xs line-clamp-2 mb-2 wrap-break-words">
                                {note.text}
                            </p>

                            {/* วันที่ */}
                            <p className="text-white/30 text-[10px] text-right">
                                {formatDate(note.timestamp)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>

    </div>

    <button
        onClick={onClose}
        className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all mt-4 shrink-0"
    >
        Done
    </button>
    </div>
    );
}