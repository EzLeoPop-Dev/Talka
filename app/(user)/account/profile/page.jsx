"use client";

import React, { useState, useEffect } from "react";
import { Camera, User, Mail, Save, Activity } from "lucide-react";

export default function ProfilePage() {
    const [email, setEmail] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [status, setStatus] = useState("online");
    const [role, setRole] = useState("Employee"); 
    const [avatar, setAvatar] = useState("");

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
        const color = Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215).toString(16);
        return `#${"0".repeat(6 - color.length) + color}`;
    }

    // 🟢 [BACKEND NOTE]: โหลดข้อมูลโปรไฟล์จาก API
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // 🟢 [API CALL]: ดึงข้อมูลของตัวเองจาก Backend
                // const response = await fetch('/api/users/me');
                // const user = await response.json();

                // ===============================================
                // [Mock Data] ข้อมูลจำลองเพื่อให้หน้าเว็บแสดงผลได้ระหว่างรอ API
                const user = {
                    username: "Somchai Admin",
                    email: "somchai@example.com",
                    role: "Owner",
                    status: "online",
                    avatar: ""
                };
                // ===============================================

                const nameParts = (user.username || "").split(" ");
                setFirst(nameParts[0] || "");
                setLast(nameParts.slice(1).join(" ") || "");
                
                setEmail(user.email || "");
                setRole(user.role || "Employee");
                if (user.status) setStatus(user.status);
                setAvatar(user.avatar && user.avatar.length > 10 ? user.avatar : ""); 

            } catch (error) {
                console.error("Error loading profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    // 🟢 [BACKEND NOTE]: บันทึกข้อมูลโปรไฟล์ไปยัง API
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const fullName = `${first} ${last}`.trim();
            const payload = {
                username: fullName,
                email: email,
                status: status,
                avatar: avatar || fullName.charAt(0).toUpperCase()
            };

            // 🟢 [API CALL]: อัปเดตข้อมูลส่วนตัว (PATCH / PUT)
            // const response = await fetch('/api/users/me', {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });
            // if (!response.ok) throw new Error('Failed to update profile');

            // 🟢 ส่ง event บอก component อื่น (เช่น Sidebar) ว่า Profile ถูกแก้ไขแล้ว
            // window.dispatchEvent(new Event("user_updated"));
            
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile.");
        }
    };

    const fullName = `${first} ${last}`.trim();

    return (
        <div className="text-white flex items-center justify-center p-4 relative overflow-hidden h-full">

            <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="w-full max-w-5xl backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row bg-[#1e1e2e]/50 shadow-2xl">

                {/* Left Column: Avatar & Quick Info */}
                <div className="md:w-1/3 bg-black/20 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 relative">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full p-1 bg-linear-to-tr from-purple-500 to-pink-500 mb-4 shadow-lg">
                            
                            {/* Avatar */}
                            <div className="w-full h-full rounded-full overflow-hidden bg-neutral-800 relative flex items-center justify-center">
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt="avatar"
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    // ถ้าไม่มีรูป ให้แสดงพื้นหลังสี + ตัวอักษรย่อ
                                    <div 
                                        className="w-full h-full flex items-center justify-center text-5xl font-bold text-white"
                                        style={{ backgroundColor: stringToColor(fullName || "?") }}
                                    >
                                        {getInitials(fullName)}
                                    </div>
                                )}
                                
                                {/* Hover Overlay (สำหรับปุ่มเปลี่ยนรูป) */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-8 h-8 text-white/80" />
                                </div>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className={`absolute bottom-6 right-2 w-6 h-6 border-4 border-[#1a1f2e] rounded-full transition-colors duration-300
                            ${status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mt-2 text-center">{fullName}</h2>
                    <p className="text-white/40 text-sm mb-1">{role}</p>
                    <p className="text-white/30 text-xs mb-6">{email || "No email set"}</p>

                    <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                        <Camera size={16} /> Change Photo
                    </button>
                </div>

                {/* Right Column: Edit Form */}
                <div className="md:w-2/3 p-8 md:p-12">
                     {/* Form */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
                                Profile Settings
                            </h1>
                            <p className="text-white/40 text-sm mt-1">Update your personal information.</p>
                        </div>
                        <div className="hidden md:block p-3 bg-white/5 rounded-2xl border border-white/5">
                            <User className="text-purple-400" size={24} />
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">First Name</label>
                                <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First Name" className="w-full rounded-xl px-4 py-3 bg-white/5 text-white placeholder-white/20 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Last Name</label>
                                <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last Name" className="w-full rounded-xl px-4 py-3 bg-white/5 text-white placeholder-white/20 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" size={18} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full rounded-xl pl-12 pr-4 py-3 bg-white/5 text-white placeholder-white/20 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Online Status</label>
                            <div className="relative">
                                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl pl-12 pr-4 py-3 bg-white/5 text-white border border-white/10 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer hover:bg-white/10 transition-colors">
                                    <option value="online" className="bg-[#1e1e2e]">🟢 &nbsp; Online</option>
                                    <option value="away" className="bg-[#1e1e2e]">🟡 &nbsp; Away</option>
                                    <option value="offline" className="bg-[#1e1e2e]">🔴 &nbsp; Offline</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                            <button type="button" className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-xl px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}