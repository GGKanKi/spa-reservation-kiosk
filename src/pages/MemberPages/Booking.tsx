import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { Users } from "../../services/UserServices";
import { Rooms } from "../../services/RoomService";
import { Services } from "../../services/ServiceServices";
import { Orders } from "../../services/OrderServices";
import { Users as UsersIcon, X, Plus, ArrowLeft, ShoppingCart, Sparkles } from "lucide-react";
import type { ServiceCategory } from "../../types/database.types";

// Navigation Icons
import { MdDashboard, MdSettings } from "react-icons/md";
import { FaSpa, FaCalendarAlt, FaShoppingBag } from "react-icons/fa";
import { BsStars } from "react-icons/bs";


// Status Icons
import { FaBoxOpen, FaClock, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";

// Category Icons
import { LuWind, LuWaves, LuSparkles, LuLeaf, LuHand, LuFlower2, LuPackage } from 'react-icons/lu';


const navItems = [
  { label: "DASHBOARD", path: "/member/dashboard",  icon: <MdDashboard /> },
  { label: "BOOK-A-SERVICE", path: "/book-a-service", icon: <BsStars /> },
  { label: "ORDERS", path: "/orders", icon: <FaShoppingBag /> },
  { label: "SETTINGS", path: "/member-settings", icon: <MdSettings /> }
];

interface CategoryItem {
  id: ServiceCategory;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'massage', name: 'Massage', icon: <LuWind />, color: 'from-blue-500 to-blue-600', description: 'Relaxing massage therapies' },
  { id: 'spa', name: 'Spa', icon: <LuWaves />, color: 'from-purple-500 to-purple-600', description: 'Full body spa treatments' },
  { id: 'facial', name: 'Facial', icon: <LuSparkles />, color: 'from-pink-500 to-pink-600', description: 'Skin care & facial treatments' },
  { id: 'body_wrap', name: 'Body Wrap', icon: <LuLeaf />, color: 'from-green-500 to-green-600', description: 'Body wrapping treatments' },
  { id: 'nail_care', name: 'Nail Care', icon: <LuHand />, color: 'from-red-500 to-red-600', description: 'Nail and manicure services' },
  { id: 'aromatherapy', name: 'Aromatherapy', icon: <LuFlower2 />, color: 'from-amber-500 to-amber-600', description: 'Aromatherapy sessions' },
  { id: 'bundle', name: 'Bundles', icon: <LuPackage />, color: 'from-indigo-500 to-indigo-600', description: 'Package deals & bundles' }
];

