import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthServices } from "../../services/AuthServices";
import { supabase } from "../../lib/supabase";


type UserProfile = Awaited<ReturnType<typeof AuthServices.getUserProfile>>;

const navItems = [
  { label: "DASHBOARD", path: "/admin/dashboard" },
  { label: "USER MANAGEMENT", path: "/admin/user-management" },
  { label: "STAFF MANAGEMENT", path: "/admin/staff-management" },
  { label: "SERVICE MANAGEMENT", path: "/admin/service-management" },
  { label: "ROOM MANAGEMENT", path: "/admin/room-management" },
  { label: "ORDERS", path: "/admin/orders" },
  { label: "PAYMENTS", path: "/admin/payments" },
  { label: "REPORTS", path: "/admin/reports" },
  { label: "SETTINGS", path: "/admin/settings" },
];

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();


  const [userId, setUserId] = useState<string | null>(null);
  const [userProfileData, setUserProfileData] = useState<any[]>([]);
  const [successChange, setSuccessChange] = useState(false);
  const [failedChange, setFailedChange] = useState(false);
  const [loading, setLoading] = useState(true);


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

  useEffect(() => {

    if (!userId) return;


    const fetchProfileData = async () => {


      try {
        setLoading(true);
        const results = await AuthServices.getUserProfile(userId);

        if (results.error) {
          showFailedUpdate()
          console.error('Error:', results.error);
        } else {
          setUserProfileData(results.data)
        }


      } catch (err) {
        console.error('Error Message', err)
        showFailedUpdate();
      } finally {
        setLoading(false)
      }


    }

    fetchProfileData()

  }, [userId]);

  if (loading) return <div>Loading...</div>;  

  return (
    <aside className="w-[248px] min-w-[248px] min-h-screen flex flex-col bg-[#D1C4E9] border-r-[5px] border-[#9F0AA2] rounded-tr-[10px] rounded-br-[10px]">
      {/* Image Holder */}
      <div className="w-full h-[158px] bg-[#D9D9D9] rounded-tr-[10px] flex-shrink-0" />

      {/* Nav Buttons */}
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

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout Button */}
      <div className="px-[20px] pb-[28px]">
        <button
        onClick={() => navigate("/login")}
          className="w-full h-[56px] flex items-center justify-center
            rounded-[10px] border-[3px] border-black bg-[#D9D9D9]
            font-['Konkhmer_Sleokchher'] text-[20px] text-black leading-[120%]
            [text-shadow:0_4px_4px_rgba(0,0,0,0.75)] [-webkit-text-stroke:1px_#FFF]
            hover:bg-[#c8b8e8] transition-colors duration-150"
          style={{ WebkitTextStrokeColor: "#FFF", WebkitTextStrokeWidth: "1px" }}
        >
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
