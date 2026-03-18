"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// UI Helpers 
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-md border border-[rgba(254,253,253,0.5)] text-white hover:bg-[rgba(255,255,255,0.1)] transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ title, children }) => (
  <div className="border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-white relative z-10">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Table = ({ headers, data }) => (
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
      <tbody>
        {data.length > 0 ? (
          data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-500/20">
              {Object.values(row).map((cell, cIdx) => (
                <td key={cIdx} className="py-2 px-4">{cell}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} className="text-center py-6 text-gray-400">
              No Available Data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const PaginationControls = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  return (
    <div className="flex justify-end items-center mt-4 text-sm text-gray-400 gap-3">
      <span>
        {totalItems === 0
          ? "1–0 of 0"
          : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}
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

// Main Component
export default function UsersPage() {
  const defaultStart = "2025-10-27";
  const defaultEnd = "2025-10-31";

  const [range, setRange] = useState([
    { startDate: new Date(defaultStart), endDate: new Date(defaultEnd), key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // 🟢 [BACKEND NOTE]: State สำหรับรับข้อมูลจาก API
  const [userPerformanceData, setUserPerformanceData] = useState([]);
  const [commentLogData, setCommentLogData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userItemsPerPage] = useState(5);

  const [commentCurrentPage, setCommentCurrentPage] = useState(1);
  const [commentItemsPerPage] = useState(5);

  const totalUserItems = userPerformanceData.length; 
  const totalCommentItems = commentLogData.length; 

  // 🟢 [BACKEND NOTE]: ฟังก์ชันนี้จะไปดึงข้อมูลใหม่ทุกครั้งที่เลือกวันที่ใน Calendar (range เปลี่ยน)
  useEffect(() => {
    const fetchUsersReport = async () => {
      setIsLoading(true);
      try {
        const startStr = range[0].startDate.toISOString();
        const endStr = range[0].endDate.toISOString();

        // 🟢 โค้ดตัวอย่างการเรียก API ดึงข้อมูล
        // const response = await fetch(`/api/reports/users?start=${startStr}&end=${endStr}`);
        // const data = await response.json();
        // setUserPerformanceData(data.performance);
        // setCommentLogData(data.comments);

        // จำลองข้อมูลเปล่า (เมื่อใช้ API ลบ 2 บรรทัดนี้ทิ้งได้เลย)
        setUserPerformanceData([]);
        setCommentLogData([]);

      } catch (error) {
        console.error("Failed to fetch user report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersReport();
  }, [range]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateText = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });


  // ==========================================================
  // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ 100%
  // ==========================================================
  return (
    <div className="p-6 space-y-8 bg-[rgba(32,41,59,0.25)] backdrop-blur-xl rounded-3xl text-white">
      {/* Calendar Button */}
      <div className="relative mb-6" ref={calendarRef}>
        <Button
          onClick={() => setShowCalendar((s) => !s)}
          className="flex items-center gap-2"
        >
          <Calendar size={16} />
          {formatDateText(range[0].startDate)} - {formatDateText(range[0].endDate)}
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

      {/* User Performance */}
      <Card title="User Performance">
        <Table
          headers={["User", "Team", "Conversations Assigned", "Conversations Closed", "Messages Sent", "Comments"]}
          data={userPerformanceData.slice((userCurrentPage - 1) * userItemsPerPage, userCurrentPage * userItemsPerPage)}
        />
        <PaginationControls
          totalItems={totalUserItems}
          itemsPerPage={userItemsPerPage}
          currentPage={userCurrentPage}
          setCurrentPage={setUserCurrentPage}
        />
      </Card>

      {/* Comment Log */}
      <Card title="Comment Log">
        <Table
          headers={["Timestamp", "Commented By", "Contact ID", "Contact Name", "Comment"]}
          data={commentLogData.slice((commentCurrentPage - 1) * commentItemsPerPage, commentCurrentPage * commentItemsPerPage)}
        />
        <PaginationControls
          totalItems={totalCommentItems}
          itemsPerPage={commentItemsPerPage}
          currentPage={commentCurrentPage}
          setCurrentPage={setCommentCurrentPage}
        />
      </Card>
    </div>
  );
}