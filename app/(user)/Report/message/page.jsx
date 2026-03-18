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
import { Info, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// 🟢 [BACKEND NOTE]: นำไฟล์ Local ออกแล้ว ไม่ต้อง import calenderData จากเครื่อง
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

const Card = ({ title, children }) => (
  <div className="border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-white relative z-10">
    <h2 className="text-lg font-semibold mb-4 flex items-center">{title}</h2>
    {children}
  </div>
);

const Table = ({ headers, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse text-gray-300 text-sm">
      <thead>
        <tr className="border-b border-gray-500 text-left">
          {headers.map((h, i) => (
            <th key={i} className="py-2 px-4 font-medium">{h}</th>
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
              No available data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block ml-2">
      <Info
        className="w-5 h-5 text-gray-300 cursor-pointer"
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

const SimplePagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  return (
    <div className="flex justify-end items-center mt-4 text-sm text-gray-400 gap-3">
      <span>
        {totalItems === 0
          ? "1–0 of 0"
          : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}
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

const formatDisplayDayMonth = (dateStr) => {
  const d = new Date(dateStr);
  const day = d.getDate();
  const monthShort = d.toLocaleString("en-US", { month: "short" });
  return `${day} ${monthShort.toLowerCase()}`;
};

const isoWithRandomTime = (dateStr, index = 0) => {
  const d = new Date(dateStr + "T00:00:00");
  const minutes = (index * 37) % (24 * 60);
  d.setMinutes(minutes);
  return d.toISOString();
};

// 🟢 [BACKEND NOTE]: Mock ข้อมูลจำลองสำหรับทดสอบ UI (ลบทิ้งได้เลยเมื่อมี API)
const mockCalenderData = [
  { date: "2025-10-26", opened: 10, closed: 5, sent: 20, delivered: 18, read: 15, failed: 2 },
  { date: "2025-10-27", opened: 15, closed: 8, sent: 25, delivered: 24, read: 20, failed: 1 },
  { date: "2025-10-28", opened: 8, closed: 12, sent: 30, delivered: 28, read: 25, failed: 2 },
  { date: "2025-10-29", opened: 20, closed: 15, sent: 40, delivered: 35, read: 30, failed: 5 },
];


// ==========================================================
// Main Component
// ==========================================================
export default function MessagesPage() {
  const defaultStart = "2025-10-26";
  const defaultEnd = "2025-10-29";

  const [range, setRange] = useState([
    { startDate: new Date(defaultStart), endDate: new Date(defaultEnd), key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const chartFontSize = "12px";

  const [incomingCurrentPage, setIncomingCurrentPage] = useState(1);
  const [outgoingCurrentPage, setOutgoingCurrentPage] = useState(1);
  const [failedCurrentPage, setFailedCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🟢 [BACKEND NOTE]: สร้าง States สำหรับรับข้อมูลจาก API (แทนการใช้ useMemo กับไฟล์ Local)
  const [filteredDays, setFilteredDays] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [incomingMessagesList, setIncomingMessagesList] = useState([]);
  const [outgoingMessagesList, setOutgoingMessagesList] = useState([]);
  const [failedMessagesList, setFailedMessagesList] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 [BACKEND NOTE]: useEffect ตัวนี้ทำหน้าที่ดึงข้อมูลเมื่อ Range (วันที่) มีการเปลี่ยนแปลง
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const startDateStr = range[0].startDate.toISOString();
        const endDateStr = range[0].endDate.toISOString();

        // 🟢 [API CALL]: โค้ดดึงข้อมูลจริง
        // const response = await fetch(`/api/reports/messages?start=${startDateStr}&end=${endDateStr}`);
        // const data = await response.json();
        // setFilteredDays(data.summaryData);
        // setChartData(data.chartData);
        // setIncomingMessagesList(data.incomingLogs);
        // setOutgoingMessagesList(data.outgoingLogs);
        // setFailedMessagesList(data.failedLogs);

        // =======================================================
        // [Mock Processing]: สร้างข้อมูลชั่วคราวเพื่อให้หน้าเว็บยังคงใช้งานได้ (ลบออกตอนต่อ API)
        const s = range[0].startDate;
        const e = new Date(range[0].endDate);
        e.setHours(23, 59, 59, 999);

        const currentFilteredDays = mockCalenderData.filter((d) => {
          const dd = new Date(d.date);
          return dd >= s && dd <= e;
        });

        setFilteredDays(currentFilteredDays);

        setChartData(currentFilteredDays.map((d) => ({
          date: formatDisplayDayMonth(d.date),
          isoDate: d.date,
          sent: d.sent,
          delivered: d.delivered,
          read: d.read,
          failed: d.failed,
          incoming: d.opened,
          outgoing: d.sent,
        })));

        const contacts = [
          { id: "C001", name: "Alice" }, { id: "C002", name: "Bob" },
          { id: "C003", name: "Charlie" }, { id: "C004", name: "David" },
        ];
        const channels = ["LINE", "Messenger"];
        const inc = [], out = [], fail = [];
        let globalIdx = 0;

        currentFilteredDays.forEach((d) => {
          const dateStr = d.date;
          for (let i = 0; i < Math.max(0, d.opened || 0); i++) {
            const c = contacts[(globalIdx + i) % contacts.length];
            inc.push({ timestamp: isoWithRandomTime(dateStr, globalIdx + i), contactId: c.id, contactName: c.name, channel: channels[(globalIdx + i) % channels.length], message: `Incoming sample #${globalIdx + i + 1}` });
          }
          globalIdx += Math.max(0, d.opened || 0);

          for (let i = 0; i < Math.max(0, d.sent || 0); i++) {
            const c = contacts[(globalIdx + i) % contacts.length];
            out.push({ timestamp: isoWithRandomTime(dateStr, globalIdx + i), contactId: c.id, contactName: c.name, channel: channels[(globalIdx + i) % channels.length], message: `Outgoing sample #${globalIdx + i + 1}` });
          }
          globalIdx += Math.max(0, d.sent || 0);

          for (let i = 0; i < Math.max(0, d.failed || 0); i++) {
            const c = contacts[(globalIdx + i) % contacts.length];
            fail.push({ timestamp: isoWithRandomTime(dateStr, globalIdx + i), contactId: c.id, contactName: c.name, channel: channels[(globalIdx + i) % channels.length], message: `Failed sample #${globalIdx + i + 1}` });
          }
          globalIdx += Math.max(0, d.failed || 0);
        });

        const sortDesc = (arr) => arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setIncomingMessagesList(sortDesc(inc));
        setOutgoingMessagesList(sortDesc(out));
        setFailedMessagesList(sortDesc(fail));

      } catch (error) {
        console.error("Error fetching message reports:", error);
      }
    };

    fetchReportData();
  }, [range]);


  const blockClass =
    "border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 pb-8 flex flex-col w-full";

  const formatDateText = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });


  return (
    <div className="p-6 space-y-8 text-white bg-[rgba(32,41,59,0.25)] backdrop-blur-xl rounded-3xl">
      {/* Calendar */}
      <div className="relative mb-6" ref={calendarRef}>
        <Button
          onClick={() => setShowCalendar((s) => !s)}
          className="flex items-center gap-2  text-white"
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
        rangeColors={["#8B5CF6"]} // 
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

      {/* Outgoing Messages Summary + Chart */}
      <Card title="Outgoing Messages Delivery (Linear)">
        <div className="flex flex-col mb-6">
          <div className="flex justify-start space-x-12">
            {["Sent", "Delivered", "Read", "Failed"].map((name) => (
              <div key={name} className="flex flex-col">
                <span className="text-lg font-semibold mb-1">{name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-semibold text-white">
                    {{
                      Sent: filteredDays.reduce((s, d) => s + (d.sent || 0), 0),
                      Delivered: filteredDays.reduce((s, d) => s + (d.delivered || 0), 0),
                      Read: filteredDays.reduce((s, d) => s + (d.read || 0), 0),
                      Failed: filteredDays.reduce((s, d) => s + (d.failed || 0), 0),
                    }[name]}
                  </span>
                  <span className="text-sm text-gray-400">
                    (
                    {(() => {
                      const total = filteredDays.reduce((s, d) => s + (d.sent || 0), 0);
                      if (total === 0) return "0.00%";
                      const val = {
                        Sent: filteredDays.reduce((s, d) => s + (d.sent || 0), 0),
                        Delivered: filteredDays.reduce((s, d) => s + (d.delivered || 0), 0),
                        Read: filteredDays.reduce((s, d) => s + (d.read || 0), 0),
                        Failed: filteredDays.reduce((s, d) => s + (d.failed || 0), 0),
                      }[name];
                      return `${((val / Math.max(1, total)) * 100).toFixed(2)}%`;
                    })()}
                    )
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex mt-3 space-x-4 text-sm text-gray-300">
            {[{ name: "Sent", color: "bg-blue-400" },
              { name: "Delivered", color: "bg-green-400" },
              { name: "Read", color: "bg-orange-400" },
              { name: "Failed", color: "bg-red-500" }].map((item) => (
              <div key={item.name} className="flex items-center space-x-1">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="date" stroke="#ccc" style={{ fontSize: chartFontSize }} />
                <YAxis stroke="#ccc" style={{ fontSize: chartFontSize }} />
                <Tooltip labelStyle={{ fontSize: chartFontSize }} itemStyle={{ fontSize: chartFontSize }} />
                <Line type="monotone" dataKey="sent" stroke="#60a5fa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="delivered" stroke="#4ade80" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="read" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Incoming / Outgoing Charts */}
      <div className={blockClass}>
        <h2 className="text-lg font-semibold flex items-center mb-4">
          Incoming Messages <InfoTooltip text="จำนวนข้อความเข้า (ใช้ opened จาก calenderData)" />
        </h2>
        <div className="mt-4 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#ccc" style={{ fontSize: chartFontSize }} />
              <YAxis stroke="#ccc" style={{ fontSize: chartFontSize }} />
              <Tooltip labelStyle={{ fontSize: chartFontSize }} itemStyle={{ fontSize: chartFontSize }} />
              <Line type="monotone" dataKey="incoming" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={blockClass}>
        <h2 className="text-lg font-semibold flex items-center mb-4">
          Outgoing Messages <InfoTooltip text="จำนวนข้อความส่งออก (ใช้ sent จาก calenderData)" />
        </h2>
        <div className="mt-4 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#ccc" style={{ fontSize: chartFontSize }} />
              <YAxis stroke="#ccc" style={{ fontSize: chartFontSize }} />
              <Tooltip labelStyle={{ fontSize: chartFontSize }} itemStyle={{ fontSize: chartFontSize }} />
              <Line type="monotone" dataKey="outgoing" stroke="#4ade80" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Message Lists */}
      <Card title="Incoming Message List">
        <Table
          headers={["Timestamp", "Contact ID", "Contact Name", "Channel", "Message"]}
          data={incomingMessagesList.slice((incomingCurrentPage - 1) * itemsPerPage, incomingCurrentPage * itemsPerPage)}
        />
        <SimplePagination
          totalItems={incomingMessagesList.length}
          itemsPerPage={itemsPerPage}
          currentPage={incomingCurrentPage}
          setCurrentPage={setIncomingCurrentPage}
        />
      </Card>

      <Card title="Outgoing Message List">
        <Table
          headers={["Timestamp", "Contact ID", "Contact Name", "Channel", "Message"]}
          data={outgoingMessagesList.slice((outgoingCurrentPage - 1) * itemsPerPage, outgoingCurrentPage * itemsPerPage)}
        />
        <SimplePagination
          totalItems={outgoingMessagesList.length}
          itemsPerPage={itemsPerPage}
          currentPage={outgoingCurrentPage}
          setCurrentPage={setOutgoingCurrentPage}
        />
      </Card>

      <Card title="Failed Message List">
        <Table
          headers={["Timestamp", "Contact ID", "Contact Name", "Channel", "Message"]}
          data={failedMessagesList.slice((failedCurrentPage - 1) * itemsPerPage, failedCurrentPage * itemsPerPage)}
        />
        <SimplePagination
          totalItems={failedMessagesList.length}
          itemsPerPage={itemsPerPage}
          currentPage={failedCurrentPage}
          setCurrentPage={setFailedCurrentPage}
        />
      </Card>
    </div>
  );
}