import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ user, onLogout }) => {
  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-content">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default Layout;
