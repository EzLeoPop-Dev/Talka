"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  ChevronDown,
  MessageCircle,
  Tag,
  UserPlus,
  Activity,
  Clock
} from "lucide-react";

export default function ActivityLog() {
  const [expandedRow, setExpandedRow] = useState(null);

  // ---- FILTER STATE ----
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchText, setSearchText] = useState("");

  // 🟢 [BACKEND NOTE]: เปลี่ยนข้อมูลแบบ Fix เป็น State ว่างๆ เพื่อรอรับข้อมูลจาก API
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 [BACKEND NOTE]: ใช้ useEffect เพื่อ Fetch ข้อมูลเมื่อเข้าหน้านี้
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        // 🟢 [BACKEND NOTE]: ใส่คำสั่งดึงข้อมูล API จริงตรงนี้
        // const response = await fetch('/api/activity-logs');
        // const data = await response.json();
        // setActivityLogs(data);

        // [Mock Data]: จำลองข้อมูลชั่วคราวระหว่างรอ Backend (ลบออกได้เมื่อต่อ API)
        const mockData = [
          { id: 1, type: "chat_incoming", actor: "Customer", target: "Support Team", timestamp: "2025-11-26T09:12:30.10", message: "Customer sent a new message", details: { channel: "Facebook", preview: "สวัสดีครับ ขอสอบถาม..." } },
          { id: 2, type: "chat_incoming", actor: "Customer", target: "Support Team", timestamp: "2025-11-26T09:13:02.55", message: "Customer sent a new message", details: { channel: "Line", preview: "สวัสดีครับ ขอสอบถาม..." } },
          { id: 3, type: "invite_user", actor: "Owner", target: "new_member@test.com", timestamp: "2025-11-26T11:45:22.99", message: "Invited new team member", details: { role: "Employer", method: "Email Invite" } },
          { id: 4, type: "tag_create", actor: "Admin A", target: "Tag: Hot Lead", timestamp: "2025-11-26T10:05:11.42", message: "Created new tag", details: { color: "red", category: "VIP" } },
          { id: 5, type: "chat_incoming", actor: "Customer", target: "Support Team", timestamp: "2025-11-26T11:22:10.11", message: "Customer sent a new message", details: { channel: "Facebook", preview: "สวัสดีครับ ขอสอบถาม..." } },
          { id: 6, type: "tag_add", actor: "Admin B", target: "User #5521", timestamp: "2025-11-26T11:22:10.11", message: "Added tag to user", details: { tag: "VIP", user: "Somchai" } },
          { id: 7, type: "invite_user", actor: "Owner", target: "new_member@test.com", timestamp: "2025-11-26T11:46:03.44", message: "Invited new team member", details: { role: "Employer", method: "Email Invite" } },
          { id: 8, type: "chat_incoming", actor: "Customer", target: "Support Team", timestamp: "2025-11-26T09:15:47.20", message: "Customer sent a new message", details: { channel: "Line", preview: "สวัสดีครับ ขอสอบถาม..." } },
        ];
        
        // จำลอง Delay อินเทอร์เน็ต 0.5 วินาที
        setTimeout(() => {
          setActivityLogs(mockData);
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error("Failed to load activity logs:", error);
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getTypeConfig = (type) => {
    switch (type) {
      case "chat_incoming":
        return { label: "Chat Incoming", color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", icon: MessageCircle };
      case "tag_create":
        return { label: "Create Tag", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: Tag };
      case "tag_add":
        return { label: "Add Tag", color: "text-amber-300", bg: "bg-amber-300/10", border: "border-amber-300/20", icon: Tag };
      case "invite_user":
        return { label: "Invite User", color: "text-purple-300", bg: "bg-purple-300/10", border: "border-purple-300/20", icon: UserPlus };
      default:
        return { label: "Activity", color: "text-slate-300", bg: "bg-slate-300/10", border: "border-slate-300/20", icon: Activity };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  // 🟢 [BACKEND NOTE]: ปัจจุบันเป็นการ Filter ที่ฝั่งหน้าเว็บ (Client-side)
  // หากข้อมูล Log มีปริมาณมหาศาล (เช่น เกิน 10,000 รายการ) แนะนำให้ย้าย Logic นี้ไปเป็น
  // การแนบ Query Params ส่งไปให้ Backend แทน เช่น fetch(`/api/logs?type=${filterType}&search=${searchText}`)
  const filteredLogs = useMemo(() => {
    let logs = [...activityLogs];

    // 1) FILTER TYPE
    if (filterType !== "all") {
      logs = logs.filter((log) => log.type === filterType);
    }

    // 2) SEARCH (message, actor, target)
    if (searchText.trim() !== "") {
      logs = logs.filter((log) =>
        [log.message, log.actor, log.target]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    // 3) SORT
    logs.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    return logs;
  }, [activityLogs, filterType, sortOrder, searchText]);

  return (
    <div className="w-full h-[94vh] p-2 md:p-4">
      <div className="bg-[rgba(32,41,59,0.48)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl pt-6 px-6 h-full flex flex-col overflow-hidden">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="text-blue-400" /> Activity Logs
            </h1>
            <p className="text-slate-400 text-sm mt-1">Track all events and actions within your workspace.</p>
          </div>

          <div className="relative w-full md:w-auto min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              placeholder="Search by actor, target or message..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/60 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Filter size={16} />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 hover:bg-white/10 transition-colors appearance-none cursor-pointer min-w-[160px]"
            >
              <option className="bg-slate-900" value="all">All Activities</option>
              <option className="bg-slate-900" value="chat_incoming">Chat Incoming</option>
              <option className="bg-slate-900" value="tag_create">Create Tag</option>
              <option className="bg-slate-900" value="tag_add">Add Tag</option>
              <option className="bg-slate-900" value="invite_user">Invite User</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          {/* Sort Order */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ArrowUpDown size={16} />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 hover:bg-white/10 transition-colors appearance-none cursor-pointer min-w-[140px]"
            >
              <option className="bg-slate-900" value="newest">Newest First</option>
              <option className="bg-slate-900" value="oldest">Oldest First</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          <div className="flex-1"></div>

          {/* Refresh Button */}
          <button
            onClick={() => { setSearchText(""); setFilterType("all"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 hover:text-white transition-colors"
          >
            <RefreshCw size={16} /> <span className="hidden sm:inline">Reset Filters</span>
          </button>
        </div>

        {/* LOG LIST */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <RefreshCw className="animate-spin mb-4" size={32} />
              <p>Loading activity logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Search size={48} className="mb-4 opacity-20" />
              <p>No activities found matching your filters.</p>
              <button onClick={() => { setSearchText(""); setFilterType("all"); }} className="mt-2 text-blue-400 text-sm hover:underline">Clear filters</button>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const config = getTypeConfig(log.type);
              const Icon = config.icon;
              const isExpanded = expandedRow === log.id;

              return (
                <div key={log.id} className={`group rounded-xl border transition-all duration-200 overflow-hidden ${isExpanded ? "bg-white/5 border-white/20" : "bg-transparent border-transparent hover:bg-white/0.03 hover:border-white/5"}`}>
                  {/* Row Header */}
                  <div
                    onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                    className="flex items-center gap-4 p-4 cursor-pointer"
                  >
                    {/* Icon Box */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg} ${config.color} border ${config.border}`}>
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Message & Type */}
                      <div className="md:col-span-5">
                        <p className="text-white font-medium truncate">{log.message}</p>
                        <p className={`text-xs mt-0.5 font-medium ${config.color}`}>{config.label}</p>
                      </div>

                      {/* Actor -> Target */}
                      <div className="md:col-span-4 flex items-center gap-2 text-sm text-slate-400">
                        <span className="text-slate-200">{log.actor}</span>
                        <span className="text-slate-600">→</span>
                        <span className="truncate">{log.target}</span>
                      </div>

                      {/* Timestamp */}
                      <div className="md:col-span-3 text-right text-xs text-slate-500 flex items-center justify-end gap-2">
                        <Clock size={12} /> {formatDate(log.timestamp)}
                      </div>
                    </div>

                    {/* Chevron */}
                    <div className={`text-slate-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pl-[4.5rem]">
                      <div className="bg-black/20 rounded-lg p-4 border border-white/5 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {Object.entries(log.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-white/5 last:border-0 py-2">
                            <span className="text-slate-500 capitalize">{key}</span>
                            <span className="text-slate-200 font-medium text-right">{value}</span>
                          </div>
                        ))}
                        <div className="flex justify-between border-b border-white/5 last:border-0 py-2">
                          <span className="text-slate-500">Log ID</span>
                          <span className="text-slate-400 font-mono text-xs pt-0.5">#{log.id}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}