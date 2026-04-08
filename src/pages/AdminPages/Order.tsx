import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Users } from "../../services/UserServices";
import { Orders } from "../../services/OrderServices";
import { Services } from "../../services/ServiceServices";
import { supabase } from "../../lib/supabase";
import { Users as UsersIcon, Search, Edit, X, Plus } from "lucide-react";
import { Rooms } from "../../services/RoomService";

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

const timeSlots = [
  { label: '9:00 AM - 10:00 AM', start: '09:00', end: '10:00' },
  { label: '10:00 AM - 11:00 AM', start: '10:00', end: '11:00' },
  { label: '11:00 AM - 12:00 PM', start: '11:00', end: '12:00' },
  { label: '1:00 PM - 2:00 PM', start: '13:00', end: '14:00' },
  { label: '2:00 PM - 3:00 PM', start: '14:00', end: '15:00' },
  { label: '3:00 PM - 4:00 PM', start: '15:00', end: '16:00' },
];

export default function OrderList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderData, setOrderData] = useState<any[]>([]);
  const [checkOrderData, setCheckOrderData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [staffList, setStaffList] = useState<any[]>([]);
  const [roomList, setRoomList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);

  {/** SCHEDULE CHECKER */}
  const [slotWarning, setSlotWarning] = useState('');

  const checkSlotConflict = async (date: string, startTime: string) => {
    if (!date || !startTime) return;

    const {data: existingOrders} = await supabase
      .from('Order')
      .select('id, room_id, staff_id, reservation_date, start_time, end_time')
      .eq('reservation_date', date)
      .eq('start_time', startTime)
      .eq('order_status', 'pending');

    if (existingOrders && existingOrders.length > 0) {
      let conflicts = [];

      // Check room conflict if room is selected
      if (orderInputData.roomId) {
        const roomConflict = existingOrders.some((o) => o.room_id === orderInputData.roomId);
        if (roomConflict) conflicts.push('room');
      }

      // Check staff conflict if staff is selected
      if (orderInputData.staffId) {
        const staffConflict = existingOrders.some((o) => o.staff_id === orderInputData.staffId);
        if (staffConflict) conflicts.push('staff');
      }

      if (conflicts.length > 0) {
        setSlotWarning(`⚠️ Conflict detected: ${conflicts.join(' and ')} already booked for this time slot`);
      } else {
        setSlotWarning('');
      }
    } else {
      setSlotWarning('');
    }
  }

  const [orderInputData, setOrderInputData] = useState<{
    name: string;
    clientId: string;
    staffId: string;
    roomId: string;
    items: { serviceId: string; quantity: number }[];
    reservationDate: string;
    startTime: string;
    endTime: string;
  }>({
    name: '',
    clientId: '',
    staffId: '',
    roomId: '',
    items: [],
    reservationDate: '',
    startTime: '',
    endTime: '',
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
    setOrderInputData({ name: '', clientId: '', staffId: '', roomId: '', items: [], reservationDate: '', startTime: '', endTime: '' });

    const staff = await Users.getUserByRole('staff');
    const rooms = await Rooms.getAvailableRooms('available');
    const services = await Services.getServices();

    setStaffList(staff || []);
    setRoomList(Array.isArray(rooms) ? rooms : []);
    setServiceList(Array.isArray(services) ? services : []);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setOrderInputData(prev => ({ ...prev, clientId: user.id }));
    }
  };

  const addItem = (serviceId: string) => {
    setOrderInputData(prev => {
      const exists = prev.items.find((i) => i.serviceId === serviceId);
      if (exists) return prev;
      return { ...prev, items: [...prev.items, { serviceId, quantity: 1 }] };
    });
  };

  const removeItem = (serviceId: string) => {
    setOrderInputData(prev => ({
      ...prev,
      items: prev.items.filter((i) => i.serviceId !== serviceId)
    }));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    setOrderInputData(prev => ({
      ...prev,
      items: prev.items.map((i) =>
        i.serviceId === serviceId ? { ...i, quantity } : i
      )
    }));
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setOrderInputData({ name: '', clientId: '', staffId: '', roomId: '', items: [], reservationDate: '', startTime: '', endTime: '' });
    setStaffList([]);
    setRoomList([]);
    setServiceList([]);
    setSelectedCategory('');
    setSlotWarning('');
  };

  // Calculate total duration from selected services
  const totalDuration = orderInputData.items.reduce((sum, item) => {
    const service = serviceList.find(s => s.id === item.serviceId);
    return sum + ((service?.duration || 60) * item.quantity);
  }, 0);


  // Helper to calculate end time
  const calculateEndTime = (startTime: string, totalMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMins = hours * 60 + minutes + totalMinutes;
    const endHours = Math.floor(totalMins / 60);
    const endMins = totalMins % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
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
    if (!orderInputData.reservationDate) {
      alert('Please select a reservation date.');
      return;
    }
    if (!orderInputData.startTime) {
      alert('Please select a time slot.');
      return;
    }
    if (slotWarning) {
      alert('Please resolve the scheduling conflict before creating the order.');
      return;
    }

    setCreateLoading(true);
    try {
      const result = await Orders.createOrder({
        orderName: orderInputData.name.trim(),
        clientId: orderInputData.clientId,
        staffId: orderInputData.staffId || undefined,
        roomId: orderInputData.roomId || undefined,
        items: orderInputData.items,
        reservationDate: orderInputData.reservationDate,
        startTime: orderInputData.startTime,
        endTime: orderInputData.endTime,
      });

      if (result) {
        const updated = await Orders.getOrders();
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
    if (orderInputData.startTime && totalDuration > 0) {
      setOrderInputData(prev => ({ ...prev, endTime: calculateEndTime(orderInputData.startTime, totalDuration) }));
    }
  }, [orderInputData.startTime, totalDuration]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const results = await Orders.getOrders();
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
  }, []);

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
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                            {order.order_status || 'N/A'}
                          </span>
                        </td>
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
                  onChange={(e) => {
                    setOrderInputData(prev => ({ ...prev, staffId: e.target.value }));
                    checkSlotConflict(orderInputData.reservationDate, orderInputData.startTime);
                  }}
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
                  onChange={(e) => {
                    setOrderInputData(prev => ({ ...prev, roomId: e.target.value }));
                    checkSlotConflict(orderInputData.reservationDate, orderInputData.startTime);
                  }}
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

              {/* Services - Category Filter + List */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Add Services *</label>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                >
                  <option value="">All Categories</option>
                  <option value="massage">Massage</option>
                  <option value="spa">Spa</option>
                  <option value="facial">Facial</option>
                  <option value="body_wrap">Body Wrap</option>
                  <option value="nail_care">Nail Care</option>
                  <option value="aromatherapy">Aromatherapy</option>
                  <option value="bundle">Bundle</option>
                </select>

                {/* Services List filtered by category */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {serviceList
                    .filter(s => selectedCategory === '' || s.category === selectedCategory)
                    .map((service) => {
                      const alreadyAdded = orderInputData.items.find(i => i.serviceId === service.id);
                      return (
                        <div key={service.id} className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
                          <div>
                            <p className="text-white text-sm font-medium">{service.name}</p>
                            <p className="text-slate-400 text-xs">₱{parseFloat(service.price).toFixed(2)}</p>
                          </div>
                          {alreadyAdded ? (
                            <span className="text-green-400 text-xs font-medium">✓ Added</span>
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

                {/* Selected Services */}
                {orderInputData.items.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-slate-400 text-xs">Selected Services:</p>
                    {orderInputData.items.map((item) => {
                      const service = serviceList.find(s => s.id === item.serviceId);
                      return (
                        <div key={item.serviceId} className="flex items-center justify-between bg-slate-700/30 border border-slate-600/50 rounded-lg px-3 py-2">
                          <div>
                            <p className="text-white text-sm">{service?.name}</p>
                            <p className="text-purple-300 text-xs">₱{(parseFloat(service?.price || 0) * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.serviceId, Number(e.target.value))}
                              className="w-14 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-center text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                            <button
                              onClick={() => removeItem(item.serviceId)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Duration Summary*/}
              {orderInputData.items.length > 0 && (
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 mt-3">
                  <p className="text-slate-400 text-xs">Estimated Duration</p>
                  <p className="text-white font-semibold">
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    {orderInputData.startTime && orderInputData.endTime && (
                      <span className="text-purple-300 text-sm ml-2">
                        ({orderInputData.startTime} - {orderInputData.endTime})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Reservation Date */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Reservation Date *</label>
                <input
                  type="date"
                  value={orderInputData.reservationDate}
                  onChange={(e) => {
                    setOrderInputData(prev => ({ ...prev, reservationDate: e.target.value }));
                    checkSlotConflict(e.target.value, orderInputData.startTime);
                  }}
                  min={today}
                  max={maxDate}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={createLoading}
                />
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Select Time Slot *</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.start}
                      onClick={() => {
                        setOrderInputData(prev => ({
                          ...prev,
                          startTime: slot.start,
                        }));
                        checkSlotConflict(orderInputData.reservationDate, slot.start);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        orderInputData.startTime === slot.start
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-purple-500'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Warning */}
              {slotWarning && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                  <p className="text-yellow-300 text-sm">{slotWarning}</p>
                </div>
              )}

            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCreateOrder}
                disabled={!!(createLoading || !orderInputData.name.trim() || orderInputData.items.length === 0 || slotWarning)}
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