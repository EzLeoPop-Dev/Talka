"use client";
import { useState } from "react";
import { BriefcaseBusiness, X } from "lucide-react";

export const facebookAccounts = [
  { name: "OneChat Facebook Page", id: "fb_001" },
  { name: "Talka Page", id: "fb_002" },
];

export const lineAccounts = [
  { name: "OneChat LINE OA", id: "line_001" },
  { name: "Talka LINE", id: "line_002" },
];

export default function ChannelCatalog({ onConnectFacebook, onConnectLine }) {
  const [isOpen, setIsOpen] = useState(false);

  const connectedChannels = [
    ...facebookAccounts.map((fb) => ({
      icon: <i className="fa-brands fa-facebook text-blue-600 text-2xl"></i>,
      name: "Facebook",
      pageName: fb.name,
    })),
    ...lineAccounts.map((ln) => ({
      icon: <i className="fa-brands fa-line text-green-500 text-2xl"></i>,
      name: "LINE OA",
      pageName: ln.name,
    })),
  ];

  return (
    <>
      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-[#12131a] text-white w-[480px] rounded-2xl border border-white/20 shadow-2xl p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Connected Channels</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            {connectedChannels.length > 0 ? (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {connectedChannels.map((ch, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-xl p-4"
                  >
                    {ch.icon}
                    <div>
                      <h3 className="text-lg font-semibold">{ch.name}</h3>
                      <p className="text-white/60">{ch.pageName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50">No channels connected yet.</p>
            )}
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <div className="w-full h-[94vh] p-6">
        <div className="bg-[rgba(32,41,59,0.37)] border border-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.35)] p-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start py-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <BriefcaseBusiness className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Channel Catalog</h1>
                <p className="text-sm text-white/60">
                  Manage your messaging channels and discover new ones to help
                  you acquire more customers.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="bg-white/20 border border-white/40 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-white/30 transition-all cursor-pointer"
            >
              Connected Channels ({connectedChannels.length})
            </button>
          </div>

          <div className="border-t border-white/20 mx-7 mb-6"></div>

          {/* Channel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {/* Facebook */}
            <div className="group relative rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl p-6 shadow-xl flex justify-between items-center hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <i className="fa-brands fa-facebook text-blue-600 text-4xl"></i>
                <div>
                  <h2 className="text-white font-semibold text-lg">Facebook</h2>
                  <p className="text-white/60 text-sm">
                    Connect your Facebook Pages
                  </p>
                </div>
              </div>
              <button
                onClick={onConnectFacebook}
                className="bg-white/20 border border-white/30 text-white hover:bg-white/30 rounded-lg px-4 py-1.5 text-sm transition-all cursor-pointer"
              >
                Connect
              </button>
            </div>

            {/* LINE */}
            <div className="group relative rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl p-6 shadow-xl flex justify-between items-center hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <i className="fa-brands fa-line text-green-500 text-4xl"></i>
                <div>
                  <h2 className="text-white font-semibold text-lg">LINE</h2>
                  <p className="text-white/60 text-sm">Connect your LINE OA</p>
                </div>
              </div>
              <button
                onClick={onConnectLine}
                className="bg-white/20 border border-white/30 text-white hover:bg-white/30 rounded-lg px-4 py-1.5 text-sm transition-all cursor-pointer"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
