"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

// 🟢 [BACKEND NOTE]: เปลี่ยนข้อมูลตรงนี้ให้เป็นเพียงค่า Default รอระหว่าง API โหลด
const initialMockData = [
  { time: '00:00', opened: 0, closed: 0 },
  { time: '03:00', opened: 0, closed: 0 },
  { time: '06:00', opened: 2, closed: 0 },
  { time: '09:00', opened: 4, closed: 0 },
  { time: '12:00', opened: 2, closed: 2 },
  { time: '15:00', opened: 3, closed: 5 },
  { time: '18:00', opened: 0, closed: 2 },
  { time: '21:00', opened: 0, closed: 2 },
  { time: '24:00', opened: 0, closed: 0 },
];

export default function DashboardConversation() {
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Today');

  // 🟢 [BACKEND NOTE]: สร้าง State สำหรับรับข้อมูลกราฟจาก API
  const [currentData, setCurrentData] = useState(initialMockData);
  const [isLoading, setIsLoading] = useState(false);

  const options = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

  // 🟢 [BACKEND NOTE]: useEffect สำหรับยิง API เมื่อเปลี่ยน Option
  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        // 🟢 [API CALL]: ส่ง selectedOption ไปให้ Backend ประมวลผล
        // ตัวอย่างเช่น: /api/dashboard/conversations?period=Today
        // const response = await fetch(`/api/dashboard/conversations?period=${selectedOption}`);
        // const data = await response.json();
        // setCurrentData(data);

        // ===============================================
        // [Mock Processing]: จำลองข้อมูลเพื่อไม่ให้หน้าเว็บพังตอนรอต่อ Backend
        const allChartDataMock = {
          'Today': [
            { time: '00:00', opened: 0, closed: 0 }, { time: '03:00', opened: 0, closed: 0 }, { time: '06:00', opened: 2, closed: 0 },
            { time: '09:00', opened: 4, closed: 0 }, { time: '12:00', opened: 2, closed: 2 }, { time: '15:00', opened: 3, closed: 5 },
            { time: '18:00', opened: 0, closed: 2 }, { time: '21:00', opened: 0, closed: 2 }, { time: '24:00', opened: 0, closed: 0 },
          ],
          'Yesterday': [
            { time: '00:00', opened: 0, closed: 0 }, { time: '03:00', opened: 2, closed: 0 }, { time: '06:00', opened: 6, closed: 0 },
            { time: '09:00', opened: 0, closed: 1 }, { time: '12:00', opened: 2, closed: 1 }, { time: '15:00', opened: 5, closed: 3 },
            { time: '18:00', opened: 0, closed: 4 }, { time: '21:00', opened: 0, closed: 7 }, { time: '24:00', opened: 0, closed: 0 },
          ],
          'Last 7 Days': [
            { time: 'Mon', opened: 7, closed: 0 }, { time: 'Tue', opened: 8, closed: 1 }, { time: 'Wed', opened: 6, closed: 15 },
            { time: 'Thu', opened: 7, closed: 5 }, { time: 'Fri', opened: 4, closed: 9 }, { time: 'Sat', opened: 7, closed: 5 },
            { time: 'Sun', opened: 3, closed: 7 },
          ],
          'Last 30 Days': [
            { time: 'Week 1', opened: 48, closed: 26 }, { time: 'Week 2', opened: 82, closed: 54 },
            { time: 'Week 3', opened: 77, closed: 57 }, { time: 'Week 4', opened: 43, closed: 113 },
          ]
        };

        setCurrentData(allChartDataMock[selectedOption] || allChartDataMock['Today']);
        // ===============================================

      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [selectedOption]);


  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const { totals, yAxisConfig } = useMemo(() => {
    let maxDataValue = 0;
    const totals = currentData.reduce(
        (acc, curr) => {
            const currentMax = Math.max(curr.opened, curr.closed, 0);
            maxDataValue = Math.max(maxDataValue, currentMax);

            return {
                opened: acc.opened + curr.opened,
                closed: acc.closed + curr.closed,
            };
        },
        { opened: 0, closed: 0 }
    );

    let domainMax = 10;
    let step = 2;

    if (maxDataValue > 30) {
        domainMax = Math.ceil(maxDataValue / 50) * 50; 
        step = domainMax / 5; 
    } else if (maxDataValue > 10) {
        domainMax = Math.ceil(maxDataValue / 5) * 5; 
        step = 5;
    } 
    
    const generatedTicks = [];
    for (let i = 0; i <= domainMax; i += step) {
        generatedTicks.push(i);
    }
    
    return {
        totals: totals,
        yAxisConfig: {
            domain: [0, domainMax],
            ticks: generatedTicks.length > 0 ? generatedTicks : [0, 10],
        }
    };
  }, [currentData]);
  
  
  // ==========================================================
  // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ 100%
  // ==========================================================
  return (
    <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-4 flex flex-col min-h-[400px]">
      
      <div className="flex justify-between items-center shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-white/90 text-sm">Conversations Overview</h2>
      </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center w-36 bg-black/20 hover:bg-black/30 backdrop-blur-sm border border-white/20 px-3.5 py-2 rounded-xl text-sm text-white/90 transition-all duration-200"
            >
            <span>{selectedOption}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={`text-white/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-[#2a3042] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedOption === option ? 'bg-blue-500/20 text-blue-400' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      
      </div>

      {/* --- Stats --- */}
      <div className="flex gap-8 mt-4 shrink-0">
        <div>
          <p className="text-sm text-white/80">Opened</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-white">{totals.opened}</p>
            <span className="text-xs text-white/60">0.00%</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-white/80">Closed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-white">{totals.closed}</p>
            <span className="text-xs text-white/60">0.00%</span>
          </div>
        </div>
      </div>

      
      <div className="flex gap-4 mt-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span className="text-xs text-white/60">Opened</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-xs text-white/60">Closed</span>
        </div>
      </div>

      {/* --- Graph --- */}
      <div className="grow mt-4 min-h-[200px] relative z-0">
        <ResponsiveContainer width="100%" minHeight={250}>
          <LineChart
            data={currentData} 
            margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(255, 255, 255, 0.2)" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }} 
              axisLine={false} tickLine={false} 
              padding={{ left: 30, right: 30 }} 
              tickMargin={10}
            />
            <YAxis 
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }} 
              axisLine={false} tickLine={false} 
              domain={yAxisConfig.domain} 
              ticks={yAxisConfig.ticks} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(32,41,59,0.8)', 
                borderColor: 'rgba(255,255,255,0.3)', 
                borderRadius: '8px', 
                backdropFilter: 'blur(4px)' 
              }} 
              itemStyle={{ color: '#fff' }} 
              labelStyle={{ color: '#fff', fontWeight: 'bold' }} 
            />
            <Line type="monotone" dataKey="opened" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="closed" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}