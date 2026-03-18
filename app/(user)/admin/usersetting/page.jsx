"use client";
import { CircleUser, Ban, Edit, Info, X, AlertTriangle, User, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function UserSettingPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [editId, setEditId] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 🟢 [BACKEND NOTE]: โหลดข้อมูลผู้ใช้จาก API แทน LocalStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 🟢 [API CALL]: ดึงข้อมูลของตัวเอง (Current User)
        // const meResponse = await fetch('/api/users/me');
        // const meData = await meResponse.json();
        // setCurrentUser(meData);

        // 🟢 [API CALL]: ดึงรายชื่อผู้ใช้ทั้งหมดใน Workspace
        // const usersResponse = await fetch('/api/users');
        // const usersData = await usersResponse.json();
        // setUsers(usersData);

        // ==========================================
        // [Mock Processing] สร้างข้อมูลจำลองเพื่อให้หน้าเว็บแสดงผลได้ไปก่อน
        const mockMe = {
          id: 999,
          name: "Somchai Admin",
          username: "Somchai Admin", 
          email: "me@example.com",
          permission: "Owner",
          role: "Owner"
        };
        setCurrentUser(mockMe);
        
        // จำลองรายชื่อคนอื่น
        setUsers([
            { id: 1, name: "Employee A", email: "emp.a@example.com", role: "Employee" }
        ]);
        // ==========================================

      } catch (error) {
        console.error("Error loading users data", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchUserData();
  }, []);


  const displayUsers = currentUser ? [currentUser, ...users] : users;

  const openAddModal = () => {
    setMode("add");
    setEmail("");
    setRole("Employee");
    setIsOpen(true);
  };

  const openEditModal = (user) => {
    setMode("edit");
    setEditId(user.id);
    setEmail(user.email);
    setRole(user.permission || user.role); 
    setIsOpen(true);
  };

  const openDeleteModal = (user) => {
    setDeleteTarget(user);
    setIsDeleteOpen(true);
  };

  // 🟢 [BACKEND NOTE]: เปลี่ยนการลบเป็นการยิง API
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
        // 🟢 [API CALL]: ลบ User
        // await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' });

        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    } catch (error) {
        console.error("Failed to delete user", error);
    } finally {
        setIsDeleteOpen(false);
        setDeleteTarget(null);
    }
  };

  // 🟢 [BACKEND NOTE]: เปลี่ยนการเพิ่มเป็นยิง API POST
  const handleAddUser = async () => {
    if (!email.trim()) return alert("Please enter an email.");
    
    const newUserPayload = {
      name: email.split("@")[0],
      email,
      permission: role,
      role: role, 
    };

    try {
        // 🟢 [API CALL]: เพิ่ม User ใหม่
        // const response = await fetch('/api/users', { 
        //     method: 'POST', 
        //     body: JSON.stringify(newUserPayload) 
        // });
        // const createdUser = await response.json();

        // จำลองเพิ่มลง State
        const newUser = { id: Date.now(), ...newUserPayload };
        setUsers((prev) => [...prev, newUser]);
    } catch (error) {
        console.error("Failed to add user", error);
    } finally {
        setIsOpen(false);
    }
  };

  // 🟢 [BACKEND NOTE]: เปลี่ยนการแก้ไขเป็นยิง API PATCH / PUT
  const handleEditUser = async () => {
    try {
        if (currentUser && editId === currentUser.id) {
            const updatedMePayload = { email: email, permission: role, role: role };
            
            // 🟢 [API CALL]: อัปเดตข้อมูลตัวเอง
            // await fetch('/api/users/me', { method: 'PATCH', body: JSON.stringify(updatedMePayload) });

            const updatedMe = { ...currentUser, ...updatedMePayload }; 
            setCurrentUser(updatedMe);
            
            // ส่ง event บอก component อื่น (เช่น sidebar) ว่า user เปลี่ยนแล้ว
            window.dispatchEvent(new Event("user_updated"));
          } else {
            const updatedUserPayload = { email: email, permission: role, role: role };

            // 🟢 [API CALL]: อัปเดตข้อมูลคนอื่น
            // await fetch(`/api/users/${editId}`, { method: 'PATCH', body: JSON.stringify(updatedUserPayload) });

            setUsers((prev) =>
              prev.map((user) =>
                user.id === editId ? { ...user, ...updatedUserPayload } : user
              )
            );
          }
    } catch (error) {
        console.error("Failed to edit user", error);
    } finally {
        setIsOpen(false);
    }
  };

  if (!isLoaded) return <div className="text-white text-center mt-20 animate-pulse">Loading Users...</div>;

  // ==========================================================
  // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ 100%
  // ==========================================================
  return (
    <>
      {/* Modal Delete */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1a1b22] text-white rounded-2xl p-6 w-[400px] shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" size={20} /> Confirm Delete
              </h2>
              <button onClick={() => setIsDeleteOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={22} /></button>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to remove <span className="font-semibold text-white">{deleteTarget?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="text-gray-300 hover:text-white cursor-pointer">Cancel</button>
              <button onClick={confirmDelete} className="flex items-center gap-1 bg-red-500/30 border border-red-400 text-red-200 rounded-lg px-4 py-2 text-sm hover:bg-red-500/50 cursor-pointer"><Ban size={16} /> Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add/Edit */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-[#12131a] text-white w-[480px] rounded-2xl border border-white/20 shadow-2xl p-6 md:p-8">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-semibold">{mode === "add" ? "Add User" : "Edit User"}</h2>
              <Info size={18} className="text-gray-400" />
            </div>
            <hr className="border-white/20 mb-6" />
            <div className="mb-5">
              <label className="block text-sm mb-2">User email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1c1d25] border border-white/30 rounded-lg px-3 py-2 outline-none text-white" />
            </div>
            <div className="mb-5">
              <label className="block text-sm mb-2">Role</label>
              <div className="relative">
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-[#1c1d25] border border-white/30 rounded-lg px-3 py-2 text-white appearance-none cursor-pointer">
                  <option>Owner</option>
                  <option>Admin</option>
                  <option>Employee</option>
                </select>
                <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">▼</div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white cursor-pointer">Cancel</button>
              <button onClick={mode === "add" ? handleAddUser : handleEditUser} className="bg-white/20 border border-white/40 text-white px-5 py-1.5 rounded-lg hover:bg-white/30 cursor-pointer">{mode === "add" ? "Add" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-[94vh] p-2 md:p-4">
        <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-4 h-full flex flex-col">


            <div className="relative max-w-3xl p-8 pb-0">
              <div className="flex items-center gap-3 mb-8 ">
                <Users className="text-white p-2 bg-white/5 rounded-xl border border-white/10" size={50} />
                <div>
                  <h1 className="text-xl font-semibold text-white">User Setting</h1>
                  <p className="text-sm text-white/70">
                    Manage workspace members.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/28 mx-7 mb-8 mt-[-10]"></div>

            <div className="flex justify-between items-center w-full mb-6 px-4 gap-4">
              <button onClick={openAddModal} className="flex items-center text-white bg-[rgba(255,255,255,0.22)] shadow-2xl rounded-2xl py-3 px-5 hover:bg-[#ffffff52] cursor-pointer">
                <i className="fa-solid fa-plus mr-2"></i> Add User
              </button>
              <div className="flex items-center text-white bg-[rgba(255,255,255,0.22)] shadow-2xl rounded-2xl py-2 px-4 gap-2 w-[250px]">
                <i className="fa-solid fa-magnifying-glass mr-3"></i>
                <input type="text" className="text-white outline-0 bg-transparent w-full" placeholder="Search User..." />
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full overflow-y-auto px-2 pb-4">
              {displayUsers.map((user) => {
                const isMe = currentUser && user.id === currentUser.id;

                //  Logic การดึงชื่อและ Role ที่ฉลาดขึ้น
                const displayName = user.name || user.username || "Unknown User";
                const displayRole = user.permission || user.role || "No Role";
                const displayEmail = user.email;

                return (
                  <div
                    key={user.id}
                    className="flex justify-between items-center bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.3)] rounded-2xl py-3 px-5 shadow-md backdrop-blur-md hover:bg-[rgba(255,255,255,0.2)] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <CircleUser className="text-white" size={36} />

                      <div className="flex flex-col">
                        {/* 2. บรรทัดบน: ชื่อ + You */}
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{displayName}</span>
                          {isMe && <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full">You</span>}
                        </div>
                        {/* 3. บรรทัดล่าง: Role + Email (แสดง Email ถ้ามี) */}
                        <span className="text-white/70 text-sm">
                          {displayRole} {displayEmail ? `- ${displayEmail}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isMe && (
                        <>
                          <button onClick={() => openDeleteModal(user)} className="flex items-center gap-1 bg-red-500/30 border border-red-400 text-red-200 rounded-lg px-3 py-1 text-sm hover:bg-red-500/50 transition cursor-pointer">
                            <Ban size={16} /> remove
                          </button>
                          <button onClick={() => openEditModal(user)} className="flex items-center gap-1 bg-white/20 border border-white/40 text-white rounded-lg px-3 py-1 text-sm hover:bg-white/30 transition cursor-pointer">
                            <Edit size={16} /> Edit
                          </button>
                        </>
                      )}
                      {/* ถ้าเป็นตัวเอง ก็สามารถแก้ไขได้ (เพิ่มปุ่ม Edit ให้ตัวเอง) */}
                      {isMe && (
                        <button onClick={() => openEditModal(user)} className="flex items-center gap-1 bg-white/20 border border-white/40 text-white rounded-lg px-3 py-1 text-sm hover:bg-white/30 transition cursor-pointer">
                          <Edit size={16} /> Edit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
      );
}