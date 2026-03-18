"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
    const pathname = usePathname();

    // ตั้งค่า Animation ให้ดูพรีเมียม
    const variants = {
        initial: {
            opacity: 0,
            y: 15, // เริ่มต้นต่ำลงนิดหน่อย
            filter: "blur(10px)" // เบลอตอนเริ่ม เพื่อความนวล
        },
        enter: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -15, // ลอยขึ้นตอนหายไป
            filter: "blur(10px)",
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    return (
        <div className="w-full min-h-screen overflow-hidden bg-transparent">
            {/* mode="wait" รอให้หน้าเก่าหายไปก่อน หน้าใหม่ค่อยมา */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname} // key สำคัญมาก! ถ้าเปลี่ยน path อนิเมชั่นจะทำงานใหม่
                    variants={variants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="w-full h-full"
                    onAnimationComplete={() => window.scrollTo(0, 0)} // ดีดหน้าจอไปบนสุดเมื่อเปลี่ยนหน้าเสร็จ
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}