import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
