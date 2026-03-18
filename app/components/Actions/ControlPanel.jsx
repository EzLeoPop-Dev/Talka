"use client";

//  รับ prop 'onOpenSendToBoard' เพิ่มเข้ามา
export default function ControlPanel({ 
    onOpenAddTagModal, 
    onOpenContactDetails, 
    onOpenAddNote, 
    onOpenChangeStatus, 
    onOpenActivityLog,
    onOpenSendToBoard 
}) {

    return (
        <div className="w-[65px] mt-3 ml-3">
            <div className="w-full">
                <div className="bg-[rgba(32,41,59,0.25)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl py-6 flex flex-col items-center gap-6">
                    
                    {/* Tags */}
                    <button 
                        onClick={onOpenAddTagModal} 
                        className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
                        title="Tags"
                    >
                        <i className="fa-solid fa-tags text-white/70 group-hover:text-white text-lg transition-colors"></i>
                    </button>

                    {/* Profile */}
                    <button 
                        onClick={onOpenContactDetails} 
                        className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
                        title="User Profile"
                    >
                        <i className="fa-solid fa-info text-white/70 group-hover:text-white text-lg transition-colors"></i>
                    </button>

                    {/* Notes */}
                    <button 
                        onClick={onOpenAddNote}
                        className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
                        title="Notes"
                    >
                        <i className="fa-solid fa-book text-white/70 group-hover:text-white text-lg transition-colors"></i>
                    </button>

                    {/* Change Status */}
                    <button 
                        onClick={onOpenChangeStatus}
                        className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
                        title="Change Status"
                    >
                        <i className="fa-solid fa-timeline text-white/70 group-hover:text-white text-lg transition-colors"></i>
                    </button>

                    {/* Activity Log */}
                    <button 
                        onClick={onOpenActivityLog}
                        className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
                        title="Activity Log"
                    >
                        <i className="fa-solid fa-clock-rotate-left text-white/70 group-hover:text-white text-lg transition-colors"></i>
                    </button>

                    {/* Send to Board */}
                    <button 
                        onClick={onOpenSendToBoard}
                        className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
                        title="Send to Board"
                    >
                        <i className="fa-solid fa-file-import text-white text-lg transition-colors"></i>
                    </button>
                    
                </div>
            </div>
        </div>
    );
}