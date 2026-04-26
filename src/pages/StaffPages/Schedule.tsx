import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Users } from "../../services/UserServices";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Orders } from "../../services/OrderServices";
import { Users as UsersIcon, X, Calendar, Edit } from "lucide-react";

const navItems = [
  { label: "DASHBOARD", path: "/staff/dashboard", icon: "🏠" },
  { label: "SCHEDULE", path: "/staff/schedule", icon: "📅" },
  { label: "TRANSACTIONS", path: "/staff/transactions", icon: "💳" },
  { label: "SETTINGS", path: "/staff-settings", icon: "👤" }
];

export default function ClientList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState<string | null>(null);
  const [assignedRoom, setAssignedRoom] = useState<any[]>([]);
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const openCheckModal = (room: any) => {
    setShowModal(true);
  };

  const closeCheckModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchRoomAssigned = async () => {
      try {
        setLoading(true);
        const results = await Orders.getPayedOrders('paid');

        if (results.error) {
          console.error(results.error);
          setAssignedRoom([]);
          return;
        }

        const orders = Array.isArray(results.data) ? results.data : [];
        setAssignedRoom(orders);

        // Fetch client names
        orders.forEach(async (res) => {
          try {
            const profile = await Users.getUserProfile(res.client_id);
            const name = profile.data?.first_name || "Unknown Client";
            setClientNames(prev => ({
              ...prev,
              [res.client_id]: name
            }));
          } catch (err) {
            console.error("Failed to fetch name for", res.client_id);
          }
        });

      } catch (err) {
        console.error('Error Message:', err);
        setAssignedRoom([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAssigned();
  }, [userId]);

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
              <UsersIcon size={24} className="text-white" />
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
                className={`w-full h-[48px] flex items-center gap-3 px-4 rounded-lg transition-all duration-200 ${isActive
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
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Calendar className="text-purple-400" size={36} />
              Assigned Rooms
            </h1>
            <p className="text-slate-400">View and manage the assigned rooms schedule.</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">NAME</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">CLIENT NAME</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedRoom && assignedRoom.length > 0 ? (
                    assignedRoom.map((room, idx) => (
                      <tr
                        key={room.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-all duration-200 ${idx % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                          }`}
                      >
                        <td className="px-6 py-4 text-white font-medium">{room.name}</td>
                        <td className="px-6 py-4 text-slate-300">{clientNames[room.client_id] || "Fetching name..."}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openCheckModal(room)}
                            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-purple-500 bg-transparent text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 text-sm font-semibold"
                          >
                            <Edit size={16} />
                            EDIT
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                        No assigned rooms found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}