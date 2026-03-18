"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountSidebar() {
    const pathname = usePathname();

    const items = [
        { href: "/account/profile", label: "Profile Setting" },
        { href: "/account/password", label: "Change Password" },
        { href: "/account/notification", label: "Notification settings" },
    ];

    return (
        <aside className="w-60">
            <div className="min-h-full border-r border-white/10 pr-6">
                <nav className="flex flex-col gap-2 text-sm">
                    {items.map((it) => {
                        const active = pathname === it.href;
                        return (
                            <Link
                                key={it.href}
                                href={it.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
                                        ? "bg-white/6 text-white font-medium ring-1 ring-white/10"
                                        : "text-white/60 hover:bg-white/2 hover:text-white"
                                    }`}
                            >
                                <span className="ml-1">{it.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
