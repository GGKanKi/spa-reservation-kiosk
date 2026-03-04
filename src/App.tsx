import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Public/Login';
import SignupPage from './pages/Public/Signup';
import MemberDashboard from './pages/MemberPages/Dashboard';
import MemberBooking from './pages/MemberPages/Booking';
import MemberReservations from './pages/MemberPages/Reservation';
import MemberOrders from './pages/MemberPages/Order';
import AdminDashboard from './pages/AdminPages/Dashboard';
import StaffDashboard from './pages/StaffPages/Dashboard';
import Schedule from './pages/StaffPages/Schedule';
import ClientList from './pages/StaffPages/Clientlist';
import Transaction from './pages/StaffPages/Transactions';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} /> 
        <Route path="/book-a-service" element={<MemberBooking />} />
        <Route path="/reservations" element={<MemberReservations />} />
        <Route path="/orders" element={<MemberOrders />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/client-list" element={<ClientList />} />
        <Route path="/staff/schedule" element={<Schedule />} />
        <Route path="/staff/transactions" element={<Transaction />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;