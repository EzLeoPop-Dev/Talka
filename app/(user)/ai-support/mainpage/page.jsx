"use client";
import {
  SmilePlus,
  BookOpenText,
  MessageCircle,
  Users,
  Database,
  Play, // เพิ่ม icon play
  CheckCircle2, // เพิ่ม icon check
} from "lucide-react";

export default function AiSupport({ onNext }) {
  return (
    <>
      <div className="w-full h-[94vh] p-2 md:p-4">
        <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.1)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-4 h-full flex flex-col overflow-hidden relative">

          <div className="flex justify-between items-start p-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <SmilePlus className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">AI Agent</h1>
                <p className="text-sm text-white/60">
                  Handle more conversations with less effort.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white/70 hover:text-white py-2 px-4 cursor-pointer transition rounded-full hover:bg-white/5">
                <BookOpenText size={20} />
                <span className="text-sm font-medium">Learn more</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mx-7 mb-6 relative z-10"></div>

          <div className="flex flex-col lg:flex-row justify-between items-center flex-1 px-8 lg:px-16 pb-12 gap-12 relative z-10">

            <div className="max-w-xl w-full">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.15]">
                Grow your team with <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-indigo-300">
                  AI Support
                </span>
              </h1>
              <p className="text-white/60 text-lg mt-6 leading-relaxed max-w-md">
                Built to handle hundreds of conversations at a time seamlessly.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  { icon: MessageCircle, text: "Replies to messages instantly, 24/7" },
                  { icon: Database, text: "Updates Lifecycle Stages automatically" },
                  { icon: Users, text: "Smart routing to agents & teams" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="mt-1 p-1.5 rounded-lg bg-purple-500/20 text-purple-300 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-300">
                      <item.icon size={18} />
                    </div>
                    <span className="text-white/80 text-base group-hover:text-white transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <button
                  onClick={onNext}
                  className="px-8 py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-purple-900/40 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get started
                </button>
              </div>
            </div>


            <div className="w-full max-w-2xl aspect-video relative group">

              <div className="absolute inset-0 bg-linear-to-tr from-purple-500/10 to-blue-500/10 rounded-2xl blur-2xl transform group-hover:scale-105 transition-transform duration-500"></div>

              <div className="relative w-full h-full bg-slate-900/40 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                <div className="h-9 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                </div>

                <div className="flex-1 flex items-center justify-center relative bg-linear-to-br from-white/5 to-transparent">
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center mb-3 shadow-lg group-hover:bg-purple-600/80 group-hover:border-purple-500 transition-colors">
                      <Play className="text-white ml-1" size={28} fill="currentColor" />
                    </div>
                    <span className="text-white/50 text-sm font-medium tracking-wider uppercase group-hover:text-white/80 transition-colors">Watch Preview</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}