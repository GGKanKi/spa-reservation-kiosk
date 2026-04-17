import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Public/Login';
import SignupPage from './pages/Public/Signup';
import ForgotPassword from './pages/Public/ForgotPassword';
import ResetPassword from './pages/Public/ResetPassword';
import MemberDashboard from './pages/MemberPages/Dashboard';
import MemberBooking from './pages/MemberPages/Booking';
import MemberOrders from './pages/MemberPages/Order';
import AdminDashboard from './pages/AdminPages/Dashboard';
import StaffDashboard from './pages/StaffPages/Dashboard';
import Schedule from './pages/StaffPages/Schedule';
import Transaction from './pages/StaffPages/Transactions';
import UserManagement from './pages/AdminPages/UserManagement';
import StaffManagement from './pages/AdminPages/StaffManagement';
import ServiceManagement from './pages/AdminPages/ServiceManagement';
import RoomManagement from './pages/AdminPages/RoomManagementt';
import OrderList from './pages/AdminPages/Order';
import PaymentList from './pages/AdminPages/Payment';
import ReportList from './pages/AdminPages/Report';
import Settings from './pages/AdminPages/Setting';
import MemberSettings from './pages/MemberPages/Settings';
import StaffSettings from './pages/StaffPages/Settings';


function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC PAGES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<LoginPage />} />

        {/* MEMBER PAGES */}
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/book-a-service" element={<MemberBooking />} />
        <Route path="/orders" element={<MemberOrders />} />
        <Route path="/member-settings" element={<MemberSettings />} />

        {/* ADMIN PAGES */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/staff-management" element={<StaffManagement />} />
        <Route path="/admin/service-management" element={<ServiceManagement />} />
        <Route path="/admin/room-management" element={<RoomManagement />} />
        <Route path="/admin/orders" element={<OrderList />} />
        <Route path="/admin/payments" element={<PaymentList />} />
        <Route path="/admin/reports" element={<ReportList />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* STAFF PAGES */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/schedule" element={<Schedule />} />
        <Route path="/staff/transactions" element={<Transaction />} />
        <Route path="/staff-settings" element={<StaffSettings />} />


        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;