"use client";
import React, { useState, useEffect, useMemo } from 'react'; 

// 🟢 [BACKEND NOTE]: ลบ import mock data เหล่านี้ออกเมื่อเชื่อมต่อ API สำเร็จ
import { unifiedMockData } from '@/app/data/mockData'; 
import { DEFAULT_TAGS } from "@/app/data/defaultTags";

import ContactDetail from '@/app/components/Contacts/ContactDetail'; 
import FilterPopup from '@/app/components/Modals/FilterPopup';
import AddContactModal from '@/app/components/Contacts/AddContact';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AVAILABLE_STATUSES = ["New Chat", "Open", "Pending", "Closed"];

export default function ContactList() {
    const [contacts, setContacts] = useState([]); 
    const [isLoaded, setIsLoaded] = useState(false); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [availableTags, setAvailableTags] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        channel: null,
        tag: null,
        status: null
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterCompany, setFilterCompany] = useState(null);
    const [isCompanyFilterOpen, setIsCompanyFilterOpen] = useState(false);

    // 🟢 [BACKEND NOTE]: โหลดข้อมูล Contacts จาก API
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                // 🟢 [API CALL]:
                // const response = await fetch('/api/contacts');
                // const data = await response.json();
                // setContacts(data);

                // [Mock Data]
                setContacts(unifiedMockData);
            } catch (error) {
                console.error("Failed to load contacts", error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchContacts();
    }, []);

    // 🟢 [BACKEND NOTE]: โหลดข้อมูล Tags จาก API
    useEffect(() => {
        const fetchTags = async () => {
            try {
                // 🟢 [API CALL]:
                // const response = await fetch('/api/tags');
                // const data = await response.json();
                // setAvailableTags(data);

                // [Mock Data]
                setAvailableTags(DEFAULT_TAGS);
            } catch (error) {
                console.error("Failed to load tags", error);
            }
        };

        fetchTags();
    }, []);

    const availableCompanies = useMemo(() => [...new Set(contacts.map(c => c.company).filter(Boolean))], [contacts]);
    const availableChannels = useMemo(() => [...new Set(contacts.map(c => c.channel).filter(Boolean))], [contacts]);

    const handleRowClick = (contact) => { setSelectedContact(contact); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedContact(null); };

    // 🟢 [BACKEND NOTE]: บันทึกการแก้ไข Contact
    const handleSaveChanges = async (updatedContact) => {
        const contactToSave = { ...updatedContact };
        Object.keys(contactToSave).forEach(key => { if (contactToSave[key] === "") contactToSave[key] = null; });
        
        try {
            // 🟢 [API CALL]: อัปเดตข้อมูล (PUT/PATCH)
            // await fetch(`/api/contacts/${contactToSave.id}`, {
            //     method: 'PUT',
            //     body: JSON.stringify(contactToSave)
            // });

            const newContacts = contacts.map(c => c.id === contactToSave.id ? contactToSave : c);
            setContacts(newContacts);
            handleCloseModal(); 
        } catch (error) {
            console.error("Failed to update contact", error);
        }
    };

    // 🟢 [BACKEND NOTE]: ลบ Contact (1 รายการ)
    const handleDeleteContact = async (contactId) => {
        try {
            // 🟢 [API CALL]: 
            // await fetch(`/api/contacts/${contactId}`, { method: 'DELETE' });

            const newContacts = contacts.filter(c => c.id !== contactId);
            setContacts(newContacts);
        } catch (error) {
            console.error("Failed to delete contact", error);
        }
    };

    const handleDeleteClick = () => { setIsDeleteModalOpen(true); };

    // 🟢 [BACKEND NOTE]: ลบ Contact (หลายรายการ - Bulk Delete)
    const confirmDelete = async () => {
        try {
            // 🟢 [API CALL]: ส่ง Array ของ IDs ไปลบ
            // await fetch('/api/contacts/bulk-delete', {
            //     method: 'POST', // หรือ DELETE
            //     body: JSON.stringify({ ids: selectedIds })
            // });

            const newContacts = contacts.filter(c => !selectedIds.includes(c.id));
            setContacts(newContacts);
            setSelectedIds([]);
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Failed to delete contacts", error);
        }
    };

    // 🟢 [BACKEND NOTE]: เพิ่ม Contact ใหม่
    const handleAddContact = async (newContactData) => {
        const nameQuery = newContactData.name ? newContactData.name.replace(' ', '+') : 'New+User';
        const imgUrl = `https://ui-avatars.com/api/?name=${nameQuery}&background=random`;
        
        const payload = { ...newContactData, imgUrl: imgUrl };

        try {
            // 🟢 [API CALL]:
            // const response = await fetch('/api/contacts', {
            //     method: 'POST',
            //     body: JSON.stringify(payload)
            // });
            // const createdContact = await response.json();

            // จำลองการเพิ่ม
            const newContact = { ...payload, id: Date.now() };
            setContacts(prevContacts => [newContact, ...prevContacts]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to add contact", error);
        }
    };

    const filteredContacts = useMemo(() => {
        const filtered = contacts.filter(contact => {
            const nameMatch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
            const channelMatch = !filters.channel || contact.channel === filters.channel;
            const tagMatch = !filters.tag || (() => {
                if (Array.isArray(contact.tags)) {
                    return contact.tags.includes(filters.tag);
                }
                return contact.tags === filters.tag;
            })();
            const statusMatch = !filters.status || contact.status === filters.status;
            const companyMatch = !filterCompany || contact.company === filterCompany;
            return nameMatch && channelMatch && tagMatch && statusMatch && companyMatch;
        });

        return filtered.sort((a, b) => {
            const statusOrder = {
                "New Chat": 1, 
                "Pending": 2,  
                "Open": 3,     
                "Closed": 4    
            };

            const priorityA = statusOrder[a.status] || 99;
            const priorityB = statusOrder[b.status] || 99;

            return priorityA - priorityB;
        });

    }, [contacts, searchTerm, filters, filterCompany]);

    const handleSelectAll = (e) => {
        if (e.target.checked) { setSelectedIds(filteredContacts.map(c => c.id)); } else { setSelectedIds([]); }
    };
    const handleSelectOne = (e, id) => {
        e.stopPropagation(); 
        if (selectedIds.includes(id)) { setSelectedIds(prev => prev.filter(itemId => itemId !== id)); } else { setSelectedIds(prev => [...prev, id]); }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Contact List Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()} - Total: ${filteredContacts.length} contacts`, 14, 22);

        const tableColumn = ["Name", "Company", "Channel", "Phone", "Email", "Country", "Tags", "Status"];
        
        const tableRows = filteredContacts.map(c => [
            c.name,
            c.company || "-",
            c.channel || "-",
            c.phone ? `${c.phonePrefix}${c.phone}` : "-",
            c.email || "-",
            c.country || "-",
            c.tags || "-",
            c.status || "-"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'grid',
            styles: { fontSize: 7 },
            headStyles: { fillColor: [88, 40, 201] },
            columnStyles: { 0: { cellWidth: 25 }, 4: { cellWidth: 35 } }
        });

        doc.save("contacts.pdf");
    };

    const CHECKBOX_CLASS = "appearance-none h-4 w-4 border border-gray-400 rounded-sm bg-transparent checked:bg-white checked:border-white focus:outline-none focus:ring-0 cursor-pointer relative checked:after:content-[''] checked:after:absolute checked:after:left-[0.3rem] checked:after:top-[0.0rem] checked:after:w-[0.25rem] checked:after:h-[0.55rem] checked:after:border-b-[0.15rem] checked:after:border-r-[0.15rem] checked:after:border-black checked:after:rotate-45";

    // ==========================================================
    // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ 100%
    // ==========================================================
    return (
        <div className="w-full h-[95vh] p-2 md:p-4"> 
            <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-4 h-full flex flex-col">
                
                <h1 className="text-white text-2xl font-bold mb-6 pl-4 pt-4">Contacts</h1>

                <div className="flex justify-between flex-col md:flex-row items-center mb-6 px-4 gap-4 md:gap-4"> 
                    
                    <div className="search flex items-center text-white bg-[rgba(32,41,59,0.25)] rounded-2xl py-2 px-4 w-full md:w-1/5 md:mr-5"> 
                        <i className="fa-solid fa-magnifying-glass mr-3"></i>
                        <input 
                            type="text" 
                            className="text-white outline-0 bg-transparent w-full" 
                            placeholder="Search Contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto flex-wrap justify-start md:justify-end"> 
                        
                        {selectedIds.length > 0 && (
                            <button onClick={handleDeleteClick} className="shrink-0 flex items-center justify-center text-white bg-red-500/80 hover:bg-red-600 shadow-2xl rounded-2xl py-2 px-4 cursor-pointer md:mr-3 transition-all duration-300">
                                <i className="fa-solid fa-trash mr-2"></i><span>Delete ({selectedIds.length})</span>
                            </button>
                        )}

                        <div 
                            className="addcontact shrink-0 flex items-center justify-center text-white bg-[rgba(88,40,201,0.4)] shadow-2xl rounded-2xl py-2 px-4 cursor-pointer hover:bg-[rgba(88,40,201,0.6)] md:mr-3"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <i className="fa-solid fa-plus mr-3"></i>
                            <button>Add Contact</button> 
                        </div>

                        <div 
                            className="shrink-0 flex items-center justify-center text-white bg-green-600/80 hover:bg-green-700 shadow-2xl rounded-2xl py-2 px-4 cursor-pointer md:mr-3"
                            onClick={handleExportPDF}
                        >
                            <i className="fa-solid fa-file-pdf mr-2"></i>
                            <button>PDF</button> 
                        </div>

                        <div className="relative">
                            <button onClick={() => setIsCompanyFilterOpen(!isCompanyFilterOpen)} className={`shrink-0 flex items-center justify-center text-white shadow-2xl rounded-2xl py-2 px-4 cursor-pointer md:mr-3 w-full md:w-auto ${isCompanyFilterOpen || filterCompany ? 'bg-[rgba(88,40,201,0.6)]' : 'bg-[rgba(32,41,59,0.25)] hover:bg-[rgba(32,41,59,0.5)]'}`}>
                                <i className="fa-solid fa-building"></i><p className="pl-2">{filterCompany || "Company"}</p>
                                {filterCompany && <i className="fa-solid fa-times ml-2 text-xs opacity-70 hover:opacity-100" onClick={(e) => { e.stopPropagation(); setFilterCompany(null); }}></i>}
                            </button>
                            {isCompanyFilterOpen && (
                                <div className="absolute z-50 top-12 left-0 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto">
                                    <div className={`p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white ${!filterCompany ? 'bg-gray-800 font-bold' : ''}`} onClick={() => { setFilterCompany(null); setIsCompanyFilterOpen(false); }}>All Companies</div>
                                    {availableCompanies.map((comp) => (
                                        <div key={comp} className={`p-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white ${filterCompany === comp ? 'bg-gray-800 font-bold text-purple-400' : ''}`} onClick={() => { setFilterCompany(comp); setIsCompanyFilterOpen(false); }}>{comp}</div>
                                    ))}
                                    {availableCompanies.length === 0 && <div className="p-2 text-gray-400 text-sm text-center">No companies found</div>}
                                </div>
                            )}
                        </div>

                        <div className="relative"> 
                            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`shrink-0 flex items-center justify-center bg-[rgba(32,41,59,0.25)] text-white shadow-2xl rounded-2xl py-2 px-4 cursor-pointer  ${isFilterOpen ? 'bg-[rgba(88,40,201,0.6)]' : 'bg-[rgba(32,41,59,0.25)] hover:bg-[rgba(32,41,59,0.5)]'}`}>
                                <i className="fa-solid fa-filter"></i><p className="pl-2">Filter</p>
                            </button>
                            <FilterPopup 
                                isOpen={isFilterOpen} 
                                onClose={() => setIsFilterOpen(false)} 
                                currentFilters={filters} 
                                onApplyFilters={(newFilters) => setFilters(newFilters)} 
                                AVAILABLE_CHANNELS={availableChannels} 
                                AVAILABLE_TAGS={availableTags}
                                AVAILABLE_STATUSES={AVAILABLE_STATUSES} />
                        </div>

                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto overflow-x-auto">
                    <div className="min-w-[1060px]">
                        <div className="grid grid-cols-[auto_2fr_repeat(7,1fr)] gap-x-4 items-center py-3 border-b border-gray-500/30 text-gray-300 font-semibold text-sm px-4 ">
                            <input type="checkbox" className={CHECKBOX_CLASS} onChange={handleSelectAll} checked={filteredContacts.length > 0 && selectedIds.length === filteredContacts.length}/>
                            <span>Name</span><span>Channel</span><span>Email</span><span>Phone</span><span>Company</span><span>Country</span><span>Tags</span><span>Status</span>
                        </div>
                        <div className="text-white text-sm">
                            {filteredContacts.map((contact) => (
                                <div key={contact.id} onClick={() => handleRowClick(contact)} className="grid grid-cols-[auto_2fr_repeat(7,1fr)] gap-x-4 items-center py-3 border-b border-gray-500/20 hover:bg-white/10 cursor-pointer px-4">
                                    <input type="checkbox" className={CHECKBOX_CLASS} onClick={(e) => e.stopPropagation()} onChange={(e) => handleSelectOne(e, contact.id)} checked={selectedIds.includes(contact.id)} />
                                    <div className="flex items-center"><img src={contact.imgUrl} alt={contact.name} className="w-8 h-8 rounded-full mr-3" /><span>{contact.name}</span></div>
                                    <div className="flex items-center">
                                        {contact.channel === 'Facebook' && <i className="fa-brands fa-facebook mr-2 text-blue-500"></i>}
                                        {contact.channel === 'Line' && <i className="fa-brands fa-line mr-2 text-green-500"></i>}
                                        <span className={!contact.channel ? "text-gray-400" : ""}>{contact.channel || "N/A"}</span>
                                    </div>
                                    <span className={!contact.email ? "text-gray-400" : ""}>{contact.email || "N/A"}</span>
                                    <span className={!contact.phone ? "text-gray-400" : ""}>{contact.phone ? <>{contact.phonePrefix && `${contact.phonePrefix}`}{contact.phone}</> : "N/A"}</span>
                                    <span className={!contact.company ? "text-gray-400" : ""}>{contact.company || "N/A"}</span>
                                    <span className={!contact.country ? "text-gray-400" : ""}>{contact.country || "N/A"}</span>
                                    <div className="flex items-center">
                                        {(() => {
                                            let tagName = contact.tags;
                                            if (Array.isArray(contact.tags)) {
                                                tagName = contact.tags.length > 0 ? contact.tags[0] : null;
                                            }
                                            const tagData = availableTags.find(t => t.name === tagName);
                                            if (tagData) {
                                                return (
                                                    <span 
                                                        className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm border border-white/10 flex items-center gap-1 w-fit"
                                                        style={{ backgroundColor: tagData.color || '#666' }}
                                                    >
                                                        {tagData.emoji} {tagData.name}
                                                    </span>
                                                );
                                            }
                                            return <span className="text-gray-400">{tagName || "N/A"}</span>;
                                        })()}
                                    </div>
                                    <span className={!contact.status ? "text-gray-400" : ""}>{contact.status || "N/A"}</span>
                                </div>
                            ))}
                        </div>
                    </div> 
                </div> 

            </div>

            {/* Modal Components */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><i className="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i></div>
                        <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete <span className="font-bold text-white">{selectedIds.length}</span> selected contacts? <br />This action cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors">Cancel</button>
                            <button onClick={confirmDelete} className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30 transition-all transform hover:scale-105">Delete</button>
                        </div>
                    </div>
                </div>
            )}
            
            {isModalOpen && selectedContact && ( 
                <ContactDetail 
                    contact={selectedContact} 
                    onClose={handleCloseModal} 
                    onSave={handleSaveChanges} 
                    onDelete={handleDeleteContact} 
                    AVAILABLE_TAGS={availableTags}
                    AVAILABLE_COMPANIES={availableCompanies} 
                /> 
            )}
            {isAddModalOpen && ( 
                <AddContactModal 
                    onClose={() => setIsAddModalOpen(false)} 
                    onAdd={handleAddContact} 
                    AVAILABLE_TAGS={availableTags} 
                    AVAILABLE_CHANNELS={availableChannels} 
                    AVAILABLE_COMPANIES={availableCompanies} 
                /> 
            )}
        </div> 
    );
}