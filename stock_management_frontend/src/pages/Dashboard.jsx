import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Simple dashboard landing with navigation cards. */
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Link to="/items" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Items</h3>
          <p style={{ color: 'var(--secondary)' }}>Create and manage stock items</p>
        </Link>
        <Link to="/inventory" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Inventory</h3>
          <p style={{ color: 'var(--secondary)' }}>Monitor low-stock items</p>
        </Link>
        <Link to="/reports" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Reports</h3>
          <p style={{ color: 'var(--secondary)' }}>View KPIs and recent activity</p>
        </Link>
      </div>
    </div>
  );
}
