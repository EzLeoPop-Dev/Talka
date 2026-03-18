"use client";
import React, { useState, useEffect, useRef } from 'react';

const COUNTRY_TO_PREFIX = {
    "Thailand": "66+",
    "USA": "1+",
    "Japan": "81+"
};

export default function AddContactModal({ 
    onClose, 
    onAdd, 
    AVAILABLE_TAGS = [], 
    AVAILABLE_CHANNELS = [], 
    AVAILABLE_COMPANIES = []
}) {
    
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        phonePrefix: "66+", 
        country: "", 
        tags: "", 
        channel: "", 
        status: "Open" 
    });

    const [showCompanyList, setShowCompanyList] = useState(false);
    const companyWrapperRef = useRef(null); 

    useEffect(() => {
        function handleClickOutside(event) {
            if (companyWrapperRef.current && !companyWrapperRef.current.contains(event.target)) {
                setShowCompanyList(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [safeChannels, setSafeChannels] = useState([]);
    useEffect(() => {
        setSafeChannels(AVAILABLE_CHANNELS || []);
    }, [AVAILABLE_CHANNELS]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = value === "" ? null : value;

        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };
            if (name === "country" && COUNTRY_TO_PREFIX[value]) {
                updated.phonePrefix = COUNTRY_TO_PREFIX[value];
            }
            return updated;
        });
    };

    const handleCompanySelect = (company) => {
        setFormData(prev => ({ ...prev, company: company }));
        setShowCompanyList(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 w-full max-w-md text-white"
                onClick={e => e.stopPropagation()} 
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <h2 className="text-2xl font-bold mb-6">Add New Contact</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600" placeholder="Full Name" required />
                    </div>

                    {/* Company with Dropdown */}
                    <div className="relative" ref={companyWrapperRef}>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                        <div className="relative mt-1">
                            <input type="text" name="company" value={formData.company || ""} onChange={handleChange} onClick={() => setShowCompanyList(true)} className="w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600 pr-10" placeholder="Select or type new company" autoComplete="off" />
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-gray-400 hover:text-white" onClick={() => setShowCompanyList(!showCompanyList)}>
                                <i className={`fa-solid fa-chevron-down transition-transform ${showCompanyList ? 'rotate-180' : ''}`}></i>
                            </div>
                        </div>
                        {showCompanyList && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                {AVAILABLE_COMPANIES.length > 0 ? (
                                    AVAILABLE_COMPANIES.map((comp, index) => (
                                        <div key={index} className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm" onClick={() => handleCompanySelect(comp)}>{comp}</div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-400 text-sm italic">No existing companies</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Channel */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Channel</label>
                        <select name="channel" value={formData.channel || ""} onChange={handleChange} className="mt-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600 appearance-none">
                            <option value="" disabled>Select Channel</option>
                            {safeChannels.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <div className="flex gap-2">
                            <select name="phonePrefix" value={formData.phonePrefix} onChange={handleChange} className="text-white outline-0 bg-gray-700 rounded-lg py-2 px-3 border border-gray-600 appearance-none">
                                <option value="66+">66+</option><option value="1+">1+</option><option value="81+">81+</option>
                            </select>
                            <input type="tel" name="phone" value={formData.phone || ""} onChange={handleChange} className="flex-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600" />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="mt-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600" />
                    </div>
                    
                    {/* Country */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                        <select name="country" value={formData.country || ""} onChange={handleChange} className="mt-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600 appearance-none">
                            <option value="">N/A</option><option value="Thailand">Thailand</option><option value="USA">USA</option><option value="Japan">Japan</option><option value="Other">Other</option>
                        </select>
                    </div>

                    {/*  Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                        <select 
                            name="tags"
                            value={formData.tags || ""}
                            onChange={handleChange}
                            className="mt-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600 appearance-none"
                        >
                            <option value="">N/A</option>
                            {AVAILABLE_TAGS.map((tagObj) => (
                                <option key={tagObj.name} value={tagObj.name}>
                                    {tagObj.emoji} {tagObj.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg">Create Contact</button>
                    </div>
                </form>
            </div>
        </div>
    );
}