"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  MessageCircle,
  Contact,
  Headphones,
  LayoutDashboard,
  ChevronDown,
  Megaphone,
  Building2,
  Palette,
  Image as ImageIcon,
  Upload,
  Sun,
  Moon,
  Users,
  LogOut,
  Check,
  X,
  FileClock,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status, update } = useSession();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [isOpenWorkspace, setIsOpenWorkspace] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("Work Space");
  const [workspaceLogo, setWorkspaceLogo] = useState("/images/LogoSidebar.png");
  const workspaces = ["Work Space", "Development", "Marketing", "Support Team"];

  // User 
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState("ONLINE");
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userTeam, setUserTeam] = useState("No Team");
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Background & Theme State
  const [showBgModal, setShowBgModal] = useState(false);
  const [bgList, setBgList] = useState([]);
  const [selectedBg, setSelectedBg] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("dark");

  // --- Themes Data ---
  const themes = [
    {
      id: "light",
      name: "Light Mode",
      icon: Sun,
      description: "Clean & bright interface",
    },
    {
      id: "dark",
      name: "Dark Mode",
      icon: Moon,
      description: "Easy on the eyes",
    },
  ];

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: themeId }));
  };

  const loadNotifications = () => {
    try {
      const savedData = localStorage.getItem("onechat_data");
      if (savedData) {
        const chats = JSON.parse(savedData);
        const newChats = chats.filter((chat) => chat.status === "New Chat");
        const formattedNotifications = newChats.map((chat) => ({
          id: chat.id,
          name: chat.name,
          profile: chat.imgUrl,
          platform: chat.channel,
          message: chat.lastMessage || "มีข้อความใหม่",
          time: chat.lastMessageTime || "ล่าสุด",
          icon: chat.channel?.toLowerCase(),
        }));
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    const syncProfile = async (shouldUpdateSession = false) => {
      if (status === "authenticated" && session?.user) {
        try {
          const res = await fetch("/api/users/profile");
          if (res.ok) {
            const data = await res.json();
            setUserName(data.profile.username);
            setUserRole(data.profile.role);
            setAvatar(data.profile.profile_image || "");
            setOnlineStatus(data.profile.online_status || "ONLINE");
            
            if (shouldUpdateSession) {
              await update();
            }
          }
        } catch (err) {
          console.error("Sync profile error:", err);
        } finally {
          setIsFetchingProfile(false);
        }
      } else if (status === "unauthenticated") {
        setUserName("Guest");
        setIsFetchingProfile(false);
      }
    };

    syncProfile(false);

    const fetchWorkspaceSettings = async () => {
      try {
        const res = await fetch("/api/generalinfo");
        if (res.ok) {
           const data = await res.json();
           if (data.workspaceName) setSelectedWorkspace(data.workspaceName);
           if (data.logoUrl) setWorkspaceLogo(data.logoUrl);
        }
      } catch (e) {}
    };
    fetchWorkspaceSettings();

    const handleUpdate = () => {
      syncProfile(true);
    };

    window.addEventListener("user_updated", handleUpdate);
    
    try {
      const storedTeams = localStorage.getItem("teams");
      if (storedTeams && session?.user?.name) {
        const teams = JSON.parse(storedTeams);
        const foundTeam = teams.find(t => t.members?.includes(session.user.name));
        if (foundTeam) setUserTeam(foundTeam.name);
      }
    } catch (error) {}

    return () => window.removeEventListener("user_updated", handleUpdate);
  }, [status]);

  useEffect(() => {
    const savedList = localStorage.getItem("backgroundList");
    if (savedList) {
      try {
        setBgList(JSON.parse(savedList));
      } catch {
        setBgList([
          "/images/Bg.jpg",
          "/images/Bg2.png",
          "/images/Bg3.jpg",
          "/images/Bg4.jpg",
        ]);
      }
    } else {
      const defaults = [
        "/images/Bg.jpg",
        "/images/Bg2.png",
        "/images/Bg3.jpg",
        "/images/Bg4.jpg",
      ];
      setBgList(defaults);
      localStorage.setItem("backgroundList", JSON.stringify(defaults));
    }

    const savedBg = localStorage.getItem("appBackground");
    if (savedBg) setSelectedBg(savedBg);

    loadNotifications();
    const handleChatUpdate = () => loadNotifications();
    window.addEventListener("chat-data-updated", handleChatUpdate);

    return () =>
      window.removeEventListener("chat-data-updated", handleChatUpdate);
  }, []);


  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" }); 
  };

  const handleUploadBg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const updated = [...bgList, dataUrl];
      setBgList(updated);
      localStorage.setItem("backgroundList", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const applyBackground = (bg) => {
    setSelectedBg(bg);
    localStorage.setItem("appBackground", bg);
    window.dispatchEvent(new CustomEvent("background-changed", { detail: bg }));
    setShowBgModal(false);
  };

  const notiRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target))
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex p-3 h-screen">
      <div
        className="relative w-[260px] h-full rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl bg-[#1a1423] border border-[#BE7EC7]/10"
      >
        {/* เอา Effect เรืองแสงที่กินสเปคออก */}

        <div className="relative z-10 flex px-5 flex-col flex-1 overflow-y-auto custom-scrollbar pt-6">
        {/* Header: Notifications & User Profile */}
          <div className="flex items-center justify-between mb-8 gap-3">
            <div
              className="flex items-center gap-3 flex-1 min-w-0 group cursor-pointer"
              onClick={() => setOpenUserMenu(!openUserMenu)}
            >
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm border border-white/10 shadow-lg shrink-0 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${stringToColor(userName)}, ${stringToColor(userName + "dark")})`,
                  }}
                >
                  {(status === "loading" || isFetchingProfile) ? (
                     <div className="w-full h-full bg-white/10 animate-pulse"></div>
                  ) : avatar || session?.user?.image ? (
                    <img
                      src={avatar || session.user.image}
                      alt="Profile"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(userName)}
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#1a1a2e] rounded-full flex items-center justify-center z-10">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      onlineStatus?.toUpperCase() === "ONLINE" ? "bg-green-500" : 
                      onlineStatus?.toUpperCase() === "AWAY" ? "bg-yellow-500" : 
                      "bg-neutral-500"
                    }`}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col min-w-0 justify-center pt-1">
                {(status === "loading" || isFetchingProfile) ? (
                  <div className="space-y-2">
                    <div className="w-20 h-3 bg-white/10 animate-pulse rounded"></div>
                    <div className="w-12 h-2 bg-white/5 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-white text-sm font-semibold truncate group-hover:text-[#BE7EC7] leading-none">
                      {userName || session?.user?.name || "User"}
                    </p>
                    
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span 
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          userRole === 'ADMIN' 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : 'bg-[#BE7EC7]/10 text-[#BE7EC7] border-[#BE7EC7]/20'
                        }`}
                      >
                        {userRole || 'USER'}
                      </span>

                      {userTeam && userTeam !== "No Team" && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-white/70">
                          <Users size={10} />
                          <span className="truncate max-w-[50px]">{userTeam}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowNotifications(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-[#BE7EC7]/10 border border-white/5 hover:border-[#BE7EC7]/30 text-white/70 hover:text-[#e0b8e6]"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <>
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </>
              )}
            </button>
          </div>

          {/* User Menu Dropdown (ถอด Framer Motion ออก) */}
            {openUserMenu && (
              <div
                className="absolute top-16 left-5 right-5 bg-[#1E1B29] border border-white/10 rounded-2xl shadow-xl p-2 z-50 overflow-hidden"
              >
                <div className="text-xs font-semibold text-white/40 px-3 py-2 uppercase tracking-wider">
                  Account
                </div>
                <Link
                  href="/account/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white rounded-lg"
                >
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                    <Users size={14} />
                  </div>{" "}
                  Profile
                </Link>
                <Link
                  href="/account/notification"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white rounded-lg"
                >
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                    <Bell size={14} />
                  </div>{" "}
                  Notifications
                </Link>
                <div className="h-px bg-white/5 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                    <LogOut size={14} />
                  </div>{" "}
                  Logout
                </button>
              </div>
            )}

          {/* Navigation Menu */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-[#BE7EC7]/60 font-bold uppercase tracking-widest px-2 mb-2">
                Main Menu
              </p>
              <nav className="space-y-1">
                <SidebarLink
                  href="/tutorial"
                  icon={<Sparkles size={18} />}
                  label="Tutorial"
                  pathname={pathname}
                />
                <DropdownMenu
                  title="Chat"
                  icon={<MessageCircle size={18} />}
                  isOpen={openDropdown === "Chat"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "Chat" ? null : "Chat")
                  }
                  links={[
                    { href: "/chat/allchat", label: "All Chat" },
                    { href: "/chat/customchat", label: "Custom Chat" },
                    { href: "/chat/facebook", label: "Facebook" },
                    { href: "/chat/line", label: "Line" },
                  ]}
                  pathname={pathname}
                />
                <SidebarLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  pathname={pathname}
                />
              </nav>
            </div>

            {userRole === "ADMIN" && (
              <div>
                <p className="text-[10px] text-[#BE7EC7]/60 font-bold uppercase tracking-widest px-2 mb-2">
                  Management
                </p>
                <nav className="space-y-1">
                  <SidebarLink
                    href="/contact"
                    icon={<Contact size={18} />}
                    label="Contacts"
                    pathname={pathname}
                  />
                  <SidebarLink
                    href="/ai-support"
                    icon={<Headphones size={18} />}
                    label="AI Agent"
                    pathname={pathname}
                  />
                  <SidebarLink
                    href="/log"
                    icon={<FileClock size={18} />}
                    label="System Logs"
                    pathname={pathname}
                  />
                  <DropdownMenu
                    title="Reports"
                    icon={<Megaphone size={18} />}
                    isOpen={openDropdown === "Report"}
                    onToggle={() =>
                      setOpenDropdown(
                        openDropdown === "Report" ? null : "Report",
                      )
                    }
                    links={[
                      { href: "/Report/contacts", label: "Contacts" },
                      { href: "/Report/conversation", label: "Conversations" },
                      { href: "/Report/message", label: "Messages" },
                      { href: "/Report/responses", label: "Responses" },
                      { href: "/Report/users", label: "Team Performance" },
                    ]}
                    pathname={pathname}
                  />
                  <DropdownMenu
                    title="Admin Panel"
                    icon={<Settings size={18} />}
                    isOpen={openDropdown === "Admin"}
                    onToggle={() =>
                      setOpenDropdown(openDropdown === "Admin" ? null : "Admin")
                    }
                    links={[
                      { href: "/admin/generalinfo", label: "General Info" },
                      { href: "/admin/channel", label: "Connect" },
                      { href: "/admin/usersetting", label: "Users" },
                      { href: "/admin/teamsetting", label: "Teams" },
                      { href: "/admin/tag", label: "Tags" },
                      { href: "/admin/aiprompt", label: "AI Prompt" },
                    ]}
                    pathname={pathname}
                  />
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Workspace & Brand */}
        <div className="relative z-20 p-4 mt-auto">
          <div className="relative mb-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                Workspace
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowThemeModal(true)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-[#BE7EC7] hover:bg-white/10"
                >
                  <Palette size={12} />
                </button>
                <button
                  onClick={() => setShowBgModal(true)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-[#BE7EC7] hover:bg-white/10"
                >
                  <ImageIcon size={12} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsOpenWorkspace(!isOpenWorkspace)}
              className="w-full flex items-center justify-between gap-3 bg-white/5 border border-white/5 hover:border-[#BE7EC7]/30 hover:bg-white/10 text-white p-2.5 rounded-xl group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 flex items-center justify-center bg-[#BE7EC7] rounded-lg">
                  <Building2 size={16} className="text-white" />
                </div>
                <span className="font-medium text-sm truncate">
                  {selectedWorkspace}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-white/50 ${isOpenWorkspace ? "rotate-180" : ""}`}
              />
            </button>

              {isOpenWorkspace && (
                <div
                  className="absolute bottom-full mb-2 w-full bg-[#1E1B29] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {workspaces.map((ws) => (
                      <button
                        key={ws}
                        onClick={() => {
                          setSelectedWorkspace(ws);
                          setIsOpenWorkspace(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between ${selectedWorkspace === ws ? "bg-[#BE7EC7] text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                      >
                        {ws}
                        {selectedWorkspace === ws && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 py-2 border-t border-white/5">
            <img
              src={workspaceLogo}
              alt="Talka"
              style={{ width: "20px", height: "20px", objectFit: "contain", borderRadius: "4px" }}
            />
            <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              {selectedWorkspace === "Work Space" ? "TALKA" : selectedWorkspace}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
        {showNotifications && (
          <div className="fixed inset-0 z-[100] flex items-start justify-end p-4 sm:p-6 pointer-events-none">
            <div
              className="absolute inset-0 bg-black/40 pointer-events-auto"
              onClick={() => setShowNotifications(false)}
            ></div>
            <div
              className="relative pointer-events-auto w-full max-w-sm bg-[#1E1B29] border border-white/10 rounded-2xl shadow-2xl overflow-hidden mt-10 mr-2"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell size={14} className="text-[#BE7EC7]" /> Notifications
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        router.push(`/chat/allchat?id=${n.id}`);
                        setShowNotifications(false);
                      }}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5"
                    >
                      <img
                        src={n.profile}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="text-sm font-medium text-white truncate">
                            {n.name}
                          </p>
                          <span className="text-[10px] text-white/30">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-1 group-hover:text-white/80">
                          {n.message}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded border ${n.platform === "Line" ? "bg-[#06c755]/10 border-[#06c755]/20 text-[#06c755]" : "bg-blue-500/10 border-blue-500/20 text-blue-400"}`}
                          >
                            {n.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/30 text-xs">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Background & Theme Modals (Optimized) */}
        {(showBgModal || showThemeModal) && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => {
                setShowBgModal(false);
                setShowThemeModal(false);
              }}
            />
            {showBgModal && (
              <div
                className="relative bg-[#1E1B29] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-2xl w-full"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Select Wallpaper
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {bgList.map((bg, idx) => (
                    <div
                      key={idx}
                      onClick={() => applyBackground(bg)}
                      className={`aspect-video rounded-xl border-2 overflow-hidden cursor-pointer relative group ${selectedBg === bg ? "border-[#BE7EC7]" : "border-transparent hover:border-white/20"}`}
                    >
                      <img src={bg} className="w-full h-full object-cover" />
                      {selectedBg === bg && (
                        <div className="absolute inset-0 bg-[#BE7EC7]/20 flex items-center justify-center">
                          <Check className="text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  ))}
                  <label className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition">
                    <Upload size={20} className="text-white/50 mb-2" />
                    <span className="text-xs text-white/50">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadBg}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
            {showThemeModal && (
              <div
                className="relative bg-[#1E1B29] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Appearance
                </h3>
                <div className="space-y-3">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border ${selectedTheme === t.id ? "bg-[#BE7EC7] border-[#BE7EC7] text-white" : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"}`}
                    >
                      <t.icon size={24} />
                      <div className="text-left">
                        <p className="font-bold text-sm">{t.name}</p>
                        <p className="text-xs opacity-70">{t.description}</p>
                      </div>
                      {selectedTheme === t.id && (
                        <Check size={18} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

// Reusable Components with Optimized Styles

function SidebarLink({ href, icon, label, pathname }) {
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden ${
        isActive
          ? "bg-[#BE7EC7]/20 text-white"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      <div className={`relative z-10 ${isActive ? "text-[#BE7EC7]" : ""}`}>
        {icon}
      </div>
      <span
        className={`relative z-10 text-sm font-medium tracking-wide ${isActive ? "font-semibold" : ""}`}
      >
        {label}
      </span>
    </Link>
  );
}

function DropdownMenu({ title, icon, links, isOpen, onToggle, pathname }) {
  const isParentActive = links.some((link) => pathname === link.href);

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl ${
          isOpen || isParentActive
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
      >
        <div
          className={`${isOpen || isParentActive ? "text-[#BE7EC7]" : ""}`}
        >
          {icon}
        </div>
        <span
          className={`text-sm font-medium tracking-wide ${isParentActive ? "text-white" : ""}`}
        >
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`ml-auto opacity-50 ${isOpen ? "rotate-180 opacity-100 text-[#BE7EC7]" : ""}`}
        />
      </button>

        {isOpen && (
          <div className="overflow-hidden">
            <div className="ml-5 pl-3 border-l border-white/10 space-y-1 py-1 mt-1">
              {links.map((link) => {
                const isLinkActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs ${
                      isLinkActive
                        ? "bg-[#BE7EC7]/20 text-[#e0b8e6] font-medium"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(
    Math.abs(Math.sin(hash) * 16777215) % 16777215,
  ).toString(16);
  return `#${"0".repeat(6 - color.length) + color}`;
}