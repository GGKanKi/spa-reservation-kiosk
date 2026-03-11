import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Users } from "../../services/UserServices";

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

export default function StaffManagement() {
  const navigate = useNavigate();
  const location = useLocation();


  const [staffData, setStaffData] = useState<any[]>([]);
  const [checkStaffData, setCheckStaffData] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openStaffData = (user:any) => {
    setCheckStaffData(user)
    setShowModal(true)
  };

  const closeStaffData = () => {
    setShowModal(false)
    setCheckStaffData(null)
  };


  useEffect(() => {

    const fetchData = async () => {

      try {
        const results = await Users.getUserByRole('staff');

        if (results) {
          setStaffData(Array.isArray(results) ? results : []);
        } else {
          setStaffData([]);
        }
      } catch (err) {
        console.error("Error Message:", err)
        setStaffData([]);
      }
    };


    fetchData();
  },[]);

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

        <main className="flex-1 p-10 bg-white">
          <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="font-['Konkhmer_Sleokchher'] text-[32px] mb-6">USER MANAGEMENT</h1>
              
              <table className="w-full border-[2px] border-black rounded-[10px] overflow-hidden">
                <thead className="bg-[#D1C4E9]">
                  <tr>
                    <th className="p-4 border-b-2 border-black font-bold">NAME</th>
                    <th className="p-4 border-b-2 border-black font-bold">ROLE</th>
                    <th className="p-4 border-b-2 border-black font-bold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {staffData && staffData.length > 0 ? (staffData.map((user) => (
                    <tr key={user.id}>
                      <td className="p-4 border-b border-black">{`${user.first_name} ${user.last_name}`.trim()}</td>
                      <td className="p-4 border-b border-black">{user.role}</td>
                      <td className="p-4 border-b border-black">
                        <button 
                          onClick={() => openStaffData(user)}
                          className="text-[#9F0AA2] font-bold"
                        >
                          EDIT
                      </button>
                      </td>
                    </tr>
                  ))) : (
                    <tr>
                      <td className="p-4 border-b border-black text-center" colSpan={3}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </main>
    
          {/**CHECK MODAL */}
          {showModal && checkStaffData && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-[20px] p-8 w-96 shadow-lg border-[3px] border-black">
                <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                <p className="mb-2"><strong>Name:</strong> {checkStaffData.first_name} {checkStaffData.last_name}</p>
                <p className="mb-4"><strong>Role:</strong> {checkStaffData.role}</p>
                <p className="mb-6"><strong>Date Created:</strong> {new Date(checkStaffData.created_at).toLocaleDateString()}</p>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => Users.memberToAdmin(checkStaffData.id)}
                    className="w-full px-4 py-2 bg-[#9F0AA2] text-white rounded font-bold hover:bg-[#7a0880]"
                  >
                    To Staff
                  </button>         
                  <button 
                    onClick={closeStaffData}
                    className="w-full px-4 py-2 bg-[#9F0AA2] text-white rounded font-bold hover:bg-[#7a0880]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
  </div>
  );
}
