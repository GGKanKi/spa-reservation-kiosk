import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Orders } from "../../services/OrderServices";


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

export default function OrderList() {
  const navigate = useNavigate();
  const location = useLocation();


  const [orderData, setOrderData] = useState<any[]>([]);
  const [checkOrderData, setCheckOrderData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const openCheckModal = async (order:any) => {
    setCheckOrderData(true);
    setOrderData(order)
  };

  const closeCheckModal = async () => {
    setOrderData([]);
    setCheckOrderData(false)
  };

  useEffect(() => {

    const fetchOrders = async () => {

      try {
        const results = await Orders.getOrders()

        if (results) {
          setOrderData(Array.isArray(results) ? results : []);
        } else {
          setOrderData([]);
        }
      } catch (err) {
        console.log('Error Message', err)
      }
    }

    fetchOrders()

    
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
            <h1 className="font-['Konkhmer_Sleokchher'] text-[32px] mb-6">ORDER MANAGEMENT</h1>
            
            <table className="w-full border-[2px] border-black rounded-[10px] overflow-hidden">
              <thead className="bg-[#D1C4E9]">
                <tr>
                  <th className="p-4 border-b-2 border-black font-bold">NAME</th>
                  <th className="p-4 border-b-2 border-black font-bold">CLIENT NAME/ ID</th>
                  <th className="p-4 border-b-2 border-black font-bold">STAFF NAME/ ID</th>
                  <th className="p-4 border-b-2 border-black font-bold">SERVICES</th>                  
                  <th className="p-4 border-b-2 border-black font-bold">ROOM ID</th>
                  <th className="p-4 border-b-2 border-black font-bold">ORDER STATUS</th>                
                </tr>
              </thead>
              <tbody>
                {orderData && orderData.length > 0 ? (orderData.map((order) => (
                  <tr key={order.id}>
                    <td className="p-4 border-b border-black">{order.name}</td>
                    <td className="p-4 border-b border-black">{order.assigned_name}</td>
                    <td className="p-4 border-b border-black">{order.is_available}</td>
                    <td className="p-4 border-b border-black">
                      <button 
                        onClick={() => openCheckModal(order)}
                        className="text-[#9F0AA2] font-bold"
                      >
                        EDIT
                    </button>
                    </td>
                  </tr>
                ))) : (
                  <tr>
                    <td className="p-4 border-b border-black text-center" colSpan={3}>
                      No orders found.
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
