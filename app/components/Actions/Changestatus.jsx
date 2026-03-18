"use client";

export default function ChangeStatus({ onClose, availableStatus, currentTargets, onToggleStatus }) {
    return (
        <div
            className="w-[320px] max-h-[85vh] mt-3 ml-3 bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col self-start" 
        >
        <h2 className="text-white text-2xl font-semibold mb-5">Change Status</h2>

        <div className="flex flex-wrap gap-2 mb-6 overflow-auto">
            {availableStatus?.map((status) => {
            const isActive = currentTargets && currentTargets.includes(status);
            return (
                <button
                key={status}
                onClick={() => onToggleStatus(status)} 
                className={`rounded-full px-4 py-2 text-sm transition-all h-fit
                    ${
                    isActive
                        ? "bg-yellow-400 text-yellow-900 font-bold " 
                        : "bg-white/30 text-white/90 hover:bg-white/40" 
                    }
                `}
                >
                {status}
                </button>
            );
            })}
        </div>

        <button
            onClick={onClose}
            className="w-full bg-white/30 hover:bg-white/40 text-white font-bold py-3 rounded-xl transition-all  "
        >
            Done
        </button>
        </div>
    );
}