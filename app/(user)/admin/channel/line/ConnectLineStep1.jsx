"use client";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ConnectLineStep1({ onBack, onNext }) {
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

      <h1 className="text-2xl font-semibold mb-1 mt-8">
        Connect LINE Official Account
      </h1>
      <p className="text-white/70 mb-8 text-sm leading-relaxed">
        Follow the instructions to set up the channel.
      </p>

      {/* Step indicator */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
            <span className="bg-blue-800 px-2 rounded-full text-sm font-semibold">
              1
            </span>{" "}
            &nbsp;<span>Configure Channel</span>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <div className="bg-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
            <span className="bg-gray-900 px-2 rounded-full text-sm font-semibold">
              2
            </span>{" "}
            &nbsp;<span>Get Channel Information</span>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <div className="bg-gray-700 px-4 py-1.5 rounded-lg text-sm font-semibold">
            <span className="bg-gray-900 px-2 rounded-full text-sm font-semibold">
              3
            </span>{" "}
            &nbsp;<span>Enable Webhook</span>
          </div>
        </div>
      </div>

      <ol className="list-decimal list-inside space-y-5 text-white/80 mb-6">
        <li>Sign in to LINE Official Accounts Platform.</li>
        <li>
          Navigate to <b>Settings &gt; Enable Messaging API</b>.
        </li>
        <li>
          Press <b>Enabled Messaging API</b> and link with LINE Account.
        </li>
        <li>
          Register a <b>Developer Account</b>.
        </li>
        <li>
          Enter a new <b>Provider Name</b> and press Agree.
        </li>
        <li> Enter Privacy Policy and Terms of Use information (optional).</li>
        <li>
          Press <b>OK</b> to enable Messaging API.
        </li>
        <li>
          Navigate to Response <b>Settings &gt; Detailed Settings</b>.
        </li>
        <li>Find Webhook section and select Enabled.</li>
      </ol>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          className="accent-blue-500 w-5 h-5 cursor-pointer"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label>I have completed the actions above.</label>
      </div>

      <button
        disabled={!checked}
        onClick={onNext}
        className={`ml-0 px-6 py-2.5 rounded-lg transition-all ${
          checked
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-700 text-white/50 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
}