export default function MemberBooking() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [checkoutData, setCheckoutData] = useState<{
    name: string;
    reservationDate: string;
    startTime: string;
    staffId: string;
    roomId: string;
  }>({
    name: '',
    reservationDate: '',
    startTime: '',
    staffId: '',
    roomId: '',
  });

  const [staffList, setStaffList] = useState<any[]>([]);
  const [roomList, setRoomList] = useState<any[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const timeSlots = [
    { label: '9:00 AM - 10:00 AM', start: '09:00', end: '10:00' },
    { label: '10:00 AM - 11:00 AM', start: '10:00', end: '11:00' },
    { label: '11:00 AM - 12:00 PM', start: '11:00', end: '12:00' },
    { label: '1:00 PM - 2:00 PM', start: '13:00', end: '14:00' },
    { label: '2:00 PM - 3:00 PM', start: '14:00', end: '15:00' },
    { label: '3:00 PM - 4:00 PM', start: '15:00', end: '16:00' },
  ];

  // Get services for selected category
  const categoryServices = selectedCategory
    ? allServices.filter(s => s.category === selectedCategory)
    : [];

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const estimatedDuration = cart.reduce((sum, item) => sum + ((item.service.duration || 60) * item.quantity), 0);

  // User ID Fetch
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch all services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await Services.getServices();
        setAllServices(Array.isArray(services) ? services : []);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();
  }, []);

  // Add service to cart
  const addToCart = (service: any) => {
    const exists = cart.find(item => item.service.id === service.id);
    if (exists) {
      setCart(cart.map(item =>
        item.service.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { service, quantity: 1 }]);
    }
  };

  // Remove service from cart
  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter(item => item.service.id !== serviceId));
  };

  // Update quantity
  const updateCartQuantity = (serviceId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(serviceId);
    } else {
      setCart(cart.map(item =>
        item.service.id === serviceId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Open checkout modal
  const openCheckout = async () => {
    if (cart.length === 0) {
      alert('Please add services to your cart');
      return;
    }

    const staff = await Users.getUserByRole('staff');
    const rooms = await Rooms.getAvailableRooms('available');

    setStaffList(staff || []);
    setRoomList(Array.isArray(rooms) ? rooms : []);
    setShowCheckoutModal(true);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!checkoutData.name.trim()) {
      alert('Please enter a booking name');
      return;
    }
    if (!checkoutData.reservationDate) {
      alert('Please select a reservation date');
      return;
    }
    if (!checkoutData.startTime) {
      alert('Please select a time slot');
      return;
    }

    if (!userId) return;

    setCheckoutLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('User not authenticated');
        return;
      }

      // Calculate end time
      const [hours, minutes] = checkoutData.startTime.split(':').map(Number);
      const totalMins = hours * 60 + minutes + estimatedDuration;
      const endHours = Math.floor(totalMins / 60);
      const endMins = totalMins % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

      const result = await Orders.createOrder({
        orderName: checkoutData.name,
        clientId: user.id,
        staffId: checkoutData.staffId || undefined,
        roomId: checkoutData.roomId || undefined,
        items: cart.map(item => ({ serviceId: item.service.id, quantity: item.quantity })),
        reservationDate: checkoutData.reservationDate,
        startTime: checkoutData.startTime,
        endTime: endTime,
      });

      if (result.error) {
        alert(`Failed to create booking: ${result.error}`);
      } else {
        alert('Booking created successfully!');
        setCart([]);
        setCheckoutData({ name: '', reservationDate: '', startTime: '', staffId: '', roomId: '' });
        setShowCheckoutModal(false);
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Error creating booking');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const closeCheckout = () => {
    setShowCheckoutModal(false);
    setCheckoutData({ name: '', reservationDate: '', startTime: '', staffId: '', roomId: '' });
  };

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
        <div className="max-w-7xl mx-auto">
          {!selectedCategory ? (
            <>
              {/* Header */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                      <Sparkles size={40} className="text-purple-400" />
                      Book a Service
                    </h1>
                    <p className="text-slate-400 text-lg">Choose a category and explore our premium services</p>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={openCheckout}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg relative"
                    >
                      <ShoppingCart size={20} />
                      Cart ({cart.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="group h-48 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-purple-500/20 shadow-lg overflow-hidden hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className="relative h-full flex flex-col items-center justify-center p-6 z-10">
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-slate-400 text-sm text-center group-hover:text-slate-300 transition-colors">
                        {category.description}
                      </p>
                      <div className="mt-4 text-purple-400 group-hover:text-purple-300 transition-colors flex items-center gap-1">
                        <span className="text-sm font-medium">Browse</span>
                        <span>→</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Service Catalog View */}
              <div className="mb-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 text-lg"
                >
                  <ArrowLeft size={20} />
                  Back to Categories
                </button>

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.name} Services
                    </h1>
                    <p className="text-slate-400">
                      Select services to add to your booking
                    </p>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={openCheckout}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                    >
                      <ShoppingCart size={20} />
                      Cart ({cart.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {categoryServices.length > 0 ? (
                  categoryServices.map((service) => {
                    const inCart = cart.find(item => item.service.id === service.id);
                    return (
                      <div
                        key={service.id}
                        className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-lg overflow-hidden hover:shadow-xl hover:border-purple-500/50 transition-all duration-300"
                      >
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                          <p className="text-slate-400 text-sm mb-4">{service.description}</p>

                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-sm">Price</span>
                              <span className="text-purple-300 font-semibold text-lg">
                                ₱{parseFloat(service.price).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-sm">Duration</span>
                              <span className="text-slate-300 text-sm">
                                {service.duration || 60} minutes
                              </span>
                            </div>
                          </div>

                          {inCart ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-2">
                                <button
                                  onClick={() => updateCartQuantity(service.id, inCart.quantity - 1)}
                                  className="text-slate-400 hover:text-white transition-colors px-2"
                                >
                                  −
                                </button>
                                <span className="text-white font-semibold">{inCart.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(service.id, inCart.quantity + 1)}
                                  className="text-slate-400 hover:text-white transition-colors px-2"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(service.id)}
                                className="w-full py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(service)}
                              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                            >
                              <Plus size={18} />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-slate-400 text-lg">No services available in this category</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-lg border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShoppingCart size={24} className="text-purple-400" />
                Confirm Booking
              </h2>
              <button onClick={closeCheckout} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Cart Summary */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 mb-6">
              <h3 className="text-purple-300 font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.service.id} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {item.service.name} x{item.quantity}
                    </span>
                    <span className="text-purple-300 font-medium">
                      ₱{(item.service.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-600/50 mt-3 pt-3">
                <div className="flex justify-between font-bold text-white">
                  <span>Total:</span>
                  <span className="text-purple-300">₱{cartTotal.toFixed(2)}</span>
                </div>
                <div className="text-slate-400 text-sm mt-2">
                  Estimated Duration: {Math.floor(estimatedDuration / 60)}h {estimatedDuration % 60}m
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Booking Name */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Booking Name *</label>
                <input
                  type="text"
                  value={checkoutData.name}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter booking name"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={checkoutLoading}
                />
              </div>

              {/* Staff Selection */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Assign Staff</label>
                <select
                  value={checkoutData.staffId}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, staffId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={checkoutLoading}
                >
                  <option value="">Select staff (optional)</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.first_name} {staff.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Assign Room</label>
                <select
                  value={checkoutData.roomId}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, roomId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={checkoutLoading}
                >
                  <option value="">Select room (optional)</option>
                  {roomList.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reservation Date */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Reservation Date *</label>
                <input
                  type="date"
                  value={checkoutData.reservationDate}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, reservationDate: e.target.value }))}
                  min={today}
                  max={maxDate}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={checkoutLoading}
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Time Slot *</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.start}
                      onClick={() => setCheckoutData(prev => ({ ...prev, startTime: slot.start }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${checkoutData.startTime === slot.start
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-purple-500'
                        }`}
                      disabled={checkoutLoading}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={!!(checkoutLoading || !checkoutData.name.trim() || !checkoutData.reservationDate || !checkoutData.startTime)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {checkoutLoading ? (
                  <>
                    <div className="animate-spin">⚙️</div>
                    Confirming...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Confirm Booking
                  </>
                )}
              </button>
              <button
                onClick={closeCheckout}
                disabled={checkoutLoading}
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

