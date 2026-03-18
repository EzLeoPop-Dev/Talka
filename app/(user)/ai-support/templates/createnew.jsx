"use client";
import { useState } from "react";
import { ChevronLeft, SendHorizontal } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function ToggleCircle({ enabled, setEnabled }) {
  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className={`w-10 h-6 flex items-center rounded-full cursor-pointer transition 
        ${enabled ? "bg-blue-500" : "bg-gray-700"}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow transform transition 
          ${enabled ? "translate-x-4" : "translate-x-1"}`}
      />
    </div>
  );
}

/*--------------------ACTION ITEM BLOCK--------------------*/
function ActionItem({ title, enabled, setEnabled, placeholder }) {
  return (
    <div className="mb-5 rgba(32,41,59,0.37) border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      {/* header */}
      <div className="flex items-center justify-between">
        <p className="font-medium text-white">{title}</p>
        <ToggleCircle enabled={enabled} setEnabled={setEnabled} />
      </div>

      {/* textarea shown only when enabled */}
      {enabled && (
        <textarea
          className="w-full mt-3 h-28 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none"
          placeholder={placeholder || `Describe what "${title}" should do...`}
        />
      )}
    </div>
  );
}

/*--------------------INPUT ITEM-------------------*/
function InputItem({ label, type = "text", placeholder }) {
  return (
    <div>
      <p className="text-xs text-white/50">{label}</p>
      <div className="bg-[rgba(255,255,255,0.22)] shadow-2xl rounded-2xl py-2 px-4 mt-1">
        <input
          type={type}
          className="text-white outline-0 bg-transparent w-full"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

/*--------------------MAIN COMPONENT--------------------*/

export default function CearteNew({ onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  /* STATES for the 4 toggle actions */
  const [closeAction, setCloseAction] = useState(false);
  const [assignAction, setAssignAction] = useState(false);
  const [lifecycleAction, setLifecycleAction] = useState(false);
  const [contactAction, setContactAction] = useState(false);

  /* name + emoji state */
  const [newName, setNewName] = useState({
    emoji: "➕",
    name: "",
    placeholder: "AI Agent Name",
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="w-full h-[94vh] text-white p-6 flex gap-6 overflow-hidden bg-[rgba(32,41,59,0.25)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-4 justify-between">
      {/* LEFT PANEL */}
      <div className="w-2/3 h-full flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3 justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-white transition-colors cursor-pointer duration-300"
          >
            <ChevronLeft size={32} className="text-white/70 hover:text-white" />
            <p className="text-white text-xl font-semibold">Create AI Agent</p>
          </button>
        </div>

        {/* Scrollable LEFT content */}
        <div className="overflow-y-auto pr-3 flex-1">
          {/* ------------------- EDIT MODE ------------------- */}

          <div className="w-200 bg-white/5 border border-[rgba(254,253,253,0.5)] rounded-3xl p-6 backdrop-blur-xl shadow-xl animate-fadeIn">
            {/* HEADER: emoji + name + save */}
            <div className="flex items-center gap-3 mb-4 justify-between">
              <div className="text-xl font-semibold">
                Configuration
                <div className="text-sm text-white/50">
                  Clearly define what AI Agent is responsible for and how it
                  supports your business.
                </div>
              </div>
              {/* Save button */}
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm cursor-pointer"
              >
                Save
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              {/* Emoji */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="bg-white/20 hover:bg-white/20 px-3 py-2 rounded-lg cursor-pointer text-xl"
              >
                {newName.emoji}
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute z-50 mt-20 ml-2">
                  <EmojiPicker
                    onEmojiClick={(emoji) => {
                      setNewName({ ...newName, emoji: emoji.emoji });
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}

              {/* Name input */}
              <input
                type="text"
                placeholder="Agent name"
                className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg text-white p-2 outline-none"
                value={newName.name}
                onChange={(e) =>
                  setNewName({ ...newName, name: e.target.value })
                }
              />
            </div>

            {/* textarea */}
            <div className="mb-6">
              <label className="text-sm text-white/80">Instructions</label>
              <textarea
                className="w-full mt-2 h-56 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none"
                placeholder="Describe the AI Agent's role, communication style, and the actions it should perform. Give step-by-step instructions using clear, actionable language."
              />
            </div>

            {/* ACTION LIST */}
            <div className="text-xl font-semibold mb-3">
              Actions
              <div className="text-sm text-white/50">
                Assign actions the AI Agent can take during a conversation.
                Enable each action and specify when the action triggers.
              </div>
            </div>

            {/* 4 ACTION ITEMS */}
            <ActionItem
              title="Close conversations"
              enabled={closeAction}
              setEnabled={setCloseAction}
            />

            <ActionItem
              title="Assign to agent or team"
              enabled={assignAction}
              setEnabled={setAssignAction}
            />

            <ActionItem
              title="Update lifecycle stages"
              enabled={lifecycleAction}
              setEnabled={setLifecycleAction}
            />

            <ActionItem
              title="Update Contact fields"
              enabled={contactAction}
              setEnabled={setContactAction}
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/3 h-full overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col backdrop-blur-xl shadow-xl mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Test AI Agent</h2>
          <button className="text-sm text-white/60 hover:text-white cursor-pointer">
            Reset Chat
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-4 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`text-sm pb-1 cursor-pointer ${
              activeTab === "chat"
                ? "text-blue-400 font-semibold border-b-2 border-blue-400"
                : "text-white/60 hover:text-white"
            }`}
          >
            Chat
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`text-sm pb-1 cursor-pointer ${
              activeTab === "contact"
                ? "text-blue-400 font-semibold border-b-2 border-blue-400"
                : "text-white/60 hover:text-white"
            }`}
          >
            Contact fields
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 overflow-y-auto px-2">
          {activeTab === "chat" && (
            <div className="flex flex-col items-center justify-center text-center text-white/60 text-sm px-6 h-full">
              <p className="font-semibold text-white/80 mb-2">
                Test your AI Agent
              </p>
              <p>
                To begin testing, give your AI Agent a name and some
                instructions to see how it will respond in a real conversation.
              </p>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="text-sm text-white/80 space-y-4">
              <InputItem label="First Name" placeholder="john" />
              <InputItem label="Last Name" placeholder="doe" />
              <InputItem label="Phone Number" type="number" placeholder="0xx" />
              <InputItem
                label="Email"
                type="email"
                placeholder="john@example.com"
              />
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        {activeTab === "chat" && (
          <div className="mt-4">
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-3 py-2">
              <input
                className="flex-1 bg-transparent focus:outline-none text-sm text-white"
                placeholder="Enter message here"
              />
              <button className="ml-3 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition cursor-pointer">
                <SendHorizontal />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
