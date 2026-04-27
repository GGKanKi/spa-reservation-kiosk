import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

export default function ReportList() {
  const navigate = useNavigate();
  const location = useLocation();

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
  );
}
