"use client";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Zap, Shield, ChevronRight, ListChecks } from "lucide-react";

export default function ConnectLineStep1({ onBack, onNext }) {
  const [checked, setChecked] = useState(false);

  const steps = [
    "เข้าสู่ระบบใน LINE Official Account Platform",
    "ไปที่เมนู Settings > Enable Messaging API",
    "กดปุ่ม Enabled Messaging API และเชื่อมต่อกับ LINE Account",
    "ลงทะเบียนบัญชี Developer Account",
    "ระบุชื่อ Provider Name และกดยอมรับข้อตกลง",
    "กรอกข้อมูล Privacy Policy และ Terms of Use (ระบุหรือไม่ก็ได้)",
    "กดปุ่ม OK เพื่อเปิดใช้งาน Messaging API",
    "ไปที่เมนู Response Settings > Detailed Settings",
    "มองหาหัวข้อ Webhook และเลือกเป็น Enabled"
  ];

  return (
    <div className="w-full h-full min-h-[90vh] p-4 md:p-8  font-sans relative overflow-hidden animate-in fade-in duration-500">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* --- MAIN CONTAINER --- */}
      <div className="relative z-10 bg-white border border-white/40 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] h-full flex flex-col overflow-hidden">
        
        {/* Top Navigation */}
        <div className="p-8 md:p-10 pb-0 shrink-0 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-slate-400 hover:text-[#06C755] transition-all group font-bold text-sm uppercase tracking-wider"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm group-hover:bg-[#06C755]/5 transition-all border border-slate-100">
              <ArrowLeft size={20} />
            </div>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <Shield size={14} className="text-[#06C755]" />
            <span>Secure Setup</span>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10">
          <div className="max-w-3xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-[#06C755] mb-3 bg-[#06C755]/5 px-3 py-1 rounded-full">
                <ListChecks size={16} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Step-by-step Guide</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Connect LINE OA</h1>
              <p className="text-slate-500 text-base mt-2 font-medium">กรุณาทำตามขั้นตอนด้านล่างบน LINE Developers Console เพื่อเชื่อมต่อระบบ</p>
            </div>

            {/* Instruction List: เน้นอ่านง่าย (Single Column) */}
            <div className="space-y-3 mb-10">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:border-[#06C755]/30 hover:bg-white transition-all group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 text-[#06C755] text-sm font-bold flex items-center justify-center shadow-sm group-hover:bg-[#06C755] group-hover:text-white group-hover:border-[#06C755] transition-all">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 text-[15px] md:text-[16px] leading-snug font-semibold tracking-tight">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Confirmation & Action */}
            <div className="bg-slate-50/80 rounded-[2rem] p-6 md:p-8 border border-slate-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-7 h-7 rounded-xl border-2 border-slate-200 checked:bg-[#06C755] checked:border-[#06C755] transition-all cursor-pointer shadow-sm"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                    <CheckCircle2 size={16} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className={`text-base font-bold tracking-tight transition-colors ${checked ? 'text-slate-900' : 'text-slate-400'}`}>
                    ฉันดำเนินการตามขั้นตอนทั้งหมดเรียบร้อยแล้ว
                  </span>
                </label>

                <button
                  disabled={!checked}
                  onClick={onNext}
                  className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-sm transition-all
                    ${checked 
                      ? 'bg-[#06C755] text-white shadow-xl shadow-[#06C755]/20 hover:scale-[1.03] active:scale-95' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  ดำเนินการต่อ
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 text-center border-t border-slate-50 bg-slate-50/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Official Messaging API Authorization</p>
        </div>
      </div>
    </div>
  );
}