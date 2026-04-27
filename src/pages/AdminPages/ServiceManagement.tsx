import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Services } from "../../services/ServiceServices";
import { useState, useEffect } from "react";
import { Users as UsersIcon, Search, Edit, Trash2, Shield, UserCheck, X, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";

// React Icons
import { MdDashboard, MdPeople, MdSettings, MdPayment, MdAssessment } from "react-icons/md";
import { FaUserTie, FaSpa, FaDoorOpen, FaBoxOpen } from "react-icons/fa";



const navItems = [
  { label: "DASHBOARD", path: "/admin/dashboard", icon: <MdDashboard size={20} /> },
  { label: "USERS", path: "/admin/user-management", icon: <MdPeople size={20} /> },
  { label: "STAFFS", path: "/admin/staff-management", icon: <FaUserTie size={20} /> },
  { label: "SERVICES", path: "/admin/service-management", icon: <FaSpa size={20} /> },
  { label: "ROOMS", path: "/admin/room-management", icon: <FaDoorOpen size={20} /> },
  { label: "ORDERS", path: "/admin/orders", icon: <FaBoxOpen size={20} /> },
  { label: "PAYMENTS", path: "/admin/payments", icon: <MdPayment size={20} /> },
  { label: "REPORTS", path: "/admin/reports", icon: <MdAssessment size={20} /> },
  { label: "SETTINGS", path: "/admin/settings", icon: <MdSettings size={20} /> },
];



export default function ServiceManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [serviceData, setServiceData] = useState<any[]>([]);
  const [checkServiceData, setCheckServiceData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [serviceInputData, setServiceInput] = useState<{
    name: string;
    category: string;
    price: string;
    description: string;
    duration: number;
  }>({
    name: '',
    category: '',
    price: '',
    description: '',
    duration: 60,
  });

  const openCheckModal = (service: any) => {
    setCheckServiceData(service);
    setShowModal(true);
  };

  const closeCheckModal = () => {
    setShowModal(false);
    setCheckServiceData(null);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    setServiceInput({ name: '', category: '', price: '', description: '', duration: 60 });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setServiceInput({ name: '', category: '', price: '', description: '', duration: 60 });
  };


  const handleCreateService = async () => {

    if  (!serviceInputData.name.trim()) {
      alert('Service name is requirec.');
      return;
    }

    setCreateLoading(true);
    try {
      const result = await Services.createService({
          name: serviceInputData.name.trim(),
          category: serviceInputData.category.trim(),
          price: Number(serviceInputData.price),
          description: serviceInputData.description.trim(),
          duration: Number(serviceInputData.duration),
      });
      if (result) {
        const updatedService = await Services.getServices();
        if (updatedService) {
          setServiceData(Array.isArray(updatedService) ? updatedService : []);
        }
        closeCreateModal();
      } else {
        alert('Failed to create new Service')
      }
    } catch (err) {
      console.error('Error Creating Service')
      alert('Error Creating Service.')
    } finally {
      setCreateLoading(false)
    }

  };

  const handleDeleteService = async (id: string) => {
    console.log('Deleting service with id:', id); 
    
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await Services.deleteService(id);
      const updatedService = await Services.getServices();
      setServiceData(Array.isArray(updatedService) ? updatedService : []);
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Error deleting service.');
    }
  };



  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const results = await Services.getServices();

        if (results) {
          setServiceData(Array.isArray(results) ? results : []);
        } else {
          setServiceData([]);
        }
      } catch (err) {
        console.log('Error Message: ', err);
        setServiceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredService = serviceData.filter(service =>
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
          <div className="mb-8 flex justify-between items-center">
            <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              🔧 Service Management
            </h1>
            <p className="text-slate-400">Manage and control all services in the system</p>
           </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg">
              <Plus size={20} />
              Create Service
          </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Services</p>
                  <p className="text-3xl font-bold text-white mt-2">{serviceData.length}</p>
                </div>
                <span className="text-4xl">📦</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Services</p>
                  <p className="text-3xl font-bold text-white mt-2">{serviceData.length}</p>
                </div>
                <span className="text-4xl">✅</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-white mt-2">₱{serviceData.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0).toFixed(2)}</p>
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
                placeholder="Search services by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Services Table */}
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
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openCheckModal(service)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-sm font-medium"
                            >
                              <Edit size={16} />
                              EDIT
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-sm font-medium">
                                <Trash2 size={16} />
                                DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No services found
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
      {showModal && checkServiceData && (
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
                <p className="text-white font-semibold text-lg">{checkServiceData.name}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Category</p>
                <p className="text-white font-semibold text-lg">{checkServiceData.category}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Price</p>
                <p className="text-white font-semibold text-lg">₱{parseFloat(checkServiceData.price).toFixed(2)}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-400 text-sm">Description</p>
                <p className="text-white font-semibold text-lg">{checkServiceData.description}</p>
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


      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus size={24} className="text-purple-400" />
                Create New Service
              </h2>
              <button
                onClick={closeCreateModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={serviceInputData.name}
                  onChange={(e) => setServiceInput(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  placeholder="Enter service name"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={createLoading}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Service Category *
                </label>
                <select
                  name="category"
                  value={serviceInputData.category}
                  onChange={(e) => setServiceInput(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={createLoading}
                >
                  <option value="">Select category</option>
                  <option value="massage">Massage</option>
                  <option value="spa">Spa</option>
                  <option value="facial">Facial</option>
                  <option value="body_wrap">Body Wrap</option>
                  <option value="nail_care">Nail Care</option>
                  <option value="aromatherapy">Aromatherapy</option>
                  <option value="bundle">Bundle</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Service Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={serviceInputData.price}
                  onChange={(e) => setServiceInput(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  placeholder="Enter service price"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={createLoading}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Service Description *
                </label>
                  <input
                    type="text"
                    name="description"
                    value={serviceInputData.description}
                    onChange={(e) => setServiceInput(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    placeholder="Enter service description"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={createLoading}
                  />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  min={15}
                  step={15}
                  value={serviceInputData.duration}
                  onChange={(e) => setServiceInput(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  placeholder="e.g. 60"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={createLoading}
                />
            </div>
            </div>
            

            <div className="space-y-3">
              <button
                onClick={handleCreateService}
                disabled={createLoading || !serviceInputData.name.trim()}
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
                    Create Service
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