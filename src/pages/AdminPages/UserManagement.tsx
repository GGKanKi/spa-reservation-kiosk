import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Users as UsersIcon, Search, Edit, Trash2, Shield, UserCheck, X, Plus } from "lucide-react";
import { Users } from "../../services/UserServices";
import { supabase } from "../../lib/supabase";

const navItems = [
  { label: "DASHBOARD", path: "/admin/dashboard", icon: "📊" },
  { label: "USERS", path: "/admin/user-management", icon: "👥" },
  { label: "STAFFS", path: "/admin/staff-management", icon: "👔" },
  { label: "SERVICES", path: "/admin/service-management", icon: "🔧" },
  { label: "ROOMS", path: "/admin/room-management", icon: "🏠" },
  { label: "ORDERS", path: "/admin/orders", icon: "📦" },
  { label: "PAYMENTS", path: "/admin/payments", icon: "💳" },
  { label: "REPORTS", path: "/admin/reports", icon: "📈" },
  { label: "SETTINGS", path: "/admin/settings", icon: "⚙️" },
];

export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [memberData, setMemberData] = useState<any[]>([]);
  const [checkUserData, setCheckUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const openCheckModal = (user: any) => {
    setCheckUserData(user);
    setShowModal(true);
  };

  const closeCheckModal = () => {
    setShowModal(false);
    setCheckUserData(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const results = await Users.getUserByRole('member');
        if (results) {
          setMemberData(Array.isArray(results) ? results : []);
        } else {
          setMemberData([]);
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
        setMemberData([]);
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current user session:', session);
    };

    checkAuth();
    fetchData();
  }, []);

  const filteredUsers = memberData.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <aside className="w-[280px] min-w-[280px] min-h-screen flex flex-col bg-slate-950 border-r-2 border-purple-500/20 shadow-2xl">
        {/* Logo Section */}
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

        {/* Nav Buttons */}
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

        {/* Logout Button */}
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <UsersIcon size={32} className="text-purple-400" />
              User Management
            </h1>
            <p className="text-slate-400">Manage and control all members in the system</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Members</p>
                  <p className="text-3xl font-bold text-white mt-2">{memberData.length}</p>
                </div>
                <UsersIcon size={40} className="text-purple-400 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Members</p>
                  <p className="text-3xl font-bold text-white mt-2">{memberData.length}</p>
                </div>
                <UserCheck size={40} className="text-green-400 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Staff Members</p>
                  <p className="text-3xl font-bold text-white mt-2">{memberData.filter(u => u.role === 'staff').length}</p>
                </div>
                <Shield size={40} className="text-blue-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl mb-8">
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-700">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">NAME</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">ROLE</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">JOIN DATE</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                        <div className="flex justify-center">
                          <div className="animate-spin">⚙️</div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-all duration-200 ${
                          idx % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {user.first_name[0]}{user.last_name[0]}
                            </div>
                            <div>
                              <p className="text-white font-medium">{`${user.first_name} ${user.last_name}`.trim()}</p>
                              <p className="text-slate-400 text-sm">{user.email_add || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'staff'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openCheckModal(user)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-sm font-medium"
                          >
                            <Edit size={16} />
                            EDIT
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                        No users found
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
      {showModal && checkUserData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Edit size={24} className="text-purple-400" />
                Edit User
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
                <p className="text-white font-semibold text-lg">{checkUserData.first_name} {checkUserData.last_name}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Role</p>
                <p className="text-white font-semibold text-lg capitalize">{checkUserData.role}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Joined</p>
                <p className="text-white font-semibold text-lg">{new Date(checkUserData.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  Users.memberToStaff(checkUserData.id);
                  closeCheckModal();
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                Promote to Staff
              </button>
              <button
                onClick={() => {
                  Users.memberToAdmin(checkUserData.id);
                  closeCheckModal();
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Promote to Admin
              </button>
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
    </div>
  );
}