"use client";

export const GlassBackground = ({ children, className = '', style = {} }) => (
    <div
        className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl transition-all ${className}`}
        style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            ...style
        }}
    >
        {children}
    </div>
);