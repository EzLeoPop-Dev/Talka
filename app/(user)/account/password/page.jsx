"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight } from "lucide-react";

export default function ChangePasswordPage() {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // 🟢 [BACKEND NOTE]: เพิ่ม State สำหรับแสดงสถานะ Loading ระหว่างรอ API
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // 🟢 [BACKEND NOTE]: เปลี่ยนเป็น async function เพื่อยิง API
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!currentPass || !newPass || !confirm) {
            alert("Please fill in all fields.");
            return;
        }

        if (newPass !== confirm) {
            alert("New password and confirm do not match.");
            return;
        }

        setIsLoading(true);

        try {
            // 🟢 [API CALL]: ยิง API เพื่ออัปเดตรหัสผ่าน
            // const response = await fetch('/api/users/change-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         currentPassword: currentPass,
            //         newPassword: newPass
            //     })
            // });

            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || "Failed to update password");
            // }

            // Demo action (ระหว่างรอต่อ API)
            alert("Password updated successfully!");
            router.push("/account/notification");

        } catch (error) {
            console.error("Password update error:", error);
            alert(error.message || "An error occurred while updating the password.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="text-white flex items-center justify-center p-4 relative overflow-hidden">

            {/* Main Card */}
            <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Column: Security Tips */}
                <div className="md:w-1/3 bg-black/20 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
                    <div>
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                            <ShieldCheck className="text-white w-8 h-8" />
                        </div>

                        <h2 className="text-xl font-bold mb-2">Secure Your Account</h2>
                        <p className="text-white/50 text-sm mb-8 leading-relaxed">
                            To keep your account safe, we recommend using a strong password that you haven't used elsewhere.
                        </p>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Password Requirements</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-white/70">
                                    <CheckCircle2 size={16} className="text-emerald-400" /> At least 8 characters
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/70">
                                    <CheckCircle2 size={16} className="text-emerald-400" /> Includes a number
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/70">
                                    <CheckCircle2 size={16} className="text-emerald-400" /> Includes a symbol (!@#$)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-0 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-emerald-200 flex items-start gap-2">
                            <Lock size={14} className="mt-0.5 shrink-0" />
                            Your password is encrypted and never stored in plain text.
                        </p>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="md:w-2/3 p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
                            Change Password
                        </h1>
                        <p className="text-white/40 text-sm mt-1">Please enter your current password to set a new one.</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">

                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Current Password</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPass}
                                    onChange={(e) => setCurrentPass(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl pl-12 pr-12 py-3 bg-white/5 text-white placeholder-white/20 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <hr className="border-white/5 my-2" />

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPass}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full rounded-xl pl-12 pr-12 py-3 bg-white/5 text-white placeholder-white/20 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className="w-full rounded-xl pl-12 pr-12 py-3 bg-white/5 text-white placeholder-white/20 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                            <button type="button" className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex items-center gap-2 rounded-xl px-8 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}