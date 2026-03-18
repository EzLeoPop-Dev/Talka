"use client";
import { ArrowLeft } from "lucide-react";

export default function ConnectLine({ onBack, onNext }) {
  return (
    <div className="w-full h-[94vh] bg-[rgba(32,41,59,0.37)] border border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-white relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="max-w-3xl w-full flex flex-col items-center text-center mt-8">
        <div className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl w-full aspect-video max-w-2xl mb-10 flex items-center justify-center">
          <span className="text-white/50 text-lg">Video Preview Area</span>
        </div>
</div>
        <h1 className="text-2xl font-semibold mb-3 ml-13">
          Connect LINE Official Account
        </h1>
        <p className="text-white/70 max-w-2xl mb-10 text-sm leading-relaxed ml-13">
          You will be asked to sign in to the &nbsp;
          <span className="font-semibold text-white">
            LINE Official Account
          </span>
          , Platform to configure your channel information. These channel
          information from your LINE Official Account is needed to complete the
          set up here.
        </p>

        <button
          onClick={onNext}
          className="ml-13 px-6 py-2.5 rounded-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer"
        >
          Connect Line
        </button>
      
    </div>
  );
}
