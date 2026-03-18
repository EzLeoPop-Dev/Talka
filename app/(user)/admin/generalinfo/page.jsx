"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Home, Save } from "lucide-react";

function GeneralInfoContent() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("id");

  const [timeout, setTimeoutValue] = useState(0);
  const [timezone, setTimezone] = useState("(GMT+07:00) Asia/Bangkok");
  const [workspaceName, setWorkspaceName] = useState("");

  const [currentWsId, setCurrentWsId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 [BACKEND NOTE]: โหลดข้อมูล Workspace จาก API 
  useEffect(() => {
    const fetchWorkspaceInfo = async () => {
      try {
        setLoading(true);

        // 🟢 [API CALL]: ตัวอย่างการดึงข้อมูล Workspace ที่ต้องการ
        // let url = '/api/workspaces/current'; // ดึง default
        // if (workspaceId) url = `/api/workspaces/${workspaceId}`;
        // 
        // const response = await fetch(url);
        // const targetWs = await response.json();

        // ==========================================
        // [Mock Processing] จำลองข้อมูลระหว่างรอ API
        const targetWs = {
          id: workspaceId || 1,
          name: "My Workspace",
          timeout: 30,
          timezone: "(GMT+07:00) Asia/Bangkok"
        };
        // ==========================================

        if (targetWs) {
          setCurrentWsId(targetWs.id);
          setWorkspaceName(targetWs.name || "");
          if (targetWs.timeout !== undefined) setTimeoutValue(targetWs.timeout);
          if (targetWs.timezone !== undefined) setTimezone(targetWs.timezone);
        }
      } catch (error) {
        console.error("Error fetching workspace info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceInfo();
  }, [workspaceId]);

  // 🟢 [BACKEND NOTE]: บันทึกข้อมูลที่แก้ไขกลับไปที่ API (PUT/PATCH)
  const handleSave = async () => {
    if (!currentWsId) return;

    const payload = {
      name: workspaceName,
      timeout: Number(timeout), // ตรวจสอบชนิดข้อมูล
      timezone: timezone
    };

    try {
      // 🟢 [API CALL]: 
      // const response = await fetch(`/api/workspaces/${currentWsId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      // if (!response.ok) throw new Error("Failed to save");

      alert("Saved successfully!");
    } catch (error) {
      console.error("Error saving workspace:", error);
      alert("Error saving. Please try again.");
    }
  };

  if (loading) return <div className="p-10 text-white animate-pulse">Loading workspace data...</div>;

 
  return (
    <div className="w-full h-[94vh] p-2 md:p-4">
      <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-4 h-full flex flex-col">

        {/* Header */}
        <div className="relative max-w-3xl p-8 pb-0">
          <div className="flex items-center gap-3 mb-8 ">
            <Home className="text-white p-2 bg-white/5 rounded-xl border border-white/10" size={50} />
            <div>
              <h1 className="text-xl font-semibold text-white">General Info</h1>
              <p className="text-sm text-white/70">
                Change general Workspace-level settings.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/28 mx-7 mb-4"></div>

        {/* Form Content */}
        <div className="relative max-w-3xl p-8 pt-2">
          <div className="flex flex-col gap-8 p-6">

            {/* Workspace Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Workspace"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 border border-transparent transition-all"
              />
            </div>

            {/* User Inactivity Timeout */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                User Inactivity Timeout (Minutes)
              </label>
              <input
                type="number"
                value={timeout}
                onChange={(e) => setTimeoutValue(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Time Zone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer appearance-none"
              >
                <option className="bg-[#1e1e24] text-white" value="(GMT+07:00) Asia/Bangkok">
                  (GMT+07:00) Asia/Bangkok
                </option>
                <option className="bg-[#1e1e24] text-white" value="(GMT+08:00) Singapore">
                  (GMT+08:00) Singapore
                </option>
                <option className="bg-[#1e1e24] text-white" value="(GMT+09:00) Tokyo">
                  (GMT+09:00) Tokyo
                </option>
              </select>
            </div>

            {/* Save Button Zone */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[rgba(88,40,201,0.4)] hover:bg-[rgba(88,40,201,0.6)] text-white px-6 py-2.5 rounded-xl transition shadow-lg border border-white/10"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Main Component ที่ห่อหุ้มด้วย Suspense (ตัวนี้คือตัวที่ export default)
export default function GeneralInfoPage() {
  return (
    // Fallback จะแสดงระหว่างที่ Next.js กำลังโหลด URL Params
    <Suspense fallback={<div className="p-10 text-white animate-pulse">Loading page...</div>}>
      <GeneralInfoContent />
    </Suspense>
  );
}