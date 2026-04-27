import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { Users as UsersIcon, X, ShoppingBag, Clock, CheckCircle, XCircle, Calendar, LayoutDashboard } from "lucide-react";
import { Orders } from "../../services/OrderServices";

// Navigation Icons
import { MdDashboard, MdSettings } from "react-icons/md";
import { FaSpa, FaCalendarAlt, FaShoppingBag } from "react-icons/fa";
import { BsStars } from "react-icons/bs";

const navItems = [
  { label: "DASHBOARD", path: "/member/dashboard",  icon: <MdDashboard /> },
  { label: "BOOK-A-SERVICE", path: "/book-a-service", icon: <BsStars /> },
  { label: "ORDERS", path: "/orders", icon: <FaShoppingBag /> },
  { label: "SETTINGS", path: "/member-settings", icon: <MdSettings /> }
];


export default function MemberDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("USER");
  const [userId, setUserId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const firstName = user.user_metadata?.first_name || "";
        const lastName = user.user_metadata?.last_name || "";
        setFullName(`${firstName} ${lastName}`.trim() || "USER");
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchOrders = async () => {
      try {
        const results = await Orders.getOrderByUserId(userId);
        if (!results.error) {
          setOrderData(Array.isArray(results.data) ? results.data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const pendingOrders = orderData.filter(o => o.order_status === 'pending');
  const completedOrders = orderData.filter(o => o.order_status === 'completed');
  const cancelledOrders = orderData.filter(o => o.order_status === 'cancelled');
  const totalSpent = completedOrders.reduce((sum, o) => sum + (parseFloat(o.order_total) || 0), 0);

  // Get upcoming orders (pending + has reservation date)
  const upcomingOrders = orderData
    .filter(o => o.order_status === 'pending' && o.reservation_date)
    .sort((a, b) => new Date(a.reservation_date).getTime() - new Date(b.reservation_date).getTime())
    .slice(0, 3);

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
              <h1 className="text-white font-bold text-lg">Member Panel</h1>
              <p className="text-purple-400 text-xs">SPA</p>
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
            onClick={() => { supabase.auth.signOut(); navigate("/login"); }}
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
              <LayoutDashboard className="text-purple-400" size={36} />
              Dashboard
            </h1>
            <p className="text-slate-400">Welcome back, {fullName}! Here's an overview of your spa activity.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-medium uppercase">Total Orders</p>
                <ShoppingBag size={20} className="text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white">{orderData.length}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-medium uppercase">Pending</p>
                <Clock size={20} className="text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-yellow-400">{pendingOrders.length}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-medium uppercase">Completed</p>
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">{completedOrders.length}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-medium uppercase">Total Spent</p>
                <span className="text-purple-400 font-bold text-sm">₱</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">₱{totalSpent.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Appointments */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-6 border-b border-purple-500/10 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar size={24} className="text-purple-400" />
                  Upcoming Appointments
                </h2>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300 hover:underline transition-colors"
                >
                  View All →
                </button>
              </div>

              {upcomingOrders.length > 0 ? (
                <div className="space-y-4">
                  {upcomingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-white text-lg">{order.name}</p>
                        <p className="text-slate-400 text-sm mt-1">
                          {order.reservation_date} · {order.start_time} - {order.end_time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-400 text-lg">₱{parseFloat(order.order_total || '0').toFixed(2)}</p>
                        <span className="inline-block mt-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-500/30">
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm mb-4">No upcoming appointments</p>
                  <button
                    onClick={() => navigate('/book-a-service')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                  >
                    Book a Service
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl h-fit">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-purple-500/10 pb-4">
                Quick Actions
              </h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate('/book-a-service')}
                  className="w-full py-4 flex flex-col items-center justify-center gap-2
                    bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg
                    hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg font-semibold"
                >
                  <span className="text-3xl">✨</span>
                  <span className="text-sm">Book a Service</span>
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full py-4 flex flex-col items-center justify-center gap-2
                    bg-slate-700/50 text-white rounded-lg border border-slate-600
                    hover:bg-slate-600 transition-all duration-200 shadow-lg font-semibold"
                >
                  <span className="text-3xl">🛍️</span>
                  <span className="text-sm">My Orders</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}