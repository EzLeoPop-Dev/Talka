"use client";

import React from "react";
import PageWrapper from "@/app/components/Shared/PageWrapper";
import AccountSidebar from "@/app/components/Layout/AccountSidebar";
import { User } from "lucide-react";


export default function AccountLayout({ children }) {
    return (
        <div className="h-full w-full bg-[rgba(32,41,59,0.25)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-8">
            <div className="items-start mb-10 border-b border-white/20 pb-6 flex gap-4">
                <div className="flex items-center gap-3">
                    <User className="text-white" size={52} />
                    <div>
                        <h1 className="text-xl font-semibold text-white">Profile Setting</h1>
                        <p className="text-sm text-white/70">
                            Manage your account information and preferences
                        </p>
                    </div>
                </div>
            </div>
            <div className="max-w-full">
                <div className="flex gap-6">
                    <AccountSidebar />
                    <div className="flex-1">
                        <PageWrapper title="Profile Setting">
                            <div className="flex gap-8">
                                <div className="flex-1">{children}</div>
                            </div>
                        </PageWrapper>
                    </div>
                </div>
            </div>
        </div>
    );
}
