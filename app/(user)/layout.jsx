"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Layout/SideBar";

export default function SidebarLayout({ children }) {
    // 🟢 [BACKEND NOTE]: ตั้งค่า Default Background ไปก่อนระหว่างรอข้อมูลจาก API
    const [bg, setBg] = useState("/images/Bg.jpg");

    useEffect(() => {
        // 🟢 [BACKEND NOTE]: ดึงข้อมูลการตั้งค่าพื้นหลังของผู้ใช้จาก Database (เช่น ดึงจากตาราง User Preferences)
        const fetchUserPreferences = async () => {
            try {
                // 🟢 โค้ดตัวอย่างสำหรับดึงข้อมูลจริง
                // const response = await fetch('/api/user/preferences');
                // const data = await response.json();
                // if (data.backgroundUrl) {
                //     setBg(data.backgroundUrl);
                // }
            } catch (error) {
                console.error("Failed to load background preference:", error);
            }
        };

        fetchUserPreferences();

        // 🟢 [BACKEND NOTE]: Event Listener นี้ยังเก็บไว้ใช้ได้ดี! 
        // เอาไว้เวลาผู้ใช้กดเปลี่ยนรูปจากหน้า Settings UI จะได้เปลี่ยนทันที
        // (ข้อควรระวัง: หน้า Settings ที่เป็นคนส่ง Event นี้ จะต้องเป็นคนยิง API ไปเซฟลง Database ด้วย)
        const listener = (e) => {
            setBg(e.detail);
        };
        window.addEventListener("background-changed", listener);
        
        return () => window.removeEventListener("background-changed", listener);
    }, []);

    return (
        <div
            className="flex h-screen bg-center bg-cover text-white overflow-hidden transition-all duration-300"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="fixed top-0 left-0 h-full z-20">
                <Sidebar />
            </div>

            <main className="flex-1 ml-[250px] h-full overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}