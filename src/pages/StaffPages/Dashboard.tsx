import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Users as UsersIcon, X, LayoutDashboard } from "lucide-react";

// React Icons
import { MdDashboard, MdSettings, MdPayment } from "react-icons/md";
import { FaCalendarAlt, FaSignOutAlt, FaUserTie } from "react-icons/fa";
import { BsStars } from "react-icons/bs";

const navItems = [
  { label: "DASHBOARD", path: "/staff/dashboard", icon: <MdDashboard size={20} /> },
  { label: "SCHEDULE", path: "/staff/schedule", icon: <FaCalendarAlt size={20} /> },
  { label: "TRANSACTIONS", path: "/staff/transactions", icon: <MdPayment size={20} /> },
  { label: "SETTINGS", path: "/staff-settings", icon: <MdSettings size={20} /> }
];

export default function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setfullName] = useState("USER");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata) {
        const firstName = user.user_metadata.first_name || "";
        const lastName = user.user_metadata.last_name || "";
        setfullName(`${firstName} ${lastName}`.trim() || "USER");
      }
      setLoading(false);
    };
    getUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <aside className="w-[280px] min-w-[280px] min-h-screen flex flex-col bg-slate-950 border-r-2 border-purple-500/20 shadow-2xl">
        <div className="p-6 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FaUserTie size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Staff Panel</h1>
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
            <FaSignOutAlt size={18} />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <MdDashboard size={40} className="text-purple-400" />
                  Staff Dashboard
                </h1>
                <p className="text-slate-400 text-lg">Welcome back, {fullName}! Here's your overview for today.</p>
              </div>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-purple-500/20 shadow-lg overflow-hidden p-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FaUserTie size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Welcome, {fullName}!
                </h2>
                <p className="text-slate-400">
                  You can manage your schedules and check transactions from the sidebar.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Nav Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/staff/schedule')}
              className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-purple-500/20 shadow-lg overflow-hidden hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 p-6 text-left"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FaCalendarAlt size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  My Schedule
                </h3>
              </div>
              <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                View your assigned appointments and daily schedule
              </p>
              <div className="mt-4 text-purple-400 group-hover:text-purple-300 transition-colors flex items-center gap-1">
                <span className="text-sm font-medium">View Schedule</span>
                <span>→</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/staff/transactions')}
              className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-purple-500/20 shadow-lg overflow-hidden hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 p-6 text-left"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <MdPayment size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Transactions
                </h3>
              </div>
              <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                Check your completed sessions and transaction history
              </p>
              <div className="mt-4 text-purple-400 group-hover:text-purple-300 transition-colors flex items-center gap-1">
                <span className="text-sm font-medium">View Transactions</span>
                <span>→</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/staff-settings')}
              className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-purple-500/20 shadow-lg overflow-hidden hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 p-6 text-left"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <MdSettings size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Settings
                </h3>
              </div>
              <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                Manage your profile and account settings
              </p>
              <div className="mt-4 text-purple-400 group-hover:text-purple-300 transition-colors flex items-center gap-1">
                <span className="text-sm font-medium">Go to Settings</span>
                <span>→</span>
              </div>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}