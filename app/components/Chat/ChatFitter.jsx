"use client"
import { useState, useEffect, useRef } from "react";

export default function ChatFitter({ onFilterChange, availableCompanies = [], onCompanyChange, onSearchChange }) {
    const [selected, setSelected] = useState("radio1");
    
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const dropdownRef = useRef(null);

    const handleRadioChange = (id, value) => {
        setSelected(id);
        if (onFilterChange) {
            onFilterChange(value);
        }
    };

    const handleCompanySelect = (comp) => {
        setSelectedCompany(comp);
        setIsCompanyOpen(false);
        if (onCompanyChange) onCompanyChange(comp);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCompanyOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="menubar flex flex-col md:flex-row bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] rounded-3xl shadow-2xl p-4 md:p-5 gap-4 md:gap-7 items-center">

                {/* Search Bar */}
                <div className="search flex items-center text-white bg-[rgba(32,41,59,0.25)] rounded-2xl py-2 px-4 w-full md:w-auto shrink-0">
                    <i className="fa-solid fa-magnifying-glass mr-3"></i>
                    <input
                        type="text"
                        className="text-white outline-0 bg-transparent w-full min-w-[150px]"
                        placeholder="Search"
                        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-5 text-white overflow-x-auto md:overflow-visible flex-1 scrollbar-hide">
                    {[
                        { id: "radio1", label: "All Chat", value: "All" },
                        { id: "radio2", label: "New Chat", value: "New Chat" },
                        { id: "radio3", label: "Open", value: "Open" }, 
                        { id: "radio4", label: "Closed", value: "Closed" },
                        { id: "radio5", label: "Pending", value: "Pending" },
                    ].map((item) => (
                        <div key={item.id} className="flex items-center shrink-0">
                            <input
                                type="radio"
                                name="chatFilter"
                                checked={selected === item.id}
                                onChange={() => handleRadioChange(item.id, item.value)}
                                className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:bg-[rgb(185,40,243)] checked:border-[rgb(185,40,243)] cursor-pointer"
                            />
                            <label className="ms-2 text-sm font-medium text-gray-300 whitespace-nowrap cursor-pointer" onClick={() => handleRadioChange(item.id, item.value)}>
                                {item.label}
                            </label>
                        </div>
                    ))}
                </div>

    
                <div className="relative shrink-0" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg border border-white/10
                            ${selectedCompany 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-[rgba(32,41,59,0.5)] text-white/80 hover:bg-white/10'
                            }
                        `}
                    >
                        <i className="fa-solid fa-building"></i>
                        <span className="max-w-[100px] truncate">{selectedCompany || "Company"}</span>
                        {selectedCompany ? (
                            <i className="fa-solid fa-times ml-1 hover:text-red-300" onClick={(e) => { e.stopPropagation(); handleCompanySelect(null); }}></i>
                        ) : (
                            <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isCompanyOpen ? 'rotate-180' : ''}`}></i>
                        )}
                    </button>

                    {isCompanyOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                            <div className="p-2 bg-white/5 border-b border-white/5">
                                <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider ml-2">Filter by Company</span>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                <button 
                                    onClick={() => handleCompanySelect(null)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${!selectedCompany ? 'text-purple-400 font-bold' : 'text-white/70'}`}
                                >
                                    All Companies
                                </button>
                                {availableCompanies.length > 0 ? (
                                    availableCompanies.map((comp) => (
                                        <button
                                            key={comp}
                                            onClick={() => handleCompanySelect(comp)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors truncate border-t border-white/5
                                                ${selectedCompany === comp ? 'text-purple-400 font-bold bg-white/5' : 'text-white/70'}
                                            `}
                                        >
                                            {comp}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-xs text-white/30 italic text-center">No companies found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
    )
}