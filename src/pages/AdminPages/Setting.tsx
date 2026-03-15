import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Users } from "../../services/UserServices";


type UserProfile = Awaited<ReturnType<typeof Users.getUserProfile>>;

const navItems = [
  { label: "DASHBOARD", path: "/admin/dashboard" },
  { label: "USERS", path: "/admin/user-management" },
  { label: "STAFFS", path: "/admin/staff-management" },
  { label: "SERVICES", path: "/admin/service-management" },
  { label: "ROOMS", path: "/admin/room-management" },
  { label: "ORDERS", path: "/admin/orders" },
  { label: "PAYMENTS", path: "/admin/payments" },
  { label: "REPORTS", path: "/admin/reports" },
  { label: "SETTINGS", path: "/admin/settings" },
];

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();


  const [userId, setUserId] = useState<string | null>(null);
  const [userProfileData, setUserProfileData] = useState<any>(null);
  const [successChange, setSuccessChange] = useState(false);
  const [failedChange, setFailedChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");


  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone_num: "",
    password: "",
  });


  const showSuccessUpdate = async (data:any) => {
    setSuccessChange(true)
    setUserProfileData(data)
  };

  const closeSuccessUpdate = async () => {
    setSuccessChange(false)
  };

  const showFailedUpdate = async () => {
    setFailedChange(true)
  }; 

  const closeFailedUpdate = async () => {
    setFailedChange(false)
  };


  
  // Get Id before Other Functions
  useEffect(() => {
    const getCurrentUser = async () => {
    const {data: {user} } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id)
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
        password: userProfileData.password || "",
      });
    }
  };
    

  useEffect(() => {

    if (!userId) return;


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
          // Populate form with user data
          setFormData({
            first_name: results.data?.first_name || "",
            middle_name: results.data?.middle_name || "",
            last_name: results.data?.last_name || "",
            email: results.data?.email || "",
            phone_num: results.data?.phone_num || "",
            password: results.data?.password || "",
          });
        }
      } catch (err) {
        console.error('Error Message', err);
        setFailedChange(true);
      } finally {
        setLoading(false);
      }
    };



    fetchProfileData()

  }, [userId]);

  if (loading) return <div>Loading...</div>;  

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <aside className="w-[248px] min-w-[248px] min-h-screen flex flex-col bg-[#D1C4E9] border-r-[5px] border-[#9F0AA2] rounded-tr-[10px] rounded-br-[10px]">
        <div className="w-full h-[158px] bg-[#D9D9D9] rounded-tr-[10px] flex-shrink-0" />

        <nav className="flex flex-col gap-[18px] mt-[136px] px-[20px]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  w-full h-[56px] flex items-center justify-center
                  rounded-[10px] border-[3px] border-black
                  font-['Konkhmer_Sleokchher'] text-[20px] text-black leading-[120%]
                  transition-colors duration-150
                  ${isActive ? "bg-[#9F0AA2] text-white border-[#9F0AA2]" : "bg-[#D9D9D9] hover:bg-[#c8b8e8]"}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="px-[20px] pb-[28px]">
          <button
            onClick={() => {
              supabase.auth.signOut();
              navigate("/login");
            }}
            className="w-full h-[56px] flex items-center justify-center
              rounded-[10px] border-[3px] border-black bg-[#FF6B6B] hover:bg-[#EE5A52]
              font-['Konkhmer_Sleokchher'] text-[20px] text-white leading-[120%]
              transition-colors duration-150"
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white">
        <div className="bg-white border-[3px] border-black rounded-[20px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Header */}
          <h1 className="font-['Konkhmer_Sleokchher'] text-[32px] mb-8 text-black">ACCOUNT SETTINGS</h1>

          {/* Success Message */}
          {successChange && (
            <div className="mb-6 p-4 bg-[#D4EDDA] border-2 border-[#28A745] rounded-[10px] text-[#155724] font-['Konkhmer_Sleokchher']">
              ✅ Changes saved successfully!
            </div>
          )}

          {/* Error Message */}
          {(failedChange || errorMessage) && (
            <div className="mb-6 p-4 bg-[#F8D7DA] border-2 border-[#F5C6CB] rounded-[10px] text-[#721C24] font-['Konkhmer_Sleokchher']">
              ❌ {errorMessage || "Failed to save changes"}
            </div>
          )}

          {/* Profile Form */}
          <div className="border-2 border-black rounded-[15px] p-8 bg-[#F9F9F9]">
            <h2 className="font-['Konkhmer_Sleokchher'] text-[24px] mb-6 text-black">PERSONAL INFORMATION</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div>
                <label className="block font-['Konkhmer_Sleokchher'] text-[16px] mb-2 text-black font-bold">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full h-[48px] px-4 rounded-[10px] border-[2px] border-black
                    font-['Konkhmer_Sleokchher'] text-[16px]
                    ${editing ? "bg-white" : "bg-[#E8E8E8]"}
                    transition-colors focus:outline-none`}
                />
              </div>

              {/* Middle Name */}
              <div>
                <label className="block font-['Konkhmer_Sleokchher'] text-[16px] mb-2 text-black font-bold">Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full h-[48px] px-4 rounded-[10px] border-[2px] border-black
                    font-['Konkhmer_Sleokchher'] text-[16px]
                    ${editing ? "bg-white" : "bg-[#E8E8E8]"}
                    transition-colors focus:outline-none`}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block font-['Konkhmer_Sleokchher'] text-[16px] mb-2 text-black font-bold">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full h-[48px] px-4 rounded-[10px] border-[2px] border-black
                    font-['Konkhmer_Sleokchher'] text-[16px]
                    ${editing ? "bg-white" : "bg-[#E8E8E8]"}
                    transition-colors focus:outline-none`}
                />
              </div>

              {/* Email (Disabled) */}
              <div>
                <label className="block font-['Konkhmer_Sleokchher'] text-[16px] mb-2 text-black font-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={true}
                  className="w-full h-[48px] px-4 rounded-[10px] border-[2px] border-black
                    font-['Konkhmer_Sleokchher'] text-[16px] bg-[#E8E8E8] cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label className="block font-['Konkhmer_Sleokchher'] text-[16px] mb-2 text-black font-bold">Phone Number</label>
                <input
                  type="tel"
                  name="phone_num"
                  value={formData.phone_num}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full h-[48px] px-4 rounded-[10px] border-[2px] border-black
                    font-['Konkhmer_Sleokchher'] text-[16px]
                    ${editing ? "bg-white" : "bg-[#E8E8E8]"}
                    transition-colors focus:outline-none`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-8">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="h-[56px] px-8 flex items-center justify-center
                  rounded-[10px] border-[3px] border-black bg-[#9F0AA2]
                  font-['Konkhmer_Sleokchher'] text-[18px] text-white font-bold
                  transition-colors hover:bg-[#8B0090] active:scale-95"
              >
                EDIT PROFILE
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="h-[56px] px-8 flex items-center justify-center
                    rounded-[10px] border-[3px] border-black bg-[#D9D9D9]
                    font-['Konkhmer_Sleokchher'] text-[18px] text-black font-bold
                    transition-colors hover:bg-[#C0C0C0] active:scale-95"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="h-[56px] px-8 flex items-center justify-center
                    rounded-[10px] border-[3px] border-black bg-[#28A745]
                    font-['Konkhmer_Sleokchher'] text-[18px] text-white font-bold
                    transition-colors hover:bg-[#218838] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
