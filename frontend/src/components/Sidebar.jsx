import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, Trash2, Tag, Leaf, Gift, LogOut, History } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  const adminMenuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Kategori Sampah', path: '/admin/categories', icon: <Tag size={20} /> },
    { name: 'Manajemen Reward', path: '/admin/rewards', icon: <Gift size={20} /> },
    { name: 'Konfirmasi Reward', path: '/admin/claims', icon: <Gift size={20} /> },
    { name: 'Transaksi', path: '/transactions', icon: <Receipt size={20} /> },
    { name: 'Pengguna', path: '/users', icon: <Users size={20} /> },
    { name: 'Bank Sampah', path: '/banks', icon: <Trash2 size={20} /> },
  ];

  const userMenuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Katalog Reward', path: '/rewards', icon: <Gift size={20} /> },
    { name: 'Riwayat Setoran', path: '/user/history', icon: <History size={20} /> },
  ];

  const menuItems = user?.role === 'ADMIN' ? adminMenuItems : userMenuItems;

  return (
    <aside className="sidebar">
      <div className="brand-logo">
        <Leaf size={32} color="var(--primary-color)" />
        <span>SetorSampah.</span>
      </div>
      
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: 'var(--glass-border)' }}>
        <button 
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            width: '100%',
            color: 'var(--danger)',
            fontWeight: '500',
            borderRadius: 'var(--radius-md)',
            transition: 'var(--transition)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
