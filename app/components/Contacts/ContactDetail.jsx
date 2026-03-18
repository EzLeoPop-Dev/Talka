"use client";
import React, { useState, useEffect, useRef } from 'react';

const COUNTRY_TO_PREFIX = {
    "Thailand": "66+",
    "USA": "1+",
    "Japan": "81+"
};

export default function ContactDetail({ contact, onClose, onSave, onDelete, AVAILABLE_TAGS = [], AVAILABLE_COMPANIES = [] }) {
    const [formData, setFormData] = useState(contact);
    const [showCompanyList, setShowCompanyList] = useState(false);
    const companyWrapperRef = useRef(null);

    // Close company dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (companyWrapperRef.current && !companyWrapperRef.current.contains(event.target)) {
                setShowCompanyList(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update form data when contact changes
    useEffect(() => {
        setFormData(contact);
    }, [contact]);

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

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    const handleDelete = () => { if (onDelete) onDelete(contact.id); onClose(); };

    if (!contact) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 w-full max-w-md text-white" onClick={e => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <h2 className="text-2xl font-bold mb-4">Contact details</h2>
                
                <div className="flex items-center gap-4 mb-4">
                    <img src={formData.imgUrl} alt={formData.name} className="w-16 h-16 rounded-full bg-gray-600" />
                    <div className="flex-1"><h3 className="text-xl font-semibold">{formData.name}</h3></div>
                    {formData.channel === 'Facebook' && <i className="fa-brands fa-facebook text-3xl text-blue-500"></i>}
                    {formData.channel === 'Instagram' && <i className="fa-brands fa-instagram text-3xl text-pink-500"></i>}
                    {formData.channel === 'Line' && <i className="fa-brands fa-line text-3xl text-green-500"></i>}
                </div>

                {/* Assigned User Section*/}
                <div className="flex items-center gap-2 mb-6">
                    <select name="assignedUser" value={formData.assignedUser || "Admin"} onChange={handleChange} className="flex-1 text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600 appearance-none">
                        <option value="Admin">User nameAdmin</option>
                        <option value="User">User nameUser</option>
                    </select>
                    <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"><i className="fa-solid fa-comment"></i></button>
                </div>

                <h3 className="text-lg font-semibold mb-3">Contact fields</h3>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Company */}
                    <div className="relative" ref={companyWrapperRef}>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                        <div className="relative mt-1">
                            <input type="text" name="company" value={formData.company || ""} onChange={handleChange} onClick={() => setShowCompanyList(true)} className="w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600 pr-10" placeholder="Select or type new company" autoComplete="off"/>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-gray-400 hover:text-white" onClick={() => setShowCompanyList(!showCompanyList)}><i className={`fa-solid fa-chevron-down transition-transform ${showCompanyList ? 'rotate-180' : ''}`}></i></div>
                        </div>
                        {showCompanyList && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                {AVAILABLE_COMPANIES.length > 0 ? (
                                    AVAILABLE_COMPANIES.map((comp, index) => (
                                        <div key={index} className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm" onClick={() => handleCompanySelect(comp)}>{comp}</div>
                                    ))
                                ) : (<div className="px-4 py-2 text-gray-400 text-sm italic">No existing companies</div>)}
                            </div>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <div className="flex gap-2">
                            <select name="phonePrefix" value={formData.phonePrefix || '66+'} onChange={handleChange} className="text-white outline-0 bg-gray-700 rounded-lg py-2 px-3 border border-gray-600 appearance-none">
                                <option value="66+">66+</option><option value="1+">1+</option><option value="81+">81+</option>
                            </select>
                            <input type="tel" name="phone" value={formData.phone || ""} onChange={handleChange} className="flex-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600"/>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="mt-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600"/>
                    </div>
                    
                    {/* Country */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                        <select name="country" value={formData.country || ""} onChange={handleChange} className="mt-1 w-full text-white outline-0 bg-gray-700 rounded-lg py-2 px-4 border border-gray-600 appearance-none">
                            <option value="">N/A</option><option value="Thailand">Thailand</option><option value="USA">USA</option><option value="Japan">Japan</option><option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Tags */}
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
                        <button type="button" onClick={handleDelete} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
                        <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}