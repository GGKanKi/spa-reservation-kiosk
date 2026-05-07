import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// React Icons
import { MdDashboard, MdSettings, MdPayment } from "react-icons/md";
import { FaCalendarAlt, FaSignOutAlt, FaUserTie } from "react-icons/fa";

const navItems = [
  { label: "DASHBOARD", path: "/staff/dashboard", icon: <MdDashboard size={20} /> },
  { label: "SCHEDULE", path: "/staff/schedule", icon: <FaCalendarAlt size={20} /> },
  { label: "TRANSACTIONS", path: "/staff/transactions", icon: <MdPayment size={20} /> },
  { label: "SETTINGS", path: "/staff-settings", icon: <MdSettings size={20} /> }
];

export default function Transaction() {
  const navigate = useNavigate();
  const location = useLocation();

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
            onClick={() => { supabase.auth.signOut(); navigate("/login"); }}
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <MdPayment size={40} className="text-purple-400" />
              Transactions
            </h1>
            <p className="text-slate-400">View your completed sessions and transaction history</p>
          </div>

          {/* Placeholder content */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-xl p-8 text-center">
            <MdPayment size={64} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No transactions yet</p>
          </div>
        </div>
      </main>
    </div>
  );
}