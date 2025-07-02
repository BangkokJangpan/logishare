const API_BASE = "http://localhost:3000/api";

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return res.json();
}

export async function createUser(data: { name: string; email: string }) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createPost(data: { title: string; content: string; userId: number }) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function deletePost(id: number) {
  const res = await fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function updateUser(id: number, data: { name: string; email: string }) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePost(id: number, data: { title: string; content: string; userId: number }) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchCompanies() {
  const res = await fetch(`${API_BASE}/companies`);
  return res.json();
}

export async function createCompany(data) {
  const res = await fetch(`${API_BASE}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCompany(id, data) {
  const res = await fetch(`${API_BASE}/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCompany(id) {
  const res = await fetch(`${API_BASE}/companies/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchVehicles() {
  const res = await fetch(`${API_BASE}/vehicles`);
  return res.json();
}

export async function createVehicle(data) {
  const res = await fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateVehicle(id, data) {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteVehicle(id) {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchDrivers() {
  const res = await fetch(`${API_BASE}/drivers`);
  return res.json();
}

export async function createDriver(data) {
  const res = await fetch(`${API_BASE}/drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDriver(id, data) {
  const res = await fetch(`${API_BASE}/drivers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDriver(id) {
  const res = await fetch(`${API_BASE}/drivers/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchEmptyRuns() {
  const res = await fetch(`${API_BASE}/emptyruns`);
  return res.json();
}

export async function createEmptyRun(data) {
  const res = await fetch(`${API_BASE}/emptyruns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEmptyRun(id, data) {
  const res = await fetch(`${API_BASE}/emptyruns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteEmptyRun(id) {
  const res = await fetch(`${API_BASE}/emptyruns/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchShippers() {
  const res = await fetch(`${API_BASE}/shippers`);
  return res.json();
}

export async function createShipper(data) {
  const res = await fetch(`${API_BASE}/shippers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateShipper(id, data) {
  const res = await fetch(`${API_BASE}/shippers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteShipper(id) {
  const res = await fetch(`${API_BASE}/shippers/${id}`, { method: 'DELETE' });
  return res.json();
} 