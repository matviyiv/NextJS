"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface transition-colors duration-300">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-50 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
