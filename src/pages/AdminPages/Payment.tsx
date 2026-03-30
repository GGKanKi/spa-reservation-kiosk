import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, use } from "react";
import { Users as UsersIcon, Search, Edit, Trash2, Shield, UserCheck, X, Plus } from "lucide-react";
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

export default function PaymentList() {
  const navigate = useNavigate();
  const location = useLocation();


  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [checkPaymentData, setcheckPaymentData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const openCheckModal = (payment: any) => {
    setcheckPaymentData(payment);
    setShowModal(true);
  };


  const closeCheckModal = () => {
    setcheckPaymentData(null);
    setShowModal(false);
  };

  const filteredService = paymentData.filter(service =>
    `${service.name}`.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              🔧 Payment Management
            </h1>
            <p className="text-slate-400">Manage and control all payment in the system</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Payment</p>
                  <p className="text-3xl font-bold text-white mt-2">{paymentData.length}</p>
                </div>
                <span className="text-4xl">📦</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Payment</p>
                  <p className="text-3xl font-bold text-white mt-2">{paymentData.length}</p>
                </div>
                <span className="text-4xl">✅</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-white mt-2">₱{paymentData.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0).toFixed(2)}</p>
                </div>
                <span className="text-4xl">💰</span>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl mb-8">
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-700">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search payment by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Payment Table */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">NAME</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">CATEGORY</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">PRICE</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">DESCRIPTION</th>
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
                  ) : filteredService.length > 0 ? (
                    filteredService.map((service, idx) => (
                      <tr
                        key={service.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-all duration-200 ${
                          idx % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {service.name[0]}
                            </div>
                            <p className="text-white font-medium">{service.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                            {service.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white font-semibold">₱{parseFloat(service.price).toFixed(2)}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{service.description || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openCheckModal(service)}
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
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No Payment found
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
      {showModal && checkPaymentData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Edit size={24} className="text-purple-400" />
                Service Details
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
                <p className="text-white font-semibold text-lg">{checkPaymentData.name}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Category</p>
                <p className="text-white font-semibold text-lg">{checkPaymentData.category}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Price</p>
                <p className="text-white font-semibold text-lg">₱{parseFloat(checkPaymentData.price).toFixed(2)}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Description</p>
                <p className="text-white font-semibold text-lg">{checkPaymentData.description}</p>
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
    </div>
  );
}
