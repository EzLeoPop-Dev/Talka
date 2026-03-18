"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Info, Calendar } from "lucide-react";
import "./Responses.css";

// 🟢 [BACKEND NOTE]: ลบ import ไฟล์ mock data นี้ออกเมื่อทำการต่อ API จริง
import { calenderData } from "../../../data/calenderData";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-md border border-[rgba(254,253,253,0.5)] text-white hover:bg-[rgba(255,255,255,0.1)] transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <Info
        className="w-5 h-5 text-gray-300 cursor-pointer ml-2"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="absolute top-0 left-full ml-2 w-64 bg-black/80 text-white text-xs p-2 rounded shadow-lg z-10">
          {text}
        </div>
      )}
    </div>
  );
};

const formatTime = (sec) => {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const formatDateText = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });



export default function ResponsesReport() {
  const defaultStart = "2025-10-26";
  const defaultEnd = "2025-11-02";

  const [range, setRange] = useState([
    { startDate: new Date(defaultStart), endDate: new Date(defaultEnd), key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // 🟢 [BACKEND NOTE]: สร้าง State รับข้อมูลที่มาจาก API 
  const [filteredData, setFilteredData] = useState([]);
  const [avgTime, setAvgTime] = useState(0);
  const [avgResponse, setAvgResponse] = useState(0);
  const [avgResponsePercent, setAvgResponsePercent] = useState(0);
  const [timeBreakdown, setTimeBreakdown] = useState([]);
  const [responseBreakdown, setResponseBreakdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 [BACKEND NOTE]: useEffect ตัวนี้ทำงานเมื่อ range เปลี่ยน เพื่อไปขอข้อมูลจาก Server
  useEffect(() => {
    const fetchResponseReport = async () => {
      setIsLoading(true);
      try {
        const s = new Date(range[0].startDate);
        const e = new Date(range[0].endDate);
        e.setHours(23, 59, 59, 999);

        // 🟢 โค้ดตัวอย่างการยิง API
        // const response = await fetch(`/api/reports/responses?start=${s.toISOString()}&end=${e.toISOString()}`);
        // const data = await response.json();
        // 
        // setFilteredData(data.chartData);
        // setAvgTime(data.averageTimeSeconds);
        // setAvgResponse(data.averageResponseCount);
        // setAvgResponsePercent(data.averageResponsePercent);
        // setTimeBreakdown(data.timeBreakdownTable);
        // setResponseBreakdown(data.responseBreakdownTable);

        // =========================================================
        // [Mock Processing]: ประมวลผลข้อมูลจำลองระหว่างรอ Backend (ลบออกเมื่อเชื่อม API)
        const mockFiltered = calenderData
          .filter((d) => {
            const dd = new Date(d.date);
            return dd >= s && dd <= e;
          })
          .map((d) => ({
            date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            avgTime: d.avgTime,
            avgResponse: d.avgResponse,
          }));

        setFilteredData(mockFiltered);

        const len = mockFiltered.length || 1;
        const calculatedAvgTime = mockFiltered.reduce((sum, item) => sum + item.avgTime, 0) / len;
        const calculatedAvgRes = mockFiltered.reduce((sum, item) => sum + item.avgResponse, 0) / len;
        
        setAvgTime(calculatedAvgTime);
        setAvgResponse(calculatedAvgRes);

        const maxResponse = Math.max(...mockFiltered.map((item) => item.avgResponse), 1);
        setAvgResponsePercent((calculatedAvgRes / maxResponse) * 100);

        // จำลองข้อมูลตาราง breakdown
        const mockTable = [
          { label: "< 30s", value: `${Math.round(Math.random() * 10)}%` },
          { label: "30s - 2m", value: `${Math.round(Math.random() * 10)}%` },
          { label: "2m - 5m", value: `${Math.round(Math.random() * 10)}%` },
          { label: "5m - 10m", value: `${Math.round(Math.random() * 10)}%` },
          { label: "10m - 30m", value: `${Math.round(Math.random() * 10)}%` },
          { label: "30m - 1h", value: `${Math.round(Math.random() * 10)}%` },
          { label: "> 1h", value: `${Math.round(Math.random() * 10)}%` },
        ];
        setTimeBreakdown(mockTable);
        setResponseBreakdown(mockTable); 

      } catch (error) {
        console.error("Error fetching responses report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponseReport();
  }, [range]);


  const safeData = filteredData.length > 0 ? filteredData : [{ date: "", avgTime: 0, avgResponse: 0 }];

  const infoText = {
    avgTime: "เวลาตอบกลับเฉลี่ยของทุกการสนทนาในช่วงเวลาที่เลือก",
    avgResponse: "จำนวนข้อความตอบกลับเฉลี่ยของทีมในช่วงเวลาที่เลือก",
    avgTimeBreakdown: "การแบ่งช่วงเวลาตอบกลับเฉลี่ยของแต่ละแชท",
    responseBreakdown: "การแบ่งช่วงจำนวนข้อความตอบกลับของแต่ละแชท",
  };

  const blockClass =
    " border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-6 flex flex-col h-full";

  const tableClass = "w-full text-sm text-gray-300";
  const chartFontSize = "12px";

  return (
    <div className="bg-[rgba(32,41,59,0.25)] backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white space-y-8">
      {/* ปุ่มปฏิทิน */}
      <div className="relative mb-6" ref={calendarRef}>
        <Button
          onClick={() => setShowCalendar((s) => !s)}
          className="flex items-center gap-2 text-white"
        >
          <Calendar size={16} />
          {formatDateText(range[0].startDate)} - {formatDateText(range[0].endDate)}
        </Button>

        {showCalendar && (
          <div className="absolute top-10 z-20">
            <div className="transform scale-75 origin-top-left">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                rangeColors={["#8B5CF6"]}
              />
              <Button
                onClick={() => setShowCalendar(false)}
                className="mt-2 w-full flex justify-center items-center bg-purple-400 text-white"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* แถวบน */}
      <div className="grid grid-cols-3 gap-8 h-[50vh]">
        {/* Average Response Time chart */}
        <div className={`${blockClass} col-span-2 flex-1`}>
          <h2 className="text-lg font-semibold flex items-center mb-2">
            Average Response Time
            <InfoTooltip text={infoText.avgTime} />
          </h2>

          <div className="text-3xl font-bold mb-2">{formatTime(avgTime)}</div>

          <div className="flex items-center text-sm text-gray-300 mb-4">
            <span className="flex items-center mr-2">
              <span className="w-3 h-3 rounded-full bg-green-400 mr-1" />
              Selected Period
            </span>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="date" stroke="#ccc" style={{ fontSize: chartFontSize }} />
                <YAxis
                  stroke="#ccc"
                  style={{ fontSize: chartFontSize }}
                  tickFormatter={(value) => formatTime(value)}
                />
                <Tooltip
                  formatter={(value) => formatTime(value)}
                  labelStyle={{ fontSize: chartFontSize }}
                  itemStyle={{ fontSize: chartFontSize }}
                />
                <Line
                  type="monotone"
                  dataKey="avgTime"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown table */}
        <div className={`${blockClass} col-span-1 flex-1`}>
          <h2 className="text-lg font-semibold flex items-center mb-4">
            Average Response Time Breakdown
            <InfoTooltip text={infoText.avgTimeBreakdown} />
          </h2>

          <div className="flex-1 overflow-y-auto">
            <table className={tableClass}>
              <thead>
                <tr className="border-b border-gray-500/30">
                  <th className="text-left py-2 px-4">Average Response Time</th>
                  <th className="text-right py-2 px-4">% Conversation</th>
                </tr>
              </thead>
              <tbody>
                {timeBreakdown.map((item, i) => (
                  <tr key={i} className="border-b border-gray-500/20">
                    <td className="py-2 px-4">{item.label}</td>
                    <td className="text-right py-2 px-4">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* แถวล่าง */}
      <div className="grid grid-cols-3 gap-8 h-[50vh]">
        {/* Average Response chart */}
        <div className={`${blockClass} col-span-2 flex-1`}>
          <h2 className="text-lg font-semibold flex items-center mb-2">
            Average Response
            <InfoTooltip text={infoText.avgResponse} />
          </h2>

          <div className="text-3xl font-bold mb-2">{avgResponsePercent.toFixed(1)}%</div>

          <div className="flex items-center text-sm text-gray-300 mb-4">
            <span className="flex items-center mr-2">
              <span className="w-3 h-3 rounded-full bg-blue-400 mr-1" />
              Selected Period
            </span>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="date" stroke="#ccc" style={{ fontSize: chartFontSize }} />
                <YAxis stroke="#ccc" style={{ fontSize: chartFontSize }} />
                <Tooltip
                  labelStyle={{ fontSize: chartFontSize }}
                  itemStyle={{ fontSize: chartFontSize }}
                />
                <Line
                  type="monotone"
                  dataKey="avgResponse"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Breakdown */}
        <div className={`${blockClass} col-span-1 flex-1`}>
          <h2 className="text-lg font-semibold flex items-center mb-4">
            Responses Breakdown
            <InfoTooltip text={infoText.responseBreakdown} />
          </h2>

          <div className="flex-1 overflow-y-auto">
            <table className={tableClass}>
              <thead>
                <tr className="border-b border-gray-500/30">
                  <th className="text-left py-2 px-4">Responses</th>
                  <th className="text-right py-2 px-4">% Conversation</th>
                </tr>
              </thead>
              <tbody>
                {responseBreakdown.map((item, i) => (
                  <tr key={i} className="border-b border-gray-500/20">
                    <td className="py-2 px-4">{item.label}</td>
                    <td className="text-right py-2 px-4">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}