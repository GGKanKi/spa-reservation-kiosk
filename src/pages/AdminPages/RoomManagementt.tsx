import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Rooms } from "../../services/RoomService";
import { supabase } from "../../lib/supabase";
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

export default function RoomManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [roomData, setRoomData] = useState<any[]>([]);
  const [checkRoomData, setCheckRoomData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const openCheckModal = async (room:any) => {
    setCheckRoomData(room);
    setShowModal(true);
  };


  const closeCheckModal = async () => {
    setShowModal(false);
    setCheckRoomData([]);

  };
  
  
  useEffect(() => {

    const fetchRooms = async () => {

      try {
        const results = await Rooms.getRooms()

        if (results) {
          setRoomData(Array.isArray(results) ? results : []);
        } else {
          setRoomData([]);
        }

      } catch (err) {
        console.log('Error Message', err)
      }


    }
    
  fetchRooms()
  
  }, []);


  return (
  <div className="flex w-full min-h-screen">
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


    <main className="flex-1 p-10 bg-white">
      <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="font-['Konkhmer_Sleokchher'] text-[32px] mb-6">ROOM MANAGEMENT</h1>
          
          <table className="w-full border-[2px] border-black rounded-[10px] overflow-hidden">
            <thead className="bg-[#D1C4E9]">
              <tr>
                <th className="p-4 border-b-2 border-black font-bold">NAME</th>
                <th className="p-4 border-b-2 border-black font-bold">ASSIGNEE</th>
                <th className="p-4 border-b-2 border-black font-bold">OCCUPIED BY</th>
                <th className="p-4 border-b-2 border-black font-bold">AVAILABILITY</th>
              </tr>
            </thead>
            <tbody>
              {roomData && roomData.length > 0 ? (roomData.map((room) => (
                <tr key={room.id}>
                  <td className="p-4 border-b border-black">{room.name}</td>
                  <td className="p-4 border-b border-black">{room.assigned_name}</td>
                  {/**To be Updated With Connected User */}
                  <td className="p-4 border-b border-black">{null}</td> 
                  <td className="p-4 border-b border-black">{room.is_available}</td>
                  <td className="p-4 border-b border-black">
                    <button 
                      onClick={() => openCheckModal(room)}
                      className="text-[#9F0AA2] font-bold"
                    >
                      EDIT
                  </button>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td className="p-4 border-b border-black text-center" colSpan={3}>
                    No rooms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </main>

  </div>
  );
}
