"use client";

import React from 'react';
import {
    Check,
    Phone,
    Cloud,
    LayoutDashboard,
    BarChart3,
    Bot,
    Layers,
    ArrowRight,
    MessageCircle,
    Smartphone
} from 'lucide-react';
import Image from 'next/image';
import "@/app/assets/css/other.css";
import "@/app/assets/css/globals.css";

// สมมติว่า Components เหล่านี้มีอยู่จริงตามที่คุณ import มา
import Navbar from './components/Layout/Navbar';
import DarkVeil from './components/Animetion/DarkVeil';
import LogoLoop from './components/Animetion/LogoLoop';
import AnimatedContent from './components/Animetion/AnimatedContent';
import SpotlightCard from './components/Animetion/SpotlightCard';
import TrueFocus from './components/Animetion/TrueFocus';

export default function TalkaLanding() {

    // เปลี่ยนจากรูปภาพเป็น Lucide Icons เพื่อความสวยงามและคมชัด
    const features = [
        {
            icon: <MessageCircle size={40} className="text-purple-400" />,
            title: "Omnichannel Chat",
            description: "รวมแชทจาก Line, Facebook, IG ไว้ในที่เดียว ไม่พลาดทุกการติดต่อ"
        },
        {
            icon: <Cloud size={40} className="text-blue-400" />,
            title: "Cloud Based",
            description: "เข้าถึงข้อมูลได้จากทุกที่ ทุกเวลา ด้วยระบบ Cloud ที่ปลอดภัย"
        },
        {
            icon: <LayoutDashboard size={40} className="text-pink-400" />,
            title: "Scalable System",
            description: "ขยายระบบได้ตามการเติบโตของธุรกิจคุณ ปรับแต่งได้ดั่งใจ"
        },
        {
            icon: <BarChart3 size={40} className="text-green-400" />,
            title: "Deep Analytics",
            description: "วิเคราะห์ข้อมูลเชิงลึก ติดตาม Performance ของทีมได้แบบ Real-time"
        },
        {
            icon: <Bot size={40} className="text-yellow-400" />,
            title: "AI Automation",
            description: "ตอบลูกค้าอัตโนมัติด้วย AI อัจฉริยะ ช่วยลดงานซ้ำซ้อน"
        },
        {
            icon: <Layers size={40} className="text-cyan-400" />,
            title: "All-In-One Solution",
            description: "ครบจบในแพลตฟอร์มเดียว ทั้งแชท โทร และจัดการลูกค้า"
        }
    ];

    // โลโก้จริง (ใช้ Link จาก Wikipedia/Commons เพื่อให้แสดงผลได้ทันที)
    const imageLogos = [
        { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg", alt: "Line", href: "#" },
        { src: "https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg", alt: "Messenger", href: "#" },
        { src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", alt: "Facebook", href: "#" },
        { src: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", alt: "Instagram", href: "#" },
        { src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", alt: "WhatsApp", href: "#" },
        { src: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg", alt: "Telegram", href: "#" },
    ];

    const plans = [
        {
            name: "Starter",
            price: "$29",
            period: "/month/user",
            features: [
                "Unlimited Inbound",
                "Live Video + Screen",
                "IOS + Mobile App",
                "AI Agent (Basic)",
                "Real-Time Dashboard"
            ],
            highlighted: false
        },
        {
            name: "Professional",
            price: "$59",
            period: "/month/user",
            features: [
                "All Starter Features",
                "Unlimited US/Canada",
                "Call Recording",
                "Advanced Analytics",
                "Multi-Level IVR",
                "Priority Support"
            ],
            highlighted: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "contact sales",
            features: [
                "Unlimited Professional",
                "Custom Integration",
                "Dedicated Support 24/7",
                "SSO & Advanced Security",
                "Onboarding Training"
            ],
            highlighted: false
        }
    ];

    return (
        <div className="min-h-screen relative bg-slate-950 text-white overflow-hidden font-sans selection:bg-purple-500/30">

            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <DarkVeil />
                {/* Ambient Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10">

                <div className="container mx-auto px-6 py-4">
                    <Navbar />
                </div>

                {/* --- HERO SECTION --- */}
                <AnimatedContent
                    distance={100}
                    direction="vertical"
                    reverse={false}
                    duration={1}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1}
                    threshold={0.1}
                >
                    <section className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh] px-6 text-center relative">

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
                            New AI Features Available
                        </div>

                        <div className="mb-6 scale-110 sm:scale-100">
                            <TrueFocus
                                sentence="Talka Unifies Conversations"
                                manualMode={false}
                                blurAmount={3}
                                borderColor="#be7ec7"
                                animationDuration={0.8}
                                pauseBetweenAnimations={3}
                            />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-6 leading-tight">
                            แอบรวมเเชทจากหลายแพลตฟอร์ม <br />
                            <span className="text-3xl md:text-5xl text-purple-200/80">บริหารจัดการได้ในที่เดียว</span>
                        </h1>

                        <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
                            เปลี่ยนวิธีที่ธุรกิจของคุณสื่อสารกับลูกค้า ด้วยศูนย์รวมแชทอัจฉริยะที่นำทุกข้อความจาก
                            Line, Facebook, และ IG มาอยู่ในอินบ็อกซ์เดียว พร้อม AI ช่วยตอบ 24/7
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <a href="/auth/register">
                                <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    Get Started Free
                                </button>
                            </a>
                            <button className="px-8 py-4 bg-white/5 text-white border border-white/10 font-semibold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                                <span className="bg-purple-500 rounded-full p-1"><Check size={12} /></span> Book a Demo
                            </button>
                        </div>
                    </section>
                </AnimatedContent>

                {/* --- TRUSTED BY LOGOS --- */}
                <section className="border-y border-white/5 bg-black/20 backdrop-blur-sm py-10 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-center text-slate-500 text-sm mb-8 uppercase tracking-widest">Connects seamlessly with</p>
                        <div className="opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            <LogoLoop
                                logos={imageLogos}
                                speed={40}
                                direction="left"
                                logoHeight={40}
                                gap={60}
                                hoverSpeed={0}
                                scaleOnHover
                                fadeOut
                            />
                        </div>
                    </div>
                </section>

                {/* --- FEATURES GRID --- */}
                <section className="max-w-7xl mx-auto px-6 py-32">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Talka is the best choice</h2>
                        <p className="text-slate-400 text-lg">Everything you need to manage customer conversations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <SpotlightCard key={index} className="custom-spotlight-card h-full" spotlightColor="rgba(190,126,199,0.3)">
                                <div className="bg-slate-900/40 h-full backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 flex flex-col items-start text-left group">
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </section>

                {/* --- PRICING SECTION --- */}
                <section className="max-w-7xl mx-auto px-6 py-20 relative">
                    {/* Background glow for pricing */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-slate-400">No hidden fees. Cancel anytime.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-end">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 ${plan.highlighted
                                        ? 'bg-slate-900/80 border-2 border-purple-500/50 shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)] scale-105 z-10'
                                        : 'bg-slate-900/40 border border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-xl font-bold mb-2 text-slate-200">{plan.name}</h3>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-slate-500 text-sm">{plan.period}</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start gap-3 text-sm">
                                            <div className={`mt-0.5 p-0.5 rounded-full ${plan.highlighted ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-slate-300'}`}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${plan.highlighted
                                            ? 'bg-white text-black hover:bg-purple-50 hover:scale-[1.02]'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Choose Plan'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- NEW CTA SECTION --- */}
                <section className="max-w-5xl mx-auto px-6 py-24 text-center">
                    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to transform your support?</h2>
                        <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10">
                            Join thousands of businesses using Talka to deliver exceptional customer experiences across all channels.
                        </p>
                        <div className="relative z-10">
                            <a href="/auth/register">
                                <button className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold transition-all flex items-center gap-2 mx-auto">
                                    Start your 14-day free trial <ArrowRight size={18} />
                                </button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="border-t border-white/10 bg-black/40 pt-16 pb-8">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Talka</h3>
                            <p className="text-slate-500 max-w-sm">
                                The ultimate omnichannel communication platform for modern businesses. Connect, automate, and grow.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Product</h4>
                            <ul className="space-y-2 text-slate-500 text-sm">
                                <li className="hover:text-white cursor-pointer">Features</li>
                                <li className="hover:text-white cursor-pointer">Pricing</li>
                                <li className="hover:text-white cursor-pointer">Integrations</li>
                                <li className="hover:text-white cursor-pointer">Changelog</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Company</h4>
                            <ul className="space-y-2 text-slate-500 text-sm">
                                <li className="hover:text-white cursor-pointer">About Us</li>
                                <li className="hover:text-white cursor-pointer">Careers</li>
                                <li className="hover:text-white cursor-pointer">Blog</li>
                                <li className="hover:text-white cursor-pointer">Contact</li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-sm">
                        <p>© 2024 Talka Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-white cursor-pointer">Terms of Service</span>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}