import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Users } from "../../services/UserServices";
import { Users as UsersIcon, Mail, Phone, User, X } from "lucide-react";

type UserProfile = Awaited<ReturnType<typeof Users.getUserProfile>>;

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

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState<string | null>(null);
  const [userProfileData, setUserProfileData] = useState<any>(null);
  const [successChange, setSuccessChange] = useState(false);
  const [failedChange, setFailedChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone_num: "",
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      setErrorMessage("User ID not found");
      return;
    }

    try {
      setLoading(true);
      const result = await Users.updateUser(userId, {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        phone_num: formData.phone_num,
      });

      if (result.error) {
        setErrorMessage(result.error);
        setFailedChange(true);
      } else {
        setUserProfileData(result.data);
        setSuccessChange(true);
        setEditing(false);
        setTimeout(() => setSuccessChange(false), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage("Failed to save");
      setFailedChange(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setEditing(false);
    if (userProfileData) {
      setFormData({
        first_name: userProfileData.first_name || "",
        middle_name: userProfileData.middle_name || "",
        last_name: userProfileData.last_name || "",
        email: userProfileData.email || "",
        phone_num: userProfileData.phone_num || "",
      });
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const results = await Users.getUserProfile(userId);

        if (results.error) {
          setFailedChange(true);
          console.error('Error:', results.error);
        } else {
          setUserProfileData(results.data);
          setFormData({
            first_name: results.data?.first_name || "",
            middle_name: results.data?.middle_name || "",
            last_name: results.data?.last_name || "",
            email: results.data?.email || "",
            phone_num: results.data?.phone_num || "",
          });
        }
      } catch (err) {
        console.error('Error Message', err);
        setFailedChange(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              ⚙️ Account Settings
            </h1>
            <p className="text-slate-400">Manage your personal information</p>
          </div>

          {/* Success Message */}
          {successChange && (
            <div className="mb-6 p-4 bg-green-500/20 border-2 border-green-500/50 rounded-lg text-green-300 font-semibold">
              ✅ Changes saved successfully!
            </div>
          )}

          {/* Error Message */}
          {(failedChange || errorMessage) && (
            <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg text-red-300 font-semibold">
              ❌ {errorMessage || "Failed to save changes"}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-purple-500/20 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {formData.first_name} {formData.last_name}
                  </h2>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <Mail size={16} /> {formData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full h-[48px] px-4 rounded-lg border border-slate-600 outline-none transition-all ${
                      editing
                        ? "bg-slate-700/50 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        : "bg-slate-700/30 text-slate-300 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full h-[48px] px-4 rounded-lg border border-slate-600 outline-none transition-all ${
                      editing
                        ? "bg-slate-700/50 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        : "bg-slate-700/30 text-slate-300 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full h-[48px] px-4 rounded-lg border border-slate-600 outline-none transition-all ${
                      editing
                        ? "bg-slate-700/50 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        : "bg-slate-700/30 text-slate-300 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full h-[48px] px-4 rounded-lg border border-slate-600 bg-slate-700/30 text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* Phone Number */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_num"
                    value={formData.phone_num}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full h-[48px] px-4 rounded-lg border border-slate-600 outline-none transition-all ${
                      editing
                        ? "bg-slate-700/50 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        : "bg-slate-700/30 text-slate-300 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6 border-t border-slate-700">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                  >
                    EDIT PROFILE
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all duration-200"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}