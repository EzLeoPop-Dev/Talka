"use client";
import React, { useState, useEffect } from 'react';

export default function DashboardStats() {
    const [stats, setStats] = useState({
        newCustomers: 0,
        unreplied: 0,
        incomingMessages: 0,
        closedChatPercent: "0.00"
    });
    const [isLoading, setIsLoading] = useState(true);

    // 🟢 [BACKEND NOTE]: เปลี่ยนมาดึงข้อมูลจาก API แทน LocalStorage
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setIsLoading(true);

                // 🟢 [API CALL]: วิธีที่ดีที่สุดคือให้ Backend คำนวณสถิติมาให้เลย แล้วตอบกลับมาเป็น JSON
                // const response = await fetch('/api/dashboard/stats');
                // const data = await response.json();
                // setStats(data);

                // ===============================================
                // [Mock Processing] จำลองการทำงานฝั่ง Frontend แบบเดิมไปก่อน ระหว่างรอ API
                const mockChats = [
                    { status: 'New Chat', messages: [{ from: 'customer' }] },
                    { status: 'Closed', messages: [{ from: 'me' }, { from: 'customer' }] },
                    { status: 'Open', messages: [{ from: 'customer' }] } 
                ];

                // New Customers
                const newCustCount = mockChats.filter(c => c.status === 'New Chat').length;

                // Unreplied
                const unrepliedCount = mockChats.filter(c => {
                    return !c.messages || !c.messages.some(msg => msg.from === 'me');
                }).length;

                // Incoming Message
                const incomingCount = mockChats.reduce((total, c) => {
                    const customerMsgs = c.messages ? c.messages.filter(msg => msg.from !== 'me').length : 0;
                    return total + customerMsgs;
                }, 0);

                // Close Chat %
                const closedCount = mockChats.filter(c => c.status === 'Closed').length;
                const totalChats = mockChats.length;
                const closedPercent = totalChats > 0 ? ((closedCount / totalChats) * 100).toFixed(2) : "0.00";

                // อัปเดต State (ใช้ setTimeout จำลองเวลาโหลด)
                setTimeout(() => {
                    setStats({
                        newCustomers: newCustCount,
                        unreplied: unrepliedCount,
                        incomingMessages: incomingCount,
                        closedChatPercent: closedPercent
                    });
                    setIsLoading(false);
                }, 300);
                // ===============================================

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    // ==========================================================
    // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ 100%
    // (เพิ่มแค่ isLoading เช็คให้แสดง ... ตอนกำลังดึงข้อมูล)
    // ==========================================================
    return (
        <div className="w-full"> 
        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-1">
              
                <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-3 "> 
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">New Customers</span>
                        <a href="#" className="text-xs text-white/60 hover:text-white">More</a> 
                    </div>
                    <p className="text-3xl font-bold text-white mt-1">
                        {isLoading ? "..." : stats.newCustomers}
                    </p> 
                </div>

                <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-3 "> 
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">Unreplied</span>
                        <a href="#" className="text-xs text-white/60 hover:text-white">More</a>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1"> 
                        <p className="text-3xl font-bold text-white">
                            {isLoading ? "..." : stats.unreplied}
                        </p>
                        <span className="text-sm text-white/80">Conversations</span>
                    </div>
                </div>

                <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-3 "> 
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">Incoming Message</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1"> 
                        <p className="text-3xl font-bold text-white">
                            {isLoading ? "..." : stats.incomingMessages}
                        </p>
                        <span className="text-sm text-white/80">Total msgs</span>
                    </div>
                </div>

                <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-3 "> 
                    <span className="text-sm text-white/80">Close Chat</span>
                    <p className="text-3xl font-bold text-white mt-1">
                        {isLoading ? "..." : `${stats.closedChatPercent}%`}
                    </p> 
                </div>

            </div>
        </div>
    );
}