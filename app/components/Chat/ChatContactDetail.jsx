"use client";
import React, { useState, useEffect } from 'react';

export default function ContactDetails({ onClose, contact, onUpdateContact }) {
  
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);

  useEffect(() => {
    if (contact) {
      setPhone(contact.phone || "");
      setEmail(contact.email || "");
      setCountry(contact.country || "");
    }
    setIsEditingPhone(false);
    setIsEditingEmail(false);
    setIsEditingCountry(false);
  }, [contact]);

  if (!contact) {
    return (
      <div className="w-[320px] max-h-[85vh] mt-3 ml-3 bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col self-start text-white/70">
        Loading...
      </div>
    );
  }

  const handleSave = (field) => {
    if (typeof onUpdateContact !== 'function') {
      console.error("onUpdateContact is not a function. Check page.jsx");
      return; 
    }

    if (field === 'phone') {
      onUpdateContact(contact.id, { phone: phone }); 
      setIsEditingPhone(false); 
    }
    if (field === 'email') {
      onUpdateContact(contact.id, { email: email }); 
      setIsEditingEmail(false); 
    }
    if (field === 'country') {
      onUpdateContact(contact.id, { country: country });
      setIsEditingCountry(false);
    }
  };

  const EditButton = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all border border-white/5 shadow-sm"
        title="Edit"
    >
        <i className="fa-solid fa-pen text-xs"></i>
    </button>
  );

  return (
    <div className="w-[320px] max-h-[85vh] mt-3 ml-3 bg-[rgba(32,41,59,0.25)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col self-start overflow-auto">
      
      <h2 className="text-white text-2xl font-semibold mb-5">Contact details</h2>

      {/* Profile Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-16 h-16 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-3xl shadow-lg shrink-0">
          {contact.avatar}
        </div>
        
        <div>
          <h3 className="text-white font-semibold text-lg truncate">{contact.name}</h3>
          
        </div>
      </div>

      {/* Contact Fields */}
      <div className="space-y-6">
        <h4 className="text-white/90 font-semibold text-md mb-2 border-b border-white/10 pb-2">Contact fields</h4>

        {/* Phone */}
        <div>
          <label className="text-white/50 text-[10px] uppercase tracking-wider mb-1 block">Phone Number</label>
          {isEditingPhone ? (
            <div className="flex gap-2 mt-1 animate-fade-in">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400 border border-white/10"
                placeholder="0123456789"
                autoFocus
              />
              <button onClick={() => handleSave('phone')} className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-check"></i></button>
              <button onClick={() => setIsEditingPhone(false)} className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
          ) : (
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors -mx-2">
              {contact.phone ? (
                <p className="text-white text-sm font-medium">{contact.phone}</p>
              ) : (
                <p className="text-white/30 text-sm italic">Add Phone Number</p>
              )}
              <EditButton onClick={() => setIsEditingPhone(true)} />
            </div>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="text-white/50 text-[10px] uppercase tracking-wider mb-1 block">Email Address</label>
          {isEditingEmail ? (
            <div className="flex gap-2 mt-1 animate-fade-in">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400 border border-white/10"
                placeholder="example@email.com"
                autoFocus
              />
              <button onClick={() => handleSave('email')} className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-check"></i></button>
              <button onClick={() => setIsEditingEmail(false)} className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
          ) : (
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors -mx-2">
              {contact.email ? (
                <p className="text-white text-sm font-medium">{contact.email}</p>
              ) : (
                <p className="text-white/30 text-sm italic">Add Email Address</p>
              )}
              <EditButton onClick={() => setIsEditingEmail(true)} />
            </div>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="text-white/50 text-[10px] uppercase tracking-wider mb-1 block">Country</label>
          {isEditingCountry ? (
            <div className="flex gap-2 mt-1 animate-fade-in">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="flex-1 bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400 border border-white/10"
                placeholder="e.g. Thailand"
                autoFocus
              />
              <button onClick={() => handleSave('country')} className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-check"></i></button>
              <button onClick={() => setIsEditingCountry(false)} className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
          ) : (
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors -mx-2">
              {contact.country ? (
                <p className="text-white text-sm font-medium">{contact.country}</p>
              ) : (
                <p className="text-white/30 text-sm italic">Add Country</p>
              )}
              <EditButton onClick={() => setIsEditingCountry(true)} />
            </div>
          )}
        </div>
      </div>

      {/* ปุ่ม Done */}
      <button
        onClick={onClose}
        className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all mt-8 backdrop-blur-sm"
      >
        Done
      </button>
    </div>
  );
}