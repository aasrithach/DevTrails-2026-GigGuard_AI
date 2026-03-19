import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../api/authService';
import { useToast } from '../context/ToastContext';
import { Monitor } from 'lucide-react';

const AdminLoginPage = () => {
  const [phone, setPhone] = useState(''); // actually username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin({ phone, password });
      login({ id: res.data.id, name: res.data.name, role: res.data.role }, res.data.token);
      addToast?.({ title: 'Admin access granted', type: 'success' });
      navigate('/admin');
    } catch (err) {
      addToast?.({ title: err.response?.data || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="bg-surface/80 border border-red-900/30 w-full max-w-md p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <Monitor className="text-red-500 h-10 w-10 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Operations Center</h2>
          <p className="text-textSecondary mt-1 text-sm">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-textSecondary mb-2">Admin Username</label>
            <input
              type="text"
              required
              className="w-full bg-[#0A0F1E] border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-all font-mono"
              placeholder="e.g. admin"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-textSecondary mb-2">Access Key</label>
            <input
              type="password"
              required
              className="w-full bg-[#0A0F1E] border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-all font-mono tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded transition-all mt-6 disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Access System'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
