"use client"

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
import { Info, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// 🟢 [BACKEND NOTE]: เมื่อเชื่อมต่อ API แล้ว ให้ลบการนำเข้า Mock Data นี้ออก
import { calenderData } from "../../../data/calenderData";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// ปุ่ม Custom
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-md border border-[rgba(254,253,253,0.5)] text-white hover:bg-[rgba(255,255,255,0.1)] transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Card 
const Card = ({ title, children }) => (
  <div className="border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-white relative z-10">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

// Table 
const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse text-gray-300 text-sm">
      <thead>
        <tr className="border-b border-gray-500/30 text-left">
          {headers.map((h, i) => (
            <th key={i} className="py-2 px-4 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

// Pagination
const PaginationControls = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  return (
    <div className="flex justify-end items-center mt-4 text-sm text-gray-400 gap-3">
      <span>
        {totalItems === 0
          ? "1–0 of 0"
          : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
              currentPage * itemsPerPage,
              totalItems
            )} of ${totalItems}`}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-40 transition"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-40 transition"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

// Tooltip Info
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

export default function ConversationsReport() {
  const defaultStart = calenderData?.[calenderData.length - 5]?.date || "2025-10-26";
  const defaultEnd = calenderData?.[calenderData.length - 1]?.date || "2025-11-02";

  const [range, setRange] = useState([
    { startDate: new Date(defaultStart), endDate: new Date(defaultEnd), key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // 🟢 [BACKEND NOTE]: State สำหรับเก็บข้อมูล API 
  const [chartData, setChartData] = useState([]);
  const [conversationLogs, setConversationLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination State
  const [convItemsPerPage] = useState(5);
  const [convCurrentPage, setConvCurrentPage] = useState(1);


  // 🟢 [BACKEND NOTE]: useEffect นี้รับหน้าที่ยิง API ดึงข้อมูลรายงานเมื่อเปลี่ยนวันที่
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const startDate = range[0].startDate.toISOString();
        const endDate = range[0].endDate.toISOString();

        // 🟢 โค้ดตัวอย่างการเรียก API 
        // const response = await fetch(`/api/reports/conversations?start=${startDate}&end=${endDate}`);
        // const data = await response.json();
        // setChartData(data.charts);
        // setConversationLogs(data.logs);

        // [Mock Processing]: กรองข้อมูลจำลอง ระหว่างรอ API
        const filteredMock = calenderData
            .filter((d) => {
            const dDate = new Date(d.date);
            const s = range[0].startDate;
            const e = range[0].endDate;
            e.setHours(23, 59, 59, 999);
            return dDate >= s && dDate <= e;
            })
            .map((d) => ({
            ...d,
            total: d.opened + d.closed,
            displayDate: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            }));
        setChartData(filteredMock);
        
        // จำลอง Log เป็นอาร์เรย์ว่าง
        setConversationLogs([]);

      } catch (error) {
        console.error("Error fetching report data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [range]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chartFontSize = "12px";

  // คำนวณสรุปผลจาก Data 
  const totalOpened = chartData.reduce((sum, d) => sum + d.opened, 0);
  const totalClosed = chartData.reduce((sum, d) => sum + d.closed, 0);
  const totalConversations = totalOpened + totalClosed;

  const openedPercent = totalConversations > 0 ? ((totalOpened / totalConversations) * 100).toFixed(2) : "0.00";
  const closedPercent = totalConversations > 0 ? ((totalClosed / totalConversations) * 100).toFixed(2) : "0.00";

  const blockClass =
    "border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 pb-8 flex flex-col h-full";

  const formatDateText = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-[rgba(32,41,59,0.25)] backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white space-y-8">
      {/* Calendar */}
      <div className="relative mb-6" ref={calendarRef}>
        <Button onClick={() => setShowCalendar((s) => !s)} className="flex items-center gap-2 text-white">
          <Calendar size={16} /> {formatDateText(range[0].startDate)} - {formatDateText(range[0].endDate)}
        </Button>

        {showCalendar && (
          <div className="absolute top-10 z-20">
            <div className="transform scale-75 origin-top-left">
              <DateRange
                editableDateInputs
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

      {/* Overview */}
      <div className={`${blockClass}`}>
        <h2 className="text-lg font-semibold flex items-center mb-4">
          Conversations Overview <InfoTooltip text="จำนวนการสนทนาทั้งหมดในช่วงเวลาที่เลือก" />
        </h2>
        <div className="flex flex-col mb-6">
          <div className="flex justify-start space-x-12">
            <div className="flex flex-col">
              <span className="text-lg font-semibold mb-1">Opened</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold text-white">{totalOpened}</span>
                <span className="text-sm text-gray-400">{openedPercent}%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold mb-1">Closed</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold text-white">{totalClosed}</span>
                <span className="text-sm text-gray-400">{closedPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="displayDate" stroke="#ccc" style={{ fontSize: chartFontSize }} />
            <YAxis stroke="#ccc" style={{ fontSize: chartFontSize }} />
            <Tooltip labelStyle={{ fontSize: chartFontSize }} itemStyle={{ fontSize: chartFontSize }} />
            <Line type="monotone" dataKey="opened" stroke="#4ade80" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="closed" stroke="#60a5fa" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="total" stroke="#fbbf24" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Conversations Opened */}
      <div className={`${blockClass}`}>
        <h2 className="text-lg font-semibold flex items-center mb-4">
          Conversations Opened <InfoTooltip text="จำนวนแชทที่ถูกเปิดขึ้นมาใหม่ในช่วงเวลาที่เลือก" />
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="displayDate" stroke="#ccc" style={{ fontSize: chartFontSize }} />
            <YAxis stroke="#ccc" style={{ fontSize: chartFontSize }} />
            <Tooltip labelStyle={{ fontSize: chartFontSize }} itemStyle={{ fontSize: chartFontSize }} />
            <Line type="monotone" dataKey="opened" stroke="#4ade80" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Conversations Closed */}
      <div className={`${blockClass}`}>
        <h2 className="text-lg font-semibold flex items-center mb-4">
          Conversations Closed <InfoTooltip text="จำนวนแชทที่ถูกปิดหรือจบการสนทนาในช่วงเวลาที่เลือก" />
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="displayDate" stroke="#ccc" style={{ fontSize: chartFontSize }} />
            <YAxis stroke="#ccc" style={{ fontSize: chartFontSize }} />
            <Tooltip labelStyle={{ fontSize: chartFontSize }} itemStyle={{ fontSize: chartFontSize }} />
            <Line type="monotone" dataKey="closed" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Conversations List */}
      <Card title="Conversations List">
        <Table
          headers={[
            "Closed Timestamp",
            "Opened Timestamp",
            "Conversation ID",
            "Contact ID",
            "Contact Name",
          ]}
        >
            {conversationLogs.length > 0 ? (
                conversationLogs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-500/30">
                        <td className="py-3 px-4">{log.closedTimestamp}</td>
                        <td className="py-3 px-4">{log.openedTimestamp}</td>
                        <td className="py-3 px-4">{log.conversationId}</td>
                        <td className="py-3 px-4">{log.contactId}</td>
                        <td className="py-3 px-4">{log.contactName}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                        No Available Data
                    </td>
                </tr>
            )}
        </Table>

        <PaginationControls
          totalItems={conversationLogs.length}
          itemsPerPage={convItemsPerPage}
          currentPage={convCurrentPage}
          setCurrentPage={setConvCurrentPage}
        />
      </Card>
    </div>
  );
}