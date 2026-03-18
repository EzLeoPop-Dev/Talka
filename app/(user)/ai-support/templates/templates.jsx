"use client";
import {
  ChevronLeft,
  ConciergeBell,
  TrendingUp,
  LifeBuoy,
  Plus
} from "lucide-react";

export default function TemplatesPage({
  onBack,
  onreceptionist,
  onsalesagent,
  onsupportagent,
  oncreatenew,
}) {
  return (
    <div className="w-full h-[94vh] p-2 md:p-4">
      <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-start items-start mb-6 mt-8">
          <button
            onClick={onBack}
            className="text-white/70 hover:text-white transition-colors cursor-pointer mr-4"
          >
            <ChevronLeft size={48} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              AI Agent Templates
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Use a template tailored for business goals like support or sales,
              or create your own AI Support.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mb-8"></div>

        {/* Cards Grid - ส่วนที่ปรับปรุงใหม่ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 overflow-y-auto">

          {/* Template: Receptionist */}
          <div className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)] transition-all duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <ConciergeBell className="text-yellow-400" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white">Receptionist</h2>
            <p className="mt-2 text-sm text-white/60 leading-relaxed flex-1">
              Greets Contacts, identifies their needs, captures essential
              details, and routes them efficiently.
            </p>
            <button
              onClick={onreceptionist}
              className="w-full mt-6 bg-white/90 hover:bg-white text-slate-900 py-2.5 rounded-xl font-semibold transition-all cursor-pointer shadow-lg"
            >
              Use template
            </button>
          </div>

          {/* Template: Sales Agent */}
          <div className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] transition-all duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white">Sales Agent</h2>
            <p className="mt-2 text-sm text-white/60 leading-relaxed flex-1">
              Learns customer needs, suggests products, and connects them to the
              right team when ready.
            </p>
            <button
              onClick={onsalesagent}
              className="w-full mt-6 bg-white/90 hover:bg-white text-slate-900 py-2.5 rounded-xl font-semibold transition-all cursor-pointer shadow-lg"
            >
              Use template
            </button>
          </div>

          {/* Template: Support Agent */}
          <div className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-rose-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)] transition-all duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <LifeBuoy className="text-rose-400" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white">Support Agent</h2>
            <p className="mt-2 text-sm text-white/60 leading-relaxed flex-1">
              Answers product questions using AI Knowledge Sources and escalates
              when needed.
            </p>
            <button
              onClick={onsupportagent}
              className="w-full mt-6 bg-white/90 hover:bg-white text-slate-900 py-2.5 rounded-xl font-semibold transition-all cursor-pointer shadow-lg"
            >
              Use template
            </button>
          </div>

          {/* Create New */}
          <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-dashed border-white/30 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white text-purple-400 transition-all duration-300">
              <Plus size={28} />
            </div>
            <h2 className="text-lg font-semibold text-white">Create Custom</h2>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Build your own AI Agent from scratch.
            </p>
            <button
              onClick={oncreatenew}
              className="mt-6 px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all cursor-pointer shadow-lg shadow-purple-900/20 w-full"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}