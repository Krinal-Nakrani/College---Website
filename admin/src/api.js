import { auth } from "./firebase";

const API_HOST = import.meta.env.VITE_API_URL || "";
const BASE = API_HOST ? `${API_HOST.replace(/\/$/, "")}/api` : "/api";

/**
 * Get current Firebase user ID token if signed in
 */
async function getAuthHeader() {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch (err) {
    console.warn("Failed to retrieve auth token:", err);
  }
  return {};
}

/**
 * Helper to handle HTTP response and throw descriptive error messages
 */
async function handle(res) {
  let body = null;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      body = await res.json();
    } catch (e) {
      body = null;
    }
  }

  if (!res.ok) {
    const message =
      (body && (body.error || body.message)) ||
      `Request failed with status ${res.status}: ${res.statusText}`;
    throw new Error(message);
  }

  return body !== null ? body : res.text();
}

/* ─────────────────────────────────────────────────────────────
   COURSES API
   ───────────────────────────────────────────────────────────── */

export async function fetchCourses(level) {
  const qs = level ? `?level=${encodeURIComponent(level)}` : "";
  const res = await fetch(`${BASE}/courses${qs}`);
  return handle(res);
}

export async function createCourse(data) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function updateCourse(id, data) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/courses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function deleteCourse(id) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/courses/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader,
    },
  });
  return handle(res);
}

/* ─────────────────────────────────────────────────────────────
   NOTICES API
   ───────────────────────────────────────────────────────────── */

export async function fetchNotices(category) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${BASE}/notices${qs}`);
  return handle(res);
}

export async function createNotice(data) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/notices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function updateNotice(id, data) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function patchNotice(id, data) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function deleteNotice(id) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader,
    },
  });
  return handle(res);
}

/* ─────────────────────────────────────────────────────────────
   CONTACT MESSAGES / ENQUIRIES API
   ───────────────────────────────────────────────────────────── */

export async function fetchMessages(status) {
  const authHeader = await getAuthHeader();
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${BASE}/contact${qs}`, {
    headers: {
      ...authHeader,
    },
  });
  return handle(res);
}

export async function updateMessage(id, data) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/contact/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function deleteMessage(id) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE}/contact/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader,
    },
  });
  return handle(res);
}

/* ─────────────────────────────────────────────────────────────
   DASHBOARD STATS
   ───────────────────────────────────────────────────────────── */

export async function fetchStats() {
  const authHeader = await getAuthHeader();
  try {
    const res = await fetch(`${BASE}/stats`, {
      headers: {
        ...authHeader,
      },
    });
    return await handle(res);
  } catch (err) {
    // Fallback: aggregate if backend endpoint fails
    const [courses, notices, messages] = await Promise.all([
      fetchCourses().catch(() => []),
      fetchNotices().catch(() => []),
      fetchMessages().catch(() => []),
    ]);
    return {
      courses: courses.length,
      notices: notices.length,
      messages: messages.length,
      newMessages: messages.filter((m) => m.status === "new").length,
    };
  }
}
