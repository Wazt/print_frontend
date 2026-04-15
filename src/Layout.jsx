import React, { useContext, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { AppSidebar } from "@/Components/AppSideBar";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import ThemeSwitcher from "@/Components/ThemeSwitcher";
import MobileBottomNav from "@/Components/MobileBottomNav";
import AuthContext from "@/contexts/AuthContext";
import { Bell, Menu, Search } from "lucide-react";

function Breadcrumbs({ pathname }) {
  const segments = pathname.split("/").filter(Boolean);
  return (
    <div className="hidden md:flex items-center gap-2 text-[13px] text-[var(--text-3)] min-w-0">
      <Link to="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
      {segments.map((seg, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        return (
          <React.Fragment key={path}>
            <span className="text-[var(--text-4)]">/</span>
            {isLast ? (
              <span className="text-[var(--text)] font-medium truncate">{label}</span>
            ) : (
              <Link to={path} className="hover:text-[var(--text)] transition-colors truncate">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const { profile } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[var(--bg)]">
      {/* Sidebar — desktop fixed, mobile drawer */}
      <div className="hidden md:flex">
        <AppSidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-[var(--surface)] shadow-2xl">
            <AppSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-[var(--topbar-h)] flex items-center justify-between px-4 md:px-6 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              className="md:hidden h-9 w-9 rounded-[var(--radius)] flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <Breadcrumbs pathname={pathname} />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="hidden md:flex h-9 w-9 rounded-[var(--radius)] items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              className="h-9 w-9 rounded-[var(--radius)] flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--danger)] ring-2 ring-[var(--surface)]" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6 py-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
