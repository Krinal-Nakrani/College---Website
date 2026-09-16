import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SidebarContext = createContext({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-close sidebar on mobile navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll on small screens when drawer is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth <= 992) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <SidebarContext.Provider
      value={{ sidebarOpen, setSidebarOpen, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
