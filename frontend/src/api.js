export const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const auth = {
  get: () => JSON.parse(localStorage.getItem("auth") || "null"),
  set: (v) => localStorage.setItem("auth", JSON.stringify(v)),
  clear: () => localStorage.removeItem("auth"),
};
export async function api(path, { method = "GET", json, form } = {}) {
  const headers = {};
  const a = auth.get();
  if (a) headers.Authorization = `Bearer ${a.access_token}`;
  if (json) headers["Content-Type"] = "application/json";
  const res = await fetch(API + path, { method, headers, body: json ? JSON.stringify(json) : form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Erro ao enviar os dados");
  return data;
}
