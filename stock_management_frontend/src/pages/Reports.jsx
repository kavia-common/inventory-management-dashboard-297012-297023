import React, { useEffect, useState } from 'react';
import { getKpis } from '../api/client';

// PUBLIC_INTERFACE
export default function Reports() {
  /** Basic Reports page with KPI cards. */
  const [kpis, setKpis] = useState({ total_items: 0, low_stock: 0, recent_movements: 0 });

  useEffect(() => {
    (async () => {
      const res = await getKpis();
      setKpis({
        total_items: res.total_items ?? 0,
        low_stock: res.low_stock ?? 0,
        recent_movements: res.recent_movements ?? 0,
      });
    })();
  }, []);

  const cardStyle = { padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Reports</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <div className="card" style={cardStyle}>
          <div style={{ color: 'var(--secondary)', fontSize: 12 }}>Total Items</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{kpis.total_items}</div>
        </div>
        <div className="card" style={cardStyle}>
          <div style={{ color: 'var(--secondary)', fontSize: 12 }}>Low Stock</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{kpis.low_stock}</div>
        </div>
        <div className="card" style={cardStyle}>
          <div style={{ color: 'var(--secondary)', fontSize: 12 }}>Recent Movements</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)' }}>{kpis.recent_movements}</div>
        </div>
      </div>
    </div>
  );
}
