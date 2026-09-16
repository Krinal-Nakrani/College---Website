import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
import { SidebarProvider } from "./context/SidebarContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NoticesManager from "./pages/NoticesManager";
import CoursesManager from "./pages/CoursesManager";
import MessagesView from "./pages/MessagesView";
import "./styles/admin.css";

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Staff Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notices" element={<NoticesManager />} />
          <Route path="/courses" element={<CoursesManager />} />
          <Route path="/messages" element={<MessagesView />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
