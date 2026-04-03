import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { Users } from "../../services/UserServices";
import { Rooms } from "../../services/RoomService";
import { Services } from "../../services/ServiceServices";
import { Orders } from "../../services/OrderServices";
import { Users as UsersIcon, Search, Edit, X, Plus } from "lucide-react";

const navItems = [
  { label: "DASHBOARD", path: "/member/dashboard", icon: "🏠" },
  { label: "BOOK-A-SERVICE", path: "/book-a-service", icon: "✨" },
  { label: "RESERVATIONS", path: "/reservations", icon: "📅" },
  { label: "ORDERS", path: "/orders", icon: "🛍️" },
  { label: "SETTINGS", path: "/member-settings", icon: "👤" }
];

export default function MemberBooking() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [checkOrderData, setCheckOrderData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  {/**User ID Fetch */}
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  {/**DropDown Data */}
  const [staffList, setStaffList] = useState<any[]>([]);
  const [roomList, setRoomList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);

  const [orderInputData, setOrderInputData] = useState<{
    name: string;
    clientId: string;
    staffId: string;
    roomId: string;
    items: { serviceId: string; quantity: number }[];
  }>({
    name: '',
    clientId: '',
    staffId: '',
    roomId: '',
    items: [],
  });

  const openCheckModal = (order: any) => {
    setCheckOrderData(order);
    setShowModal(true);
  };

  const closeCheckModal = () => {
    setShowModal(false);
    setCheckOrderData(null);
  };

  const openCreateModal = async () => {
    setShowCreateModal(true);
    setOrderInputData({ name: '', clientId: '', staffId: '', roomId: '', items: [] });

    // Fetch staff, rooms, services for dropdowns
    const staff = await Users.getUserByRole('staff');
    console.log('Staff data:', staff);
    // Update Rooms With Availability = Available
    const rooms = await Rooms.getAvailableRooms('available');
    const services = await Services.getServices();

    setStaffList(staff || []);
    setRoomList(Array.isArray(rooms) ? rooms : []);
    setServiceList(Array.isArray(services) ? services : []);

    // Auto set clientId from logged in user
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setOrderInputData(prev => ({ ...prev, clientId: user.id }));
    }
  };

  // Helper to add a service to items
  const addItem = (serviceId: string) => {
    setOrderInputData(prev => {
      const exists = prev.items.find((i: any) => i.serviceId === serviceId);
      if (exists) return prev; // already added
      return { ...prev, items: [...prev.items, { serviceId, quantity: 1 }] };
    });
  };

  // Helper to remove a service from items
  const removeItem = (serviceId: string) => {
    setOrderInputData(prev => ({
      ...prev,
      items: prev.items.filter((i: any) => i.serviceId !== serviceId)
    }));
  };

  // Helper to update quantity
  const updateQuantity = (serviceId: string, quantity: number) => {
    setOrderInputData(prev => ({
      ...prev,
      items: prev.items.map((i: any) =>
        i.serviceId === serviceId ? { ...i, quantity } : i
      )
    }));
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setOrderInputData({ name: '', clientId: '', staffId: '', roomId: '', items: [] });
    setStaffList([]);
    setRoomList([]);
    setServiceList([]);
  };


  const handleCreateOrder = async () => {
    if (!orderInputData.name.trim()) {
      alert('Order name is required.');
      return;
    }
    if (orderInputData.items.length === 0) {
      alert('Please add at least one service.');
      return;
    }

    if (!userId) return;

    // Re-check current auth user immediately before final create step
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('User not authenticated. Please sign in again.');
      return;
    }

    const currentUserId = user.id;

    setCreateLoading(true);
    try {
      const result = await Orders.createOrder({
        orderName: orderInputData.name.trim(),
        clientId: currentUserId,
        staffId: orderInputData.staffId || undefined,
        roomId: orderInputData.roomId || undefined,
        items: orderInputData.items,
      });

      if (result) {
        const updated = await Orders.getOrderByUserId(userId);
        setOrderData(Array.isArray(updated.data) ? updated.data : []);
        closeCreateModal();
      } else {
        alert('Failed to create order.');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Error creating order.');
    } finally {
      setCreateLoading(false);
    }
};

  useEffect(() => {
    if (!userId) return;


    const fetchOrders = async () => {
      console.log('Fetching orders for userId:', userId);
      try {
        const results = await Orders.getOrderByUserId(userId);
        console.log('Fetched data:', results.data);
        if (results.error) {
          console.error(results.error);
          setOrderData([]);
        } else {
          setOrderData(Array.isArray(results.data) ? results.data : []);
        }
      } catch (err) {
        console.log('Error Message', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const filteredOrder = orderData.filter(order =>
    `${order.name}`.toLowerCase().includes(searchTerm.toLowerCase())
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
                📦 Orders Management
              </h1>
              <p className="text-slate-400">Manage and control all orders in the system</p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Create Order
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-white mt-2">{orderData.length}</p>
                </div>
                <span className="text-4xl">📦</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold text-white mt-2">{orderData.filter(o => o.order_status === 'pending').length}</p>
                </div>
                <span className="text-4xl">⏳</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                  {/* FIXED: was s.price, orders use order_total */}
                  <p className="text-3xl font-bold text-white mt-2">₱{orderData.reduce((sum, s) => sum + (parseFloat(s.order_total) || 0), 0).toFixed(2)}</p>
                </div>
                <span className="text-4xl">💰</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl mb-8">
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-700">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search orders by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
                    {/* FIXED: was CATEGORY, PRICE, DESCRIPTION */}
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">NAME</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">STATUS</th>
                    <th className="px-6 py-4 text-left text-purple-300 font-semibold text-sm">TOTAL</th>
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
                  ) : filteredOrder.length > 0 ? (
                    filteredOrder.map((order, idx) => (
                      <tr
                        key={order.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-all duration-200 ${
                          idx % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {order.name?.[0] || '?'}
                            </div>
                            <p className="text-white font-medium">{order.name}</p>
                          </div>
                        </td>
                        {/* FIXED: was order.Service?.category */}
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                            {order.order_status || 'N/A'}
                          </span>
                        </td>
                        {/* FIXED: was order.Service?.price */}
                        <td className="px-6 py-4 text-white font-semibold">
                          ₱{parseFloat(order.order_total || '0').toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openCheckModal(order)}
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
                        No Orders found
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
      {showModal && checkOrderData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Edit size={24} className="text-purple-400" />
                Order Details
              </h2>
              <button onClick={closeCheckModal} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Name</p>
                <p className="text-white font-semibold text-lg">{checkOrderData.name}</p>
              </div>
              {/* FIXED: was category, price, description */}
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-white font-semibold text-lg">{checkOrderData.order_status}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Total</p>
                <p className="text-white font-semibold text-lg">₱{parseFloat(checkOrderData.order_total || '0').toFixed(2)}</p>
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


      {/* CREATE ORDER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-lg border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus size={24} className="text-purple-400" />
                Create New Order
              </h2>
              <button onClick={closeCreateModal} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">

              {/* Order Name */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Order Name *</label>
                <input
                  type="text"
                  name="name"
                  value={orderInputData.name}
                  onChange={(e) => setOrderInputData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter order name"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={createLoading}
                />
              </div>

              {/* Staff Dropdown */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Assign Staff</label>
                <select
                  value={orderInputData.staffId}
                  onChange={(e) => setOrderInputData(prev => ({ ...prev, staffId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={createLoading}
                >
                  <option value="">Select staff</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.first_name} {staff.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Dropdown */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Assign Room</label>
                <select
                  value={orderInputData.roomId}
                  onChange={(e) => setOrderInputData(prev => ({ ...prev, roomId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={createLoading}
                >
                  <option value="">Select room</option>
                  {roomList.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Services Picker */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Add Services *</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {serviceList.map((service) => {
                    const addedItem = orderInputData.items.find((i: any) => i.serviceId === service.id);
                    return (
                      <div key={service.id} className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
                        <div>
                          <p className="text-white font-medium">{service.name}</p>
                          <p className="text-slate-400 text-xs">₱{parseFloat(service.price).toFixed(2)}</p>
                        </div>
                        {addedItem ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              value={addedItem.quantity}
                              onChange={(e) => updateQuantity(service.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                              onClick={() => removeItem(service.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(service.id)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Items Summary */}
              {orderInputData.items.length > 0 && (
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <p className="text-slate-400 text-sm mb-2">Selected Services ({orderInputData.items.length})</p>
                  {orderInputData.items.map((item: any) => {
                    const service = serviceList.find(s => s.id === item.serviceId);
                    return (
                      <div key={item.serviceId} className="flex justify-between text-sm">
                        <p className="text-white">{service?.name} x{item.quantity}</p>
                        <p className="text-purple-300">₱{(parseFloat(service?.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCreateOrder}
                disabled={createLoading || !orderInputData.name.trim() || orderInputData.items.length === 0}
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
                    Create Order
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
