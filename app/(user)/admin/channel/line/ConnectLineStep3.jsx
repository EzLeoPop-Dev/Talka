"use client";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ConnectLineStep3({ onBack, onComplete }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="w-full h-[94vh] bg-[rgba(32,41,59,0.37)] border border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-white relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Header */}
      <h1 className="text-2xl font-semibold mb-1 mt-8">
        Connect LINE Official Account
      </h1>
      <p className="text-white/70 mb-10 text-sm leading-relaxed">
        Follow the instructions to set up the channel.
      </p>

      {/* Step indicator */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-2 opacity-60">
          <div className="bg-green-900 px-3 py-1.5 rounded-lg text-sm font-semibold">
            <span className="bg-green-400 px-2 rounded-full text-sm font-semibold">
              1
            </span>{" "}
            &nbsp;<span>Configure Channel</span>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <div className="bg-green-900 px-3 py-1.5 rounded-lg text-sm font-semibold">
            <span className="bg-green-400 px-2 rounded-full text-sm font-semibold">
              2
            </span>{" "}
            &nbsp;<span>Get Channel Information</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="bg-blue-600 px-4 py-1.5 rounded-lg text-sm font-semibold">
            <span className="bg-blue-800 px-2 rounded-full text-sm font-semibold">
              3
            </span>{" "}
            &nbsp;<span>Enable Webhook</span>
          </div>
        </div>
      </div>

      {/* Instruction list */}
      <ol className="list-decimal list-inside text-white/80 space-y-4 mb-6">
        <li>
          Navigate to the <strong>Messaging API</strong> tab.
        </li>
        <li>
          Add the URL generated below to the <strong>Webhook URL</strong> field.
          <div className="mt-2 relative">
            <input
              placeholder="URL"
              className="w-156 bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white/80 pr-10"
            />
          </div>
        </li>
        <li>
          Press <strong>Update</strong> and verify the <strong>Webhook</strong>.
        </li>
      </ol>

      {/* Checkbox */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          className="accent-blue-500 w-5 h-5 cursor-pointer"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label>I have completed the actions above.</label>
      </div>

      {/* Complete button */}
      <button
        disabled={!checked}
        onClick={onComplete}
        className={`px-6 py-2.5 rounded-lg transition-all ${
          checked
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-700 text-white/50 cursor-not-allowed"
        }`}
      >
        Complete
      </button>
    </div>
  );
}
