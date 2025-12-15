import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './layout.css';

// PUBLIC_INTERFACE
export default function AppLayout() {
  /** App shell with sidebar and header layout. */
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Stock Admin</div>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/items" className="nav-link">
            Items
          </NavLink>
          <NavLink to="/inventory" className="nav-link">
            Inventory
          </NavLink>
          <NavLink to="/reports" className="nav-link">
            Reports
          </NavLink>
        </nav>
      </aside>
      <main className="main">
        <header className="header">
          <div className="header-left" />
          <div className="header-right">
            <span className="user">{user?.email}</span>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
