/** API client — todas las llamadas al backend */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken(): string | null {
  return localStorage.getItem("treqe-token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  // Auth
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>("/api/auth/login", { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post<{ token: string; user: User }>("/api/auth/register", { email, password, name }),
  me: () => api.get<User>("/api/auth/me"),
  saveToken: (token: string) => localStorage.setItem("treqe-token", token),
  clearToken: () => localStorage.removeItem("treqe-token"),
};

export interface User {
  id: string; email: string; name: string; avatar_url: string | null;
  bio: string | null; location: string | null; reputation: number; verified: boolean;
}
export interface Product {
  id: string; title: string; description: string | null; price: number;
  category: string; subcategory: string | null; condition: string;
  photos: string[]; status: string; created_at: string;
  weight: number | null; user_id?: string;
}
