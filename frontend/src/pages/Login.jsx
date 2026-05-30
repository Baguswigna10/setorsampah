import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userData = await loginUser(email, password);
      onLogin(userData); // { email, role, nama, point, id } from DB
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-color)',
      backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <Leaf size={48} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
          <h1 style={{ fontSize: '28px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>SetorSampah.</h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '14px' }}>Selamat datang kembali! Silakan masuk ke akun Anda.</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="Alamat Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '15px',
                transition: 'var(--transition)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 48px 12px 48px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '15px',
                transition: 'var(--transition)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {showPassword ? <EyeOff size={20} color="var(--text-muted)" /> : <Eye size={20} color="var(--text-muted)" />}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? 'var(--text-muted)' : 'var(--primary-color)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '8px',
            transition: 'var(--transition)',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Belum punya akun? <Link to="/register" style={{ fontWeight: '600' }}>Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
