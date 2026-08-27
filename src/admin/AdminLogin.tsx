import { useState } from 'react';
import { loginAdmin } from '../auth';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginAdmin(email, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>Admin Login</h1>
        <p className="login-subtitle">Layo Henna Touch Dashboard</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@layohennatouch.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button onClick={() => navigate('/')} className="btn-back">
          Back to Website
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
