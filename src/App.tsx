import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import MemberDashboard from './pages/MemberPages/Dashboard';
import AdminDashboard from './pages/AdminPages/Dashboard';
import StaffDashboard from './pages/StaffPages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;