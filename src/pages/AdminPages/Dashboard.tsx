import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { Users as UsersIcon, Home, Zap, ShoppingCart, TrendingUp, ArrowRight, X } from "lucide-react";

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("Admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.user_metadata) {
          const firstName = user.user_metadata.first_name || "";
          const lastName = user.user_metadata.last_name || "";
          setFullName(`${firstName} ${lastName}`.trim() || "Admin");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Mock data - Replace with actual API calls
  const dashboardStats = [
    { label: "Total Users", value: "156", icon: "👥", color: "from-blue-600 to-blue-400" },
    { label: "Active Rooms", value: "24", icon: "🏠", color: "from-green-600 to-green-400" },
    { label: "Total Services", value: "18", icon: "🔧", color: "from-purple-600 to-purple-400" },
    { label: "Pending Orders", value: "8", icon: "📦", color: "from-orange-600 to-orange-400" },
  ];

  const recentActivity = [
    { id: 1, type: "New User", description: "John Doe registered", time: "2 mins ago", status: "success" },
    { id: 2, type: "New Order", description: "Order #12345 placed", time: "15 mins ago", status: "pending" },
    { id: 3, type: "Payment", description: "Payment received ₱5,000", time: "1 hour ago", status: "success" },
    { id: 4, type: "Room Booked", description: "Room A-101 reserved", time: "2 hours ago", status: "success" },
    { id: 5, type: "New Staff", description: "Maria Santos added", time: "3 hours ago", status: "pending" },
  ];

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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              📊 Dashboard
            </h1>
            <p className="text-slate-400">Welcome back, {fullName}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <span className="text-4xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ⚡ Quick Actions
              </h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate("/admin/orders")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-between">
                  View All Orders
                  <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => navigate("/admin/user-management")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-between">
                  Manage Users
                  <ArrowRight size={18} />
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-between">
                  View Payments
                  <ArrowRight size={18} />
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center justify-between">
                  Generate Reports
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🔧 System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <span className="text-slate-300">Database</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">✅ Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <span className="text-slate-300">API Server</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">✅ Online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <span className="text-slate-300">Storage</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">✅ Healthy</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <span className="text-slate-300">Backup</span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">⏳ Running</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20 px-8 py-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                📈 Recent Activity
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-8 py-4 text-left text-purple-300 font-semibold text-sm">TYPE</th>
                    <th className="px-8 py-4 text-left text-purple-300 font-semibold text-sm">DESCRIPTION</th>
                    <th className="px-8 py-4 text-left text-purple-300 font-semibold text-sm">TIME</th>
                    <th className="px-8 py-4 text-left text-purple-300 font-semibold text-sm">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, idx) => (
                    <tr
                      key={activity.id}
                      className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-all duration-200 ${
                        idx % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                      }`}
                    >
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                          {activity.type}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-white font-medium">{activity.description}</td>
                      <td className="px-8 py-4 text-slate-400 text-sm">{activity.time}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.status === 'success'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {activity.status === 'success' ? '✅ Complete' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
