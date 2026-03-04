import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Public/Login';
import SignupPage from './pages/Public/Signup';
import MemberDashboard from './pages/MemberPages/Dashboard';
import MemberBooking from './pages/MemberPages/Booking';
import MemberReservations from './pages/MemberPages/Reservation';
import MemberOrders from './pages/MemberPages/Order';
import AdminDashboard from './pages/AdminPages/Dashboard';
import StaffDashboard from './pages/StaffPages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} /> 
        <Route path="/book-a-service" element={<MemberBooking />} />
        <Route path="/reservations" element={<MemberReservations />} />
        <Route path="/orders" element={<MemberOrders />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />


      </Routes>
    </Router>
  );
}

export default App;