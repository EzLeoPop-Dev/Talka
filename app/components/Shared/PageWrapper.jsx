"use client";

import React from "react";

export default function PageWrapper({ title, children }) {
    return (
        <div className="w-full h-full flex items-start justify-center">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-white/40"> </div>
                </div>

                <div className="px-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
