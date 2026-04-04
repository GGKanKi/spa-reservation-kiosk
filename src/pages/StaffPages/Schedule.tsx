import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Users } from "../../services/UserServices";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Orders } from "../../services/OrderServices";

const navItems = [
  { label: "DASHBOARD", path: "/staff/dashboard" },
  { label: "SCHEDULE", path: "/staff/schedule" },
  { label: "TRANSACTIONS", path: "/staff/transactions" },
  { label: "SETTINGS", path: "/staff-settings"}
];

export default function ClientList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState<string | null>(null);
  const [assignedRoom, setAssignedRoom] = useState<any[]>([]);
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const openCheckModal = (room: any) => {
    setShowModal(true);
  };

  const closeCheckModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchRoomAssigned = async () => {
      try {
        setLoading(true);
        const results = await Orders.getOrders();

        if (results.error) {
          console.error(results.error);
          setAssignedRoom([]);
          return;
        }

        const orders = Array.isArray(results.data) ? results.data : [];
        setAssignedRoom(orders);

        // Fetch client names
        orders.forEach(async (res) => {
          try {
            const profile = await Users.getUserProfile(res.client_id);
            const name = profile.data?.first_name || "Unknown Client";
            setClientNames(prev => ({
              ...prev,
              [res.client_id]: name
            }));
          } catch (err) {
            console.error("Failed to fetch name for", res.client_id);
          }
        });

      } catch (err) {
        console.error('Error Message:', err);
        setAssignedRoom([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAssigned();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex w-full min-h-screen">
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

      <main className="flex-1 p-10 bg-white">
        <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="font-['Konkhmer_Sleokchher'] text-[32px] mb-6">ASSIGNED ROOMS</h1>
          
          <table className="w-full border-[2px] border-black rounded-[10px] overflow-hidden">
            <thead className="bg-[#D1C4E9]">
              <tr>
                <th className="p-4 border-b-2 border-black font-bold">NAME</th>
                <th className="p-4 border-b-2 border-black font-bold">CLIENT NAME</th>
                <th className="p-4 border-b-2 border-black font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {assignedRoom && assignedRoom.length > 0 ? (
                assignedRoom.map((room) => (
                  <tr key={room.id}>
                    <td className="p-4 border-b border-black">{room.name}</td>
                    <td className="p-4 border-b border-black">{clientNames[room.client_id] || "Fetching name..."}</td>
                    <td className="p-4 border-b border-black">
                      <button 
                        onClick={() => openCheckModal(room)}
                        className="text-[#9F0AA2] font-bold"
                      >
                        EDIT
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 border-b border-black text-center" colSpan={3}>
                    No assigned rooms found.
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