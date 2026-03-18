"use client";
import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";

export default function UseTemplates({
  onBack,
  onCreate,
  onreceptionist,
  onsalesagent,
  onsupportagent,
  selected
}) {
  const [toggle, setToggle] = useState({
    reception: true,
    sales: true,
    support: true,
  });
  const isOpen = (type) => selected.includes(type);

  return (
    <div className="w-full h-[94vh] text-white flex flex-col bg-[rgba(32,41,59,0.25)] backdrop-blur-xl rounded-3xl shadow-2xl p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-white/70 hover:text-white transition-colors cursor-pointer duration-300"
          >
            <ChevronLeft size={28} />
          </button>
          <p className="text-white text-xl font-semibold">AI Agent</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-4 gap-6 w-380">
        {/* Receptionist */}
        {isOpen("receptionist") && (
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:bg-white/10 transition">
            <p className="text-green-400 font-medium mb-2">Active</p>
            <p className="text-lg font-semibold mb-1">Receptionist</p>

            <p className="text-white/70 text-sm">
              Greets Contacts, identifies their needs, captures essential
              details, and efficiently routes conversations.
            </p>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={onreceptionist}
                className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg cursor-pointer"
              >
                edit
              </button>

              <button
                className="inline-flex items-center cursor-pointer"
                onClick={() =>
                  setToggle({ ...toggle, reception: !toggle.reception })
                }
              >
                <div
                  className={`w-10 h-6 flex items-center rounded-full cursor-pointer transition ${
                    toggle.reception ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                      toggle.reception ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Sales Agent */}
        {isOpen("saleagent") && (
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:bg-white/10 transition">
            <p className="text-green-400 font-medium mb-2">Active</p>
            <p className="text-lg font-semibold mb-1">Sales agent</p>

            <p className="text-white/70 text-sm">
              Learns customer needs, suggests products, and connects them to the
              right team when ready.
            </p>

            <div className="flex justify-between items-center mt-10">
              <button
                onClick={onsalesagent}
                className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg cursor-pointer"
              >
                edit
              </button>

              <button
                onClick={() => setToggle({ ...toggle, sales: !toggle.sales })}
                className="inline-flex items-center cursor-pointer"
              >
                <div
                  className={`w-10 h-6 flex items-center rounded-full cursor-pointer transition ${
                    toggle.sales ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                      toggle.sales ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Support Agent */}
        {isOpen("supportagent") && (
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:bg-white/10 transition">
            <p className="text-green-400 font-medium mb-2">Active</p>
            <p className="text-lg font-semibold mb-1">Support Agent</p>

            <p className="text-white/70 text-sm">
              Answers product questions using AI Knowledge Sources and escalates
              when needed.
            </p>

            <div className="flex justify-between items-center mt-10">
              <button
                onClick={onsupportagent}
                className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg cursor-pointer"
              >
                edit
              </button>

              <button
                onClick={() =>
                  setToggle({ ...toggle, support: !toggle.support })
                }
                className="inline-flex items-center cursor-pointer"
              >
                <div
                  className={`w-10 h-6 flex items-center rounded-full cursor-pointer transition ${
                    toggle.support ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                      toggle.support ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Create New */}
        <div className="flex-1 border border-white/10 bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center backdrop-blur-xl shadow-xl hover:bg-white/10 cursor-pointer transition group">
          <button
            onClick={onCreate}
            className="flex flex-col items-center text-center mb-3 group-hover:scale-110 transition-transform cursor-pointer"
          >
            <Plus size={30} className="mb-2" />
            <p className="font-medium text-white">Create AI Agent</p>
          </button>
        </div>
      </div>
    </div>
  );
}
