"use client";

import PageWrapper from "@/app/components/Shared/PageWrapper";

export default function MyProfile() {
    return (
        <PageWrapper title="My Profile">
            <div className="grid grid-cols-1 gap-4">
                <input
                    placeholder="Full Name"
                    className="bg-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3"
                />
                <input
                    placeholder="Email Address"
                    className="bg-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3"
                />
                <input
                    placeholder="Phone Number"
                    className="bg-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3"
                />
            </div>

            <button className="w-full mt-4 rounded-xl bg-white/20 hover:bg-white/30 transition-all py-3 text-white font-medium">
                Save Changes
            </button>
        </PageWrapper>
    );
}
