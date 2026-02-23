import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Update these paths to match your new folder structure
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;