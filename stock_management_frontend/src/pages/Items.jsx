import React, { useEffect, useMemo, useState } from 'react';
import { createItem, deleteItem, getItems, updateItem } from '../api/client';

// Reusable empty item shape
const emptyItem = { name: '', sku: '', quantity: 0, reorder_threshold: 0, price: 0 };

// PUBLIC_INTERFACE
export default function Items() {
  /** Items management: list, search, create, update, delete. */
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [error, setError] = useState('');

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil((meta.total || items.length || 1) / meta.pageSize)),
    [meta.total, meta.pageSize, items.length]
  );

  const fetchData = async (opts = {}) => {
    setLoading(true);
    try {
      const res = await getItems({ q, page: meta.page, pageSize: meta.pageSize, ...opts });
      setItems(res.items || []);
      setMeta({ page: res.page || 1, pageSize: res.pageSize || 10, total: res.total || 0 });
    } catch (e) {
      setError(e.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyItem);
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      reorder_threshold: item.reorder_threshold,
      price: item.price,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // basic validation
      if (!form.name || !form.sku) {
        throw new Error('Name and SKU are required');
      }
      if (editing) {
        await updateItem(editing.id, normalizeForm(form));
      } else {
        await createItem(normalizeForm(form));
      }
      await fetchData();
      setEditing(null);
      setForm(emptyItem);
    } catch (err) {
      setError(err.message || 'Save failed');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteItem(id);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const normalizeForm = (f) => ({
    name: f.name.trim(),
    sku: f.sku.trim(),
    quantity: Number(f.quantity) || 0,
    reorder_threshold: Number(f.reorder_threshold) || 0,
    price: Number(f.price) || 0,
  });

  const onSearch = async (e) => {
    e.preventDefault();
    await fetchData({ page: 1 });
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Items</h2>

      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={onSearch} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="input"
            placeholder="Search by name or SKU..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <button className="btn btn-secondary" type="submit">
            Search
          </button>
          <button className="btn btn-primary" type="button" onClick={startCreate}>
            New Item
          </button>
        </form>
      </div>

      {(editing || form !== emptyItem) && (
        <div className="card" style={{ marginBottom: 12 }}>
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>
            {editing ? 'Edit Item' : 'Create Item'}
          </h3>
          {error && (
            <div className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--secondary)' }}>Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--secondary)' }}>SKU</label>
              <input
                className="input"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--secondary)' }}>Quantity</label>
              <input
                type="number"
                className="input"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--secondary)' }}>Reorder Threshold</label>
              <input
                type="number"
                className="input"
                value={form.reorder_threshold}
                onChange={(e) => setForm({ ...form, reorder_threshold: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--secondary)' }}>Price</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                min="0"
              />
            </div>
            <div style={{ alignSelf: 'end', display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" type="button" onClick={() => { setEditing(null); setForm(emptyItem); }}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Reorder</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : items.length ? (
                items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.sku}</td>
                    <td>{i.quantity}</td>
                    <td>{i.reorder_threshold}</td>
                    <td>${Number(i.price).toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary" onClick={() => startEdit(i)} style={{ marginRight: 8 }}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => onDelete(i.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination stub */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button
            className="btn btn-secondary"
            disabled={meta.page <= 1}
            onClick={() => {
              const p = Math.max(1, meta.page - 1);
              setMeta({ ...meta, page: p });
              fetchData({ page: p });
            }}
          >
            Prev
          </button>
          <span style={{ alignSelf: 'center', color: 'var(--secondary)', fontSize: 14 }}>
            Page {meta.page} of {pageCount}
          </span>
          <button
            className="btn btn-secondary"
            disabled={meta.page >= pageCount}
            onClick={() => {
              const p = Math.min(pageCount, meta.page + 1);
              setMeta({ ...meta, page: p });
              fetchData({ page: p });
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
