"use client";
import { ArrowLeft, MessageSquare, MessageCircle, Zap, Link2, Shield, CheckCircle2 } from "lucide-react";

export default function ConnectLine({ onBack, onNext }) {
  return (
    <div className="w-full h-full min-h-[90vh] p-4 md:p-10  text-[#1E293B] font-sans relative overflow-hidden animate-in fade-in duration-500">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%]  blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%]  blur-[120px] rounded-full pointer-events-none"></div>

      {/* --- MAIN CONTAINER --- */}
      <div className="relative z-10 bg-white border border-slate-200/50 rounded-[3rem] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.06)] h-full flex flex-col p-6 md:p-12 overflow-hidden">
        
        {/* Top Navigation */}
        <div className="shrink-0 mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-slate-400 hover:text-[#BE7EC7] transition-all group font-bold text-xs uppercase tracking-widest"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm group-hover:bg-[#BE7EC7]/5 group-hover:border-[#BE7EC7]/20 transition-all border border-slate-100">
              <ArrowLeft size={18} />
            </div>
            <span>Catalog</span>
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="max-w-2xl w-full text-center flex flex-col items-center">
            
            {/* Step Badge (Authorized LINE Hub) */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] mb-14 border border-slate-100 shadow-sm">
              <Zap size={14} className="fill-[#BE7EC7] text-[#BE7EC7]" />
              <div className="w-px h-3 bg-slate-200 mx-1"></div>
              <span className="text-[#BE7EC7]">Authorized LINE Integration Hub</span>
            </div>

            {/* Connection Visual (Message <-> LINE) */}
            <div className="relative mb-20 w-full max-w-sm h-32 flex items-center justify-center">
                {/* Connector Line */}
                <div className="absolute inset-x-0 h-px bg-slate-100 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-300">
                        <Link2 size={18} />
                    </div>
                </div>

                <div className="flex justify-between w-full relative z-10 px-4">
                    {/* Message Side (สีม่วง Mauve) */}
                    <div className="w-24 h-24 rounded-[2.2rem] bg-white border border-slate-100 shadow-xl flex flex-col items-center justify-center gap-2 animate-bounce transition-all duration-1000" style={{ animationDuration: '3s' }}>
                        <div className="w-12 h-12 rounded-2xl bg-[#BE7EC7]/10 flex items-center justify-center text-[#BE7EC7]">
                            <MessageSquare size={28} fill="currentColor" className="opacity-80" />
                        </div>
                        <div className="w-8 h-1 bg-slate-100 rounded-full"></div>
                    </div>

                    {/* LINE Side (สีเขียว LINE) */}
                    <div className="w-24 h-24 rounded-[2.2rem] bg-white border border-slate-100 shadow-xl flex flex-col items-center justify-center gap-2 animate-bounce transition-all duration-1000" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
                        <div className="w-12 h-12 rounded-2xl bg-[#06C755]/10 flex items-center justify-center text-[#06C755]">
                            <MessageCircle size={28} fill="currentColor" />
                        </div>
                        <div className="w-8 h-1 bg-emerald-50 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Typography */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
              Connect <span className="text-[#06C755]">LINE OA</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-lg mx-auto font-medium">
                You will be redirected to the LINE Official Account Platform to configure and authorize your channel information.
            </p>

            {/* Main Action Button */}
            <button
              onClick={onNext}
              className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 rounded-[2rem] bg-[#06C755] hover:bg-[#05b34c] text-white transition-all shadow-[0_20px_40px_-10px_rgba(6,199,85,0.3)] hover:shadow-[0_24px_48px_-10px_rgba(6,199,85,0.4)] hover:scale-[1.03] active:scale-95"
            >
              <MessageCircle size={22} fill="currentColor" />
              <span className="text-sm font-black uppercase tracking-[0.2em]">Connect Line</span>
            </button>

            {/* Security Badges */}
            <div className="mt-16 flex items-center gap-8 opacity-40 grayscale">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Handshake</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Official Messaging API</span>
                </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-10 text-center opacity-20 text-[9px] font-black uppercase tracking-[0.5em]">
            Enterprise Integration Layer v2.0
        </div>
      </div>
    </div>
  );
}