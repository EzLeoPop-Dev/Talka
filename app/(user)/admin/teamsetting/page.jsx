"use client";
import { Info, X, Trash2, Edit, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

function TeamModal({
  isOpen,
  title,
  onClose,
  onConfirm,
  teamName,
  setTeamName,
  teamDesc,
  setTeamDesc,
  teamMembers,
  setTeamMembers,
  userOptions,
  platforms,
  setPlatforms
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-[#12131a] text-white w-[550px] rounded-2xl border border-white/20 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
          <X size={22} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <Info size={18} className="text-gray-400" />
        </div>
        <hr className="border-white/20 mb-6" />

        {/* Team Name */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name Ex. Support Team A"
            className="w-full bg-[#1c1d25] border border-white/30 rounded-lg px-3 py-2 outline-none text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Description</label>
          <textarea
            value={teamDesc}
            onChange={(e) => setTeamDesc(e.target.value)}
            rows={2}
            placeholder="Add team description"
            className="w-full bg-[#1c1d25] border border-white/30 rounded-lg px-3 py-2 outline-none text-white resize-none"
          />
        </div>

        {/* Platform Selection */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Connected Platforms</label>
          <div className="flex gap-4">
            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${platforms.includes('line') ? 'bg-[#06c755]/20 border-[#06c755]' : 'bg-[#1c1d25] border-white/30'}`}>
              <input
                type="checkbox"
                className="hidden"
                checked={platforms.includes('line')}
                onChange={() => {
                  if (platforms.includes('line')) {
                    setPlatforms(platforms.filter(p => p !== 'line'));
                  } else {
                    setPlatforms([...platforms, 'line']);
                  }
                }}
              />
              <i className="fa-brands fa-line text-[#06c755] text-xl"></i>
              <span className="text-sm">Line OA</span>
            </label>

            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${platforms.includes('facebook') ? 'bg-[#1877f2]/20 border-[#1877f2]' : 'bg-[#1c1d25] border-white/30'}`}>
              <input
                type="checkbox"
                className="hidden"
                checked={platforms.includes('facebook')}
                onChange={() => {
                  if (platforms.includes('facebook')) {
                    setPlatforms(platforms.filter(p => p !== 'facebook'));
                  } else {
                    setPlatforms([...platforms, 'facebook']);
                  }
                }}
              />
              <i className="fa-brands fa-facebook text-[#1877f2] text-xl"></i>
              <span className="text-sm">Facebook</span>
            </label>
          </div>
        </div>

        {/* Members */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Team Members</label>
          <div className="bg-[#1c1d25] border border-white/30 rounded-lg p-3 h-[150px] overflow-y-auto custom-scrollbar">
            {userOptions.length > 0 ? (
              userOptions.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition"
                >
                  <input
                    type="checkbox"
                    checked={teamMembers.includes(user.name)}
                    onChange={() => {
                      if (teamMembers.includes(user.name)) {
                        setTeamMembers(teamMembers.filter((u) => u !== user.name));
                      } else {
                        setTeamMembers([...teamMembers, user.name]);
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {user.name}
                      {/* แสดงป้าย You ถ้าเป็นตัวเอง */}
                      {user.isMe && <span className="bg-purple-500 text-[10px] px-1.5 rounded text-white">You</span>}
                    </span>
                    <span className="text-xs text-white/50">{user.role}</span>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center mt-4">
                No users found.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="text-gray-300 hover:text-white cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="bg-white/20 border border-white/40 text-white px-5 py-1.5 rounded-lg hover:bg-white/30 cursor-pointer">Save</button>
        </div>
      </div>
    </div>
  );
}

// Confirm Delete Team Modal
function ConfirmDeleteModal({ isOpen, teamName, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-[#1E1E1E] border border-white/20 rounded-2xl p-6 w-[380px] text-white shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"><X size={22} /></button>
        <div className="flex flex-col gap-4 mt-2">
          <h2 className="text-lg font-semibold flex flex-col items-center gap-2">Delete Team</h2>
          <p className="text-gray-400 text-sm text-center">Are you sure you want to delete <b>{teamName}</b>? <br />This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="text-gray-300 hover:text-white cursor-pointer">Cancel</button>
            <button onClick={onConfirm} className="flex items-center gap-1 bg-red-500/30 border border-red-400 text-red-200 rounded-lg px-4 py-2 text-sm cursor-pointer hover:bg-red-500/50 transition"><Trash2 size={16} /> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// Main Component
// ==========================================================
export default function TeamSettingPage() {
  const [teams, setTeams] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editTeam, setEditTeam] = useState(null);
  const [deleteTeam, setDeleteTeam] = useState(null);

  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const [userOptions, setUserOptions] = useState([]);

  // 🟢 [BACKEND NOTE]: โหลดรายชื่อ Users และ Teams จาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🟢 โค้ดตัวอย่างสำหรับการดึง Users และข้อมูลตัวเอง
        // const [usersRes, meRes, teamsRes] = await Promise.all([
        //   fetch('/api/users'),
        //   fetch('/api/users/me'),
        //   fetch('/api/teams')
        // ]);
        // const usersData = await usersRes.json();
        // const meData = await meRes.json();
        // const teamsData = await teamsRes.json();

        // 🟢 จัดการข้อมูล User Options เพื่อแสดงใน Checkbox
        // let allUsers = [{ id: meData.id, name: meData.name, role: meData.role, isMe: true }];
        // const others = usersData.map(u => ({ id: u.id, name: u.name, role: u.role, isMe: false }));
        // setUserOptions([...allUsers, ...others]);

        // 🟢 เซ็ตข้อมูล Teams
        // setTeams(teamsData);

        // ======================================================
        // [Mock Processing]: สร้างข้อมูลจำลองเพื่อให้ UI ทำงานได้
        const mockMe = { id: 999, name: "My Name", role: 'Owner', isMe: true };
        const mockOthers = [{ id: 1, name: "Employee A", role: "Employee", isMe: false }];
        setUserOptions([mockMe, ...mockOthers]);
        setTeams([]); 
        // ======================================================

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [isAddOpen, isEditOpen]); // ดึงข้อมูลผู้ใช้ใหม่ทุกครั้งที่เปิด Modal


  const resetForm = () => {
    setTeamName("");
    setTeamDesc("");
    setTeamMembers([]);
    setPlatforms([]);
  };

  const validateTeam = (isEdit = false) => {
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return false;
    }
    const duplicate = teams.some(
      (t) =>
        t.name.toLowerCase() === teamName.trim().toLowerCase() &&
        (!isEdit || t.id !== editTeam?.id)
    );
    if (duplicate) {
      alert("This team name already exists");
      return false;
    }
    if (teamMembers.length === 0) {
      alert("Please select at least one member");
      return false;
    }
    return true;
  };

  // 🟢 [BACKEND NOTE]: สร้างทีมใหม่ผ่าน API
  const handleAddTeam = async () => {
    if (!validateTeam()) return;
    
    const newTeamPayload = {
      name: teamName.trim(),
      desc: teamDesc.trim(),
      members: teamMembers,
      platforms: platforms,
    };

    try {
        // 🟢 [API CALL]:
        // const response = await fetch('/api/teams', {
        //    method: 'POST',
        //    body: JSON.stringify(newTeamPayload)
        // });
        // const createdTeam = await response.json();

        // สมมติว่าได้ response กลับมา
        const newTeam = { ...newTeamPayload, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        
        setTeams((prev) => [...prev, newTeam]);
        resetForm();
        setIsAddOpen(false);
    } catch (error) {
        console.error("Error adding team", error);
    }
  };

  // 🟢 [BACKEND NOTE]: แก้ไขทีมผ่าน API
  const handleSaveEdit = async () => {
    if (!validateTeam(true)) return;

    const updatePayload = {
        name: teamName.trim(),
        desc: teamDesc.trim(),
        members: teamMembers,
        platforms: platforms,
    };

    try {
        // 🟢 [API CALL]:
        // await fetch(`/api/teams/${editTeam.id}`, {
        //    method: 'PUT',
        //    body: JSON.stringify(updatePayload)
        // });

        setTeams((prev) =>
          prev.map((t) => (t.id === editTeam.id ? { ...t, ...updatePayload } : t))
        );
        resetForm();
        setEditTeam(null);
        setIsEditOpen(false);
    } catch (error) {
        console.error("Error updating team", error);
    }
  };

  // 🟢 [BACKEND NOTE]: ลบทีมผ่าน API
  const handleDelete = async (id) => {
    try {
        // 🟢 [API CALL]:
        // await fetch(`/api/teams/${id}`, { method: 'DELETE' });

        setTeams((prev) => prev.filter((team) => team.id !== id));
        setIsDeleteOpen(false);
    } catch (error) {
         console.error("Error deleting team", error);
    }
  };


  const handleOpenDelete = (team) => {
    setDeleteTeam(team);
    setIsDeleteOpen(true);
  };

  const handleOpenEdit = (team) => {
    setEditTeam(team);
    setTeamName(team.name);
    setTeamDesc(team.desc);
    setTeamMembers(team.members);
    setPlatforms(team.platforms || []);
    setIsEditOpen(true);
  };


  // ==========================================================
  // UI ส่วนล่างนี้ไม่มีการดัดแปลงใดๆ โครงสร้าง Component ยังอยู่ครบ 100%
  // ==========================================================
  return (
    <>
      <TeamModal
        isOpen={isAddOpen}
        title="Add Team"
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddTeam}
        teamName={teamName}
        setTeamName={setTeamName}
        teamDesc={teamDesc}
        setTeamDesc={setTeamDesc}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        userOptions={userOptions}
        platforms={platforms}
        setPlatforms={setPlatforms}
      />

      <TeamModal
        isOpen={isEditOpen}
        title="Edit Team"
        onClose={() => { setIsEditOpen(false); setEditTeam(null); }}
        onConfirm={handleSaveEdit}
        teamName={teamName}
        setTeamName={setTeamName}
        teamDesc={teamDesc}
        setTeamDesc={setTeamDesc}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        userOptions={userOptions}
        platforms={platforms}
        setPlatforms={setPlatforms}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        teamName={deleteTeam?.name}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDelete(deleteTeam.id)}
      />

      <div className="w-full h-[94vh] p-2 md:p-4">
        <div className="bg-[rgba(32,41,59,0.37)] border border-[rgba(254,253,253,0.5)] backdrop-blur-xl rounded-3xl shadow-2xl pt-5 px-4 flex flex-col h-full">

          <div className="relative max-w-3xl p-8 pb-0">
            <div className="flex items-center gap-3 mb-8 ">
              <UsersRound className="text-white p-2 bg-white/5 rounded-xl border border-white/10" size={50} />
              <div>
                <h1 className="text-xl font-semibold text-white">Team Setting</h1>
                <p className="text-sm text-white/70">
                  Manage your teams and members.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/28 mx-7 mb-8"></div>

          <div className="flex justify-between items-center w-full mb-6 px-4 gap-4">
            <button onClick={() => { resetForm(); setIsAddOpen(true); }} className="flex items-center text-white bg-[rgba(255,255,255,0.22)] rounded-2xl py-3 px-5 hover:bg-[#ffffff52] cursor-pointer">
              <i className="fa-solid fa-plus mr-2"></i> Add Team
            </button>
            <div className="flex items-center text-white bg-[rgba(255,255,255,0.22)] rounded-2xl py-2 px-4 gap-2 w-[250px]">
              <i className="fa-solid fa-magnifying-glass mr-3"></i>
              <input type="text" className="text-white outline-0 bg-transparent w-full" placeholder="Search Team..." />
            </div>
          </div>

          <div className="flex justify-center items-center px-4">
            {teams.length === 0 ? (
              <div className="flex flex-col items-center text-center p-8 gap-2">
                <i className="fa-solid fa-users-viewfinder text-9xl"></i>
                <h2 className="text-white text-xl font-semibold mb-2">Create your first team</h2>
                <p className="text-gray-400 text-sm max-w-md">Teams can be used to group users together to organize inboxes and contact assignments.</p>
              </div>
            ) : (
              <div className="w-full space-y-4 overflow-y-auto">
                {teams.map((team) => (
                  <div key={team.id} className="bg-[#ffffff21] border border-white/20 rounded-xl p-4 text-white flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-3">
                        {team.name}
                        <div className="flex gap-2">
                          {team.platforms?.includes('line') && <i className="fa-brands fa-line text-[#06c755] text-2xl"></i>}
                          {team.platforms?.includes('facebook') && <i className="fa-brands fa-facebook text-[#1877f2] text-2xl"></i>}
                        </div>
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">{team.desc || "No description"}</p>
                      <p className="text-xs text-gray-300">
                        Members: {team.members.length <= 3 ? team.members.join(", ") : <>{team.members.slice(0, 3).join(", ")} <span className="text-gray-400">+{team.members.length - 3} more</span></>}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenDelete(team)} className="flex items-center gap-1 bg-red-500/30 border border-red-400 text-red-200 rounded-lg px-3 py-1 hover:bg-red-500/50 cursor-pointer"><Trash2 size={16} /> Delete</button>
                      <button onClick={() => handleOpenEdit(team)} className="flex items-center gap-1 bg-white/20 border border-white/40 rounded-lg px-3 py-1 hover:bg-white/30 cursor-pointer"><Edit size={16} /> Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}