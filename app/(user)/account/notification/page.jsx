"use client";

import React, { useState } from "react";
import { BellRing, Mail, MessageSquare, AppWindow, Save, Radio, Bell } from "lucide-react";

export default function NotificationSettingsPage() {
    const [emailNoti, setEmailNoti] = useState(true);
    const [smsNoti, setSmsNoti] = useState(false);
    const [inApp, setInApp] = useState(true);

    return (
        <div className="text-white flex items-center justify-center p-4 relative overflow-hidden">

            {/* Main Card */}
            <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Column: Sidebar info */}
                <div className="md:w-1/3 bg-black/20 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
                    <div>
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-sky-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-sky-500/20">
                            <BellRing className="text-white w-8 h-8" />
                        </div>

                        <h2 className="text-xl font-bold mb-2">Manage Alerts</h2>
                        <p className="text-white/50 text-sm mb-6 leading-relaxed">
                            Decide how and when you want to be notified. You can update these preferences at any time.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <h4 className="text-indigo-300 font-medium text-sm mb-2 flex items-center gap-2">
                            <Radio size={16} className="animate-pulse" />
                            Pro Tip
                        </h4>
                        <p className="text-xs text-indigo-200/70">
                            Turn on SMS notifications for urgent security alerts to ensure you never miss critical updates.
                        </p>
                    </div>
                </div>

                {/* Right Column: Settings List */}
                <div className="md:w-2/3 p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
                            Notification Settings
                        </h1>
                        <p className="text-white/40 text-sm mt-1">Customize your digital experience.</p>
                    </div>

                    <div className="space-y-6">

                        {/* Setting Item: Email */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 text-sky-400 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-white">Email Notifications</h5>
                                    <p className="text-xs text-white/50 mt-1">Receive weekly digests and major updates.</p>
                                </div>
                            </div>
                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={emailNoti} onChange={() => setEmailNoti(!emailNoti)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-2 after:start-2 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                            </label>
                        </div>

                        {/* Setting Item: SMS */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 text-amber-400 group-hover:scale-110 transition-transform">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-white">SMS Notifications</h5>
                                    <p className="text-xs text-white/50 mt-1">Instant alerts for security and login attempts.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={smsNoti} onChange={() => setSmsNoti(!smsNoti)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-2 after:start-2 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        {/* Setting Item: In-App */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 text-indigo-400 group-hover:scale-110 transition-transform">
                                    <AppWindow size={24} />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-white">In-app Notifications</h5>
                                    <p className="text-xs text-white/50 mt-1">Real-time banners while you are using the app.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={inApp} onChange={() => setInApp(!inApp)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-2 after:start-2 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                            </label>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="pt-8 mt-4 border-t border-white/5 flex items-center justify-end">
                        <button
                            className="flex items-center gap-2 rounded-xl px-8 py-3 bg-linear-to-r from-sky-600 to-indigo-600 text-white font-semibold shadow-lg shadow-sky-600/20 hover:shadow-sky-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Save size={18} />
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}