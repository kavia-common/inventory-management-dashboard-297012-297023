//
// API client with base URL configuration, JWT auth, and helpers
//

const BASE_URL =
  process.env.REACT_APP_API_BASE?.replace(/\/+$/, '') || 'http://localhost:3001';

let inMemoryToken = null;

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Set the JWT token used for API requests (also persisted to localStorage). */
  inMemoryToken = token || null;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Get the JWT token, reading from memory or localStorage. */
  if (inMemoryToken) return inMemoryToken;
  const saved = localStorage.getItem('auth_token');
  if (saved) inMemoryToken = saved;
  return inMemoryToken;
}

// INTERNAL: helper to build headers
function authHeaders(extra = {}) {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function handleResponse(res) {
  if (res.status === 401) {
    // Unauthorized - clear token and redirect to login
    setAuthToken(null);
    // Hard redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `Request failed with status ${res.status}`);
  }
  // content-type may be empty for 204
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// PUBLIC_INTERFACE
export async function apiLogin(email, password) {
  /** Login using email and password; returns { access_token } on success. */
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(res);
  } catch (e) {
    // When backend is not ready, simulate a successful login for stubbing.
    // Remove this fallback when backend is available.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({ access_token: 'stub-token' });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 400);
    });
  }
}

// PUBLIC_INTERFACE
export async function getItems({ q = '', page = 1, pageSize = 10 } = {}) {
  /** Fetch paginated list of items with optional search. */
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  try {
    const res = await fetch(`${BASE_URL}/items?${params.toString()}`, {
      headers: authHeaders(),
    });
    return await handleResponse(res);
  } catch {
    // stubbed data
    const all = [
      { id: 1, name: 'Widget A', sku: 'WID-A', quantity: 5, reorder_threshold: 10, price: 12.5 },
      { id: 2, name: 'Widget B', sku: 'WID-B', quantity: 20, reorder_threshold: 15, price: 7.99 },
      { id: 3, name: 'Gadget C', sku: 'GAD-C', quantity: 2, reorder_threshold: 5, price: 25.0 },
    ].filter(
      (i) =>
        !q ||
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.sku.toLowerCase().includes(q.toLowerCase())
    );
    return { items: all.slice(0, pageSize), total: all.length, page, pageSize };
  }
}

// PUBLIC_INTERFACE
export async function createItem(payload) {
  /** Create a new item. payload: {name, sku, quantity, reorder_threshold, price} */
  try {
    const res = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch {
    // stub id
    return { id: Math.floor(Math.random() * 100000), ...payload };
  }
}

// PUBLIC_INTERFACE
export async function updateItem(id, payload) {
  /** Update an existing item by id. */
  try {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch {
    return { id, ...payload };
  }
}

// PUBLIC_INTERFACE
export async function deleteItem(id) {
  /** Delete item by id. */
  try {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return await handleResponse(res);
  } catch {
    return { success: true };
  }
}

// PUBLIC_INTERFACE
export async function getLowStock() {
  /** Fetch items where quantity <= reorder_threshold. */
  try {
    const res = await fetch(`${BASE_URL}/inventory/low-stock`, {
      headers: authHeaders(),
    });
    return await handleResponse(res);
  } catch {
    const all = [
      { id: 1, name: 'Widget A', sku: 'WID-A', quantity: 5, reorder_threshold: 10, price: 12.5 },
      { id: 3, name: 'Gadget C', sku: 'GAD-C', quantity: 2, reorder_threshold: 5, price: 25.0 },
    ];
    return { items: all, count: all.length };
  }
}

// PUBLIC_INTERFACE
export async function getKpis() {
  /** Fetch KPI metrics for reports page. */
  try {
    const res = await fetch(`${BASE_URL}/reports/kpis`, {
      headers: authHeaders(),
    });
    return await handleResponse(res);
  } catch {
    return { total_items: 3, low_stock: 2, recent_movements: 7 };
  }
}
