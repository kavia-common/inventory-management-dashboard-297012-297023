import React, { useEffect, useState } from 'react';
import { getLowStock } from '../api/client';

// PUBLIC_INTERFACE
export default function Inventory() {
  /** Inventory low-stock list view. */
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getLowStock();
      setItems(res.items || []);
      setCount(res.count ?? (res.items ? res.items.length : 0));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Inventory</h2>
      <div className="card">
        <div style={{ marginBottom: 8 }}>
          <span className="badge">Low-stock: {count}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Reorder</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : items.length ? (
                items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.sku}</td>
                    <td>{i.quantity}</td>
                    <td>{i.reorder_threshold}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No low-stock items 🎉</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
