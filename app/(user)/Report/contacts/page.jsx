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

// 🟢 [BACKEND NOTE]: ลบไฟล์ mock นี้ออกเมื่อต่อ API
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

// Pagination Component
const PaginationControls = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
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

export default function ContactsReport() {
  const defaultStart = calenderData?.[calenderData.length - 5]?.date || "2025-10-26";
  const defaultEnd = calenderData?.[calenderData.length - 1]?.date || "2025-11-02";

  const [range, setRange] = useState([
    { startDate: new Date(defaultStart), endDate: new Date(defaultEnd), key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // 🟢 [BACKEND NOTE]: สร้าง State สำหรับเก็บข้อมูลที่ได้จาก API
  const [chartData, setChartData] = useState([]);
  const [addedLogs, setAddedLogs] = useState([]);
  const [deletedLogs, setDeletedLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [addedCurrentPage, setAddedCurrentPage] = useState(1);
  const [deletedCurrentPage, setDeletedCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🟢 [BACKEND NOTE]: useEffect นี้จะยิง API ทุกครั้งที่ผู้ใช้เปลี่ยนวันที่
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const startDate = range[0].startDate.toISOString();
        const endDate = range[0].endDate.toISOString();

        // 🟢 โค้ดตัวอย่างการเรียก API จริง:
        // const response = await fetch(`/api/reports/contacts?start=${startDate}&end=${endDate}`);
        // const data = await response.json();
        // setChartData(data.charts);
        // setAddedLogs(data.addedLogs);
        // setDeletedLogs(data.deletedLogs);

        // [Mock Processing] กรองข้อมูลจำลองระหว่างรอ Backend
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
            totalContacts: d.opened + d.closed,
            displayDate: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            }));
        setChartData(filteredMock);
        
        // จำลอง Log ว่างๆ
        setAddedLogs([]);
        setDeletedLogs([]);

      } catch (error) {
        console.error("Error fetching report data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [range]); // ทำงานใหม่เมื่อ range เปลี่ยน

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chartFontSize = "12px";

  // คำนวณสรุปผลจาก Data
  const totalAdded = chartData.reduce((sum, d) => sum + d.opened, 0);
  const totalDeleted = chartData.reduce((sum, d) => sum + d.closed, 0);
  const totalContacts = totalAdded + totalDeleted;

  const addedPercent = totalContacts > 0 ? ((totalAdded / totalContacts) * 100).toFixed(2) : "0.00";
  const deletedPercent = totalContacts > 0 ? ((totalDeleted / totalContacts) * 100).toFixed(2) : "0.00";

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
        <Button
          onClick={() => setShowCalendar((s) => !s)}
          className="flex items-center gap-2 text-white"
        >
          <Calendar size={16} /> {formatDateText(range[0].startDate)} - {formatDateText(range[0].endDate)}
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

      {/* Contacts Overview */}
      <div className={`${blockClass} w-full`}>
        <h2 className="text-lg font-semibold flex items-center mb-4">
          Contacts Overview <InfoTooltip text="จำนวนผู้ติดต่อทั้งหมดในช่วงเวลาที่เลือก" />
        </h2>

        <div className="flex justify-start space-x-12 mb-6">
          <div>
            <span className="text-lg font-semibold mb-1 block">Contacts Added</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-white">{totalAdded}</span>
              <span className="text-sm text-gray-400">{addedPercent}%</span>
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold mb-1 block">Contacts Deleted</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-white">{totalDeleted}</span>
              <span className="text-sm text-gray-400">{deletedPercent}%</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="displayDate" stroke="#ccc" style={{ fontSize: chartFontSize }} />
            <YAxis stroke="#ccc" style={{ fontSize: chartFontSize }} />
            <Tooltip labelStyle={{ fontSize: chartFontSize }} itemStyle={{ fontSize: chartFontSize }} />
            <Line type="monotone" dataKey="totalContacts" stroke="#fbbf24" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="opened" stroke="#4ade80" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="closed" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Contacts Added Chart */}
      <div className={`${blockClass} w-full`}>
        <h2 className="text-lg font-semibold flex items-center mb-4">
          Contacts Added <InfoTooltip text="จำนวนผู้ติดต่อที่ถูกเพิ่มใหม่ในช่วงเวลาที่เลือก" />
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

      {/* Contacts Deleted Chart */}
      <div className={`${blockClass} w-full`}>
        <h2 className="text-lg font-semibold flex items-center mb-4">
          Contacts Deleted <InfoTooltip text="จำนวนผู้ติดต่อที่ถูกลบออกในช่วงเวลาที่เลือก" />
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

      {/* Contact Added Log */}
      <Card title="Contact Added Log">
        <Table headers={["Timestamp", "Contact ID", "Contact Name", "Channel"]}>
          {addedLogs.length > 0 ? (
            addedLogs.map((log, index) => (
                <tr key={index} className="border-b border-gray-500/30">
                    <td className="py-3 px-4">{log.timestamp}</td>
                    <td className="py-3 px-4">{log.contactId}</td>
                    <td className="py-3 px-4">{log.contactName}</td>
                    <td className="py-3 px-4">{log.channel}</td>
                </tr>
            ))
          ) : (
            <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                No Available Data
                </td>
            </tr>
          )}
        </Table>
        <PaginationControls
          totalItems={addedLogs.length}
          itemsPerPage={itemsPerPage}
          currentPage={addedCurrentPage}
          setCurrentPage={setAddedCurrentPage}
        />
      </Card>

      {/* Contact Deleted Log */}
      <Card title="Contact Deleted Log">
        <Table headers={["Timestamp", "Contact ID", "Contact Name", "Channel"]}>
          {deletedLogs.length > 0 ? (
             deletedLogs.map((log, index) => (
                <tr key={index} className="border-b border-gray-500/30">
                    <td className="py-3 px-4">{log.timestamp}</td>
                    <td className="py-3 px-4">{log.contactId}</td>
                    <td className="py-3 px-4">{log.contactName}</td>
                    <td className="py-3 px-4">{log.channel}</td>
                </tr>
            ))
          ) : (
            <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                No Available Data
                </td>
            </tr>
          )}
        </Table>
        <PaginationControls
          totalItems={deletedLogs.length}
          itemsPerPage={itemsPerPage}
          currentPage={deletedCurrentPage}
          setCurrentPage={setDeletedCurrentPage}
        />
      </Card>
    </div>
  );
}