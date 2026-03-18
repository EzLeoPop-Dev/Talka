"use client";
import { useState } from "react";
import ChannelCatalog from "./catalog/page";
import ConnectFacebook from "./facebook/page";
import ConnectLine from "./line/line";
import ConnectLineStep1 from "./line/ConnectLineStep1";
import ConnectLineStep2 from "./line/ConnectLineStep2";
import ConnectLineStep3 from "./line/ConnectLineStep3";

export default function ChannelPage() {
  const [view, setView] = useState("catalog");
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  return (
    <>
      {view === "catalog" && (
        <ChannelCatalog
          onConnectFacebook={() => setView("facebook")}
          onConnectLine={() => setView("line")}
        />
      )}

      {view === "facebook" && (
        <ConnectFacebook onBack={() => setView("catalog")} />
      )}

      {view === "line" && (
        <ConnectLine
          onBack={() => setView("catalog")}
          onNext={() => setView("line1")}
        />
      )}

      {view === "line1" && (
        <ConnectLineStep1
          onBack={() => setView("line")}
          onNext={() => setView("line2")}
        />
      )}

      {view === "line2" && (
        <ConnectLineStep2
          onBack={() => setView("line1")}
          onNext={() => {
            setView("line3");
          }}
        />
      )}

      {view === "line3" && (
        <ConnectLineStep3
          onBack={() => setView("line2")}
          onComplete={() => {
            setShowCompleteModal(true);
            setView("catalog");
          }}
        />
      )}
       {/* Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 flex items-center justify-center rgba(32,41,59,0.37) backdrop-blur-sm z-50">
          <div className="bg-[rgba(32,41,59,0.95)] p-8 rounded-2xl border border-white/20 shadow-2xl text-center max-w-md">
            <h2 className="text-xl font-semibold mb-3"> LINE Connected Successfully!</h2>
            <p className="text-white/70 mb-6">
              Your LINE Official Account has been successfully connected.
            </p>
            <button
              onClick={() => {
                setShowCompleteModal(false);                
              }}
              className="px-5 py-2.5 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
