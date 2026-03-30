import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Rooms } from "../../services/RoomService";
import { Users as UsersIcon, Search, Edit, Trash2, Shield, UserCheck, X, Plus } from "lucide-react";
import { Users } from "../../services/UserServices";
import { supabase } from "../../lib/supabase";

const navItems = [
  { label: "DASHBOARD", path: "/admin/dashboard", icon: "📊" },
  { label: "USERS", path: "/admin/user-management", icon: "👥" },
  { label: "STAFFS", path: "/admin/staff-management", icon: "👔" },
  { label: "SERVICES", path: "/admin/service-management", icon: "🔧" },
  { label: "ROOMS", path: "/admin/room-management", icon: "🏠" },
  { label: "RESERVATION", path: "/admin/reservations"},
  { label: "ORDERS", path: "/admin/orders", icon: "📦" },
  { label: "PAYMENTS", path: "/admin/payments", icon: "💳" },
  { label: "REPORTS", path: "/admin/reports", icon: "📈" },
  { label: "SETTINGS", path: "/admin/settings", icon: "⚙️" },
];

export default function RoomManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [roomData, setRoomData] = useState<any[]>([]);
  const [checkRoomData, setCheckRoomData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [roomInputData, setRoomInputData] = useState({
    name: '',
    assigned_id: '',
    assignee_name: '',
    is_available: ''

  });
  


  const openCheckModal = async (room:any) => {
    setCheckRoomData(room);
    setShowModal(true);
  };


  const closeCheckModal = async () => {
    setShowModal(false);
    setCheckRoomData(null);

  };

  const openCreateModal = async () => {
    setShowCreateModal(true);
    setRoomInputData({
        name: '',
      assigned_id: '',
      assignee_name: '',
      is_available: ''
    });

    const staff = await Users.getUserByRole('staff');

    setStaffList(staff || []);


  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setRoomInputData({
        name: '',
        assigned_id: '',
        assignee_name: '',
        is_available: ''
    });
  };


  const handleDeleteRoom = async(id: string) => {

    if (!confirm('Are you sure you want to delete this room?')) return; 

    try {
      await Rooms.deleteRoom(id);
      const updatedRooms = await Rooms.getRooms();
      setRoomData(Array.isArray(updatedRooms) ? updatedRooms : []);

    } catch (err) {
      console.error('Error Message: ', err)
      alert('Error deleting room.');

    }

  };

  const handleCreateRoom = async () => {
    if (!roomInputData.name.trim()) {
      alert("Room name is required");
      return;
    }

    setCreateLoading(true);
    try {
      const result = await Rooms.createRoom({ 
        name: roomInputData.name.trim(),
        isAvailable: roomInputData.is_available || 'maintenance',
      });
      if (result) {
        // Refresh the room list
        const updatedRooms = await Rooms.getRooms();
        if (updatedRooms) {
          setRoomData(Array.isArray(updatedRooms) ? updatedRooms : []);
        }
        closeCreateModal();
      } else {
        alert("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Error creating room");
    } finally {
      setCreateLoading(false);
    }
  };
  
  
  useEffect(() => {

    const fetchRooms = async () => {

      try {
        const results = await Rooms.getRooms()

        if (results) {
          setRoomData(Array.isArray(results) ? results : []);
        } else {
          setRoomData([]);
        }

      } catch (err) {
        console.log('Error Message', err)
      } finally {
        setLoading(false);
      }


    }
    
  fetchRooms()
  
  }, []);


  const filteredRoom = roomData.filter(room =>
    `${room.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <aside className="w-[280px] min-w-[280px] min-h-screen flex flex-col bg-slate-950 border-r-2 border-purple-500/20 shadow-2xl">
        <div className="p-6 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <UsersIcon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Panel</h1>
              <p className="text-purple-400 text-xs">SPA Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full h-[48px] flex items-center gap-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-purple-400"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-500/10">
          <button
            onClick={() => {
              supabase.auth.signOut();
              navigate("/login");
            }}
            className="w-full h-[48px] flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
          >
            <X size={18} />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                🏠 Room Management
              </h1>
              <p className="text-slate-400">Manage and control all rooms in the system</p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Create Room
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Rooms</p>
                  <p className="text-3xl font-bold text-white mt-2">{roomData.length}</p>
                </div>
                <span className="text-4xl">🏠</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Rooms</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {roomData.filter(r => r.is_available === 'available').length}
                    </p>
                </div>
                <span className="text-4xl">✅</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Occupied Rooms</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {roomData.filter(r => r.is_available === 'reserved' || r.is_available === 'cleaning').length}
                  </p>
                </div>
                <span className="text-4xl">⏳</span>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl mb-8">
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-700">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search rooms by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Rooms Table */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">NAME</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">STAFF ID</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">STAFF NAME</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">AVAILABILITY</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        <div className="flex justify-center">
                          <div className="animate-spin">⚙️</div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRoom.length > 0 ? (
                    filteredRoom.map((room, idx) => (
                      <tr
                        key={room.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-all duration-200 ${
                          idx % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {room.name[0]}
                            </div>
                            <p className="text-white font-medium">{room.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white font-semibold">{room.staff_id || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{room.assigned_name || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            room.is_available === 'available'
                              ? 'bg-green-500/20 text-green-300'
                              : room.is_available === 'maintenance'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : room.is_available === 'reserved'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {room.is_available === 'available' ? 'Available' : 
                             room.is_available === 'maintenance' ? 'Maintenance' :
                             room.is_available === 'reserved' ? 'Reserved' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openCheckModal(room)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-sm font-medium"
                            >
                              <Edit size={16} />
                              EDIT
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-medium">                                <Trash2 size={16} />
                                DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No Rooms found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showModal && checkRoomData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Edit size={24} className="text-purple-400" />
                Room Details
              </h2>
              <button
                onClick={closeCheckModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Name</p>
                <p className="text-white font-semibold text-lg">{checkRoomData.name}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Staff ID</p>
                <p className="text-white font-semibold text-lg">{checkRoomData.assigned_id || 'N/A'}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Staff Name</p>
                <p className="text-white font-semibold text-lg">{checkRoomData.assigned_name || 'N/A'}</p>
              </div>
               <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <p className="text-slate-400 text-sm">Availability</p>
                  <p className="text-white font-semibold text-lg">
                    {checkRoomData.is_available === 'available' ? '✅ Available' : 
                     checkRoomData.is_available === 'maintenance' ? '🔧 Maintenance' :
                     checkRoomData.is_available === 'reserved' ? '📅 Reserved' : '🚫 Unavailable'}
                  </p>
                </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={closeCheckModal}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus size={24} className="text-purple-400" />
                Create New Room
              </h2>
              <button
                onClick={closeCreateModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  value={roomInputData.name}
                  onChange={(e) => setRoomInputData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter room name (e.g., Room 101)"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={createLoading}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Availability Status *
                </label>
                <select
                  value={roomInputData.is_available}
                  onChange={(e) => setRoomInputData(prev => ({ ...prev, is_available: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={createLoading}
                >
                  <option value="">Select status</option>
                  <option value="available">✅ Available</option>
                  <option value="cleaning">🧹 Cleaning</option>
                  <option value="closed">🚫 Closed</option>
                  <option value="reserved">📅 Reserved</option>
                  <option value="maintenance">🔧 Maintenance</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCreateRoom}
                disabled={createLoading || !roomInputData.name.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin">⚙️</div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Room
                  </>
                )}
              </button>
              <button
                onClick={closeCreateModal}
                disabled={createLoading}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}