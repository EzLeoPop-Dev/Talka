"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ConnectFacebook({ onBack }) {
  const [showModal, setShowModal] = useState(false);

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

      <h1 className="text-2xl font-semibold mb-3 ml-13">Connect Facebook</h1>
      <p className="text-white/70 max-w-2xl mb-10 text-sm leading-relaxed ml-13">
        After clicking &nbsp;
        <span className="font-semibold text-white">Connect with Facebook</span>,
        you will be redirected to Facebook to select the account you want to
        connect.
      </p>

      <div className="relative text-white">
      {/* ปุ่ม Connect */}
      <button
        onClick={() => setShowModal(true)}
        className="ml-13 px-6 py-2.5 rounded-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer"
      >
        Connect with Facebook
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[rgba(32,41,59,0.95)] p-6 rounded-2xl border border-white/20 shadow-2xl max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-2">Connecting to Facebook</h2>
            <p className="text-white/70 mb-4">
              Your Facebook Account has been successfully connected.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
