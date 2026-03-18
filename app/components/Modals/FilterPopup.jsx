"use client";
import React, { useState, useEffect } from 'react';

export default function FilterPopup({ 
    isOpen, 
    onClose, 
    currentFilters, 
    onApplyFilters, 
    AVAILABLE_CHANNELS = [], 
    AVAILABLE_TAGS = [],
    AVAILABLE_STATUSES = [] 
}) {
    const [localFilters, setLocalFilters] = useState(currentFilters);

    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters]);

    const handleRadioChange = (filterType, value) => {
        setLocalFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const handleClear = () => {
        const clearedFilters = { channel: null, tag: null, status: null };
        setLocalFilters(clearedFilters);
        onApplyFilters(clearedFilters);
        onClose();
    };

    if (!isOpen) return null;

    const FilterRadio = ({ group, value, children }) => (
        <label className="flex items-center space-x-2 cursor-pointer text-gray-200 hover:text-white">
            <input 
                type="radio" 
                name={group} 
                value={value || ""}
                checked={localFilters[group] === value}
                onChange={() => handleRadioChange(group, value)}
                className="bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600 ring-offset-gray-900 focus:ring-2"
            />
            <span className="flex items-center">{children}</span>
        </label>
    );

    return (
        <div className="absolute z-40 top-14 right-0 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Filter</h3>
            
            {/* Channel Filter */}
            <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-300">Channels</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <FilterRadio group="channel" value={null}>All</FilterRadio>
                    {AVAILABLE_CHANNELS.map(channel => (
                        <FilterRadio key={channel} group="channel" value={channel}>{channel}</FilterRadio>
                    ))}
                </div>
            </div>

            {/* Tags Filter */}
            <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-300">Tags</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <FilterRadio group="tag" value={null}>All</FilterRadio>
                    {AVAILABLE_TAGS.map((tagObj) => (
                        <FilterRadio 
                            key={tagObj.name} 
                            group="tag" 
                            value={tagObj.name} 
                        >
                            <span className="mr-1">{tagObj.emoji}</span> {tagObj.name}
                        </FilterRadio>
                    ))}
                </div>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-300">Status</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <FilterRadio group="status" value={null}>All</FilterRadio>
                    {AVAILABLE_STATUSES.map(status => (
                        <FilterRadio key={status} group="status" value={status}>{status}</FilterRadio>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
                <button onClick={handleClear} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Clear All</button>
                <button onClick={handleApply} className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg">Apply</button>
            </div>
        </div>
    );
}