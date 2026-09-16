const API_HOST = import.meta.env.VITE_API_URL || "";
const BASE = API_HOST ? `${API_HOST.replace(/\/$/, "")}/api` : "/api";

async function handle(res) {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function fetchCourses(level) {
  const qs = level ? `?level=${encodeURIComponent(level)}` : "";
  return fetch(`${BASE}/courses${qs}`).then(handle);
}

export function fetchCourse(slug) {
  return fetch(`${BASE}/courses/${slug}`).then(handle);
}

export function fetchNotices() {
  return fetch(`${BASE}/notices`).then(handle);
}

export function submitEnquiry(payload) {
  return fetch(`${BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);
}
