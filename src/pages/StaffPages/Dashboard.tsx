import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const navItems = [
  { label: "DASHBOARD", path: "/staff/dashboard" },
  { label: "CLIENT LIST", path: "/staff/client-list" },
  { label: "SCHEDULE", path: "/staff/schedule" },
  { label: "TRANSACTIONS", path: "/staff/transactions" },
  { label: "SETTINGS", path: "/staff-settings"}
];

export default function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setfullName] = useState("USER");

  useEffect(() => {
    const getUserData = async () => {
      const {data: {user}} = await supabase.auth.getUser();
      if (user && user.user_metadata) {
        const firstName = user.user_metadata.first_name || "";
        const lastName = user.user_metadata.last_name || "";

        setfullName(`${firstName} ${lastName}`.trim());
      }
    };
      getUserData();
  }, []);



  return (
    <div className="flex min-h-screen w-full bg-[#F5F5F5]">

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

      <main className="flex-1 p-[40px] flex flex-col items-start gap-[24px]">
        <div className="w-full max-w-[845px] h-[164px] bg-[#D9D9D9] border-[3px] border-black rounded-[15px] 
                      flex items-center px-[44px] mb-[10px]
                      shadow-[0px_4px_4px_rgba(0,0,0,0.25)] drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
              <h1 className="font-['Konkhmer_Sleokchher'] text-[32px] text-black uppercase">
                WELCOME, {fullName}!
              </h1>
        </div>

        <div className="flex gap-6 w-full">

        </div>

      </main>

  </div>
  );
}
