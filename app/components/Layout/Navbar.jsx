"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <header className='max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 sticky top-4 z-50'>
            <div className='bg-slate-900/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex justify-between items-center shadow-lg shadow-black/20'>
                {/* Logo Section */}
                <Link href="/" className="logo flex items-center gap-3 group">
                    <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-linear-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                        {/* Fallback visual if image missing, or use Image */}
                        <Image
                            src="/images/LogoNav.png"
                            width={40}
                            height={40}
                            alt="Talka Logo"
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <p className='text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400 group-hover:text-white transition-colors'>
                        Talka
                    </p>
                </Link>

                {/* Navigation Actions */}
                <div className="authen-btn flex items-center gap-6">
                    <div className="login-btn hidden sm:block">
                        <Link href="/auth/login">
                            <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-2 py-1">
                                Login
                            </button>
                        </Link>
                    </div>
                    <div className='getstart-btn'>
                        <Link href="/auth/register">
                            <button className='bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 hover:border-purple-500 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(147,51,234,0.3)]'>
                                Start Free Trial
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}