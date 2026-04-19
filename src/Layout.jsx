import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { AppSidebar } from "@/Components/AppSideBar";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import ThemeSwitcher from "@/Components/ThemeSwitcher";
import MobileBottomNav from "@/Components/MobileBottomNav";
import AuthContext from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bell, Menu, Search, X } from "lucide-react";

function Breadcrumbs({ pathname, isFr }) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav
      aria-label={isFr ? "Fil d'Ariane" : "Breadcrumb"}
      className="hidden md:flex min-w-0"
    >
      <ol className="flex items-center gap-2 text-[13px] text-[var(--text-3)] min-w-0">
        <li className="flex items-center gap-2">
          <Link to="/" className="hover:text-[var(--text)] transition-colors">
            {isFr ? "Accueil" : "Home"}
          </Link>
        </li>
        {segments.map((seg, i) => {
          const path = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;
          const label = seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          return (
            <li key={path} className="flex items-center gap-2 min-w-0">
              <span className="text-[var(--text-4)]" aria-hidden="true">/</span>
              {isLast ? (
                <span
                  className="text-[var(--text)] font-medium truncate"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link to={path} className="hover:text-[var(--text)] transition-colors truncate">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const drawerCloseButtonRef = useRef(null);
  const isFr = t("lang") === "fr";

  // Close drawer on Escape + focus management
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Move focus into drawer
    drawerCloseButtonRef.current?.focus();
    // Lock body scroll while drawer open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      // Restore focus to menu button when drawer closes
      menuButtonRef.current?.focus();
    };
  }, [sidebarOpen]);

  // Close drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full bg-[var(--bg)]">
      {/* Skip to content link — WCAG 2.1 AA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-[var(--radius)] focus:bg-[var(--brand)] focus:text-[var(--brand-fg)] focus:shadow-[var(--shadow-lift)] focus:text-[14px] focus:font-semibold"
      >
        {isFr ? "Aller au contenu principal" : "Skip to main content"}
      </a>

      {/* Sidebar — desktop fixed */}
      <div className="hidden md:flex">
        <AppSidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={isFr ? "Menu de navigation" : "Navigation menu"}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-[var(--surface)] shadow-2xl flex flex-col">
            <button
              ref={drawerCloseButtonRef}
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-[var(--radius)] flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors"
              aria-label={isFr ? "Fermer le menu" : "Close menu"}
            >
              <X size={16} />
            </button>
            <AppSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header
          role="banner"
          className="sticky top-0 z-20 h-[var(--topbar-h)] flex items-center justify-between px-4 md:px-6 border-b border-[var(--border)] bg-[var(--surface)]"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              ref={menuButtonRef}
              className="md:hidden h-9 w-9 rounded-[var(--radius)] flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label={isFr ? "Ouvrir le menu" : "Open menu"}
              aria-expanded={sidebarOpen}
              aria-controls="mobile-nav-drawer"
            >
              <Menu size={18} aria-hidden="true" />
            </button>
            <Breadcrumbs pathname={pathname} isFr={isFr} />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="hidden md:flex h-9 w-9 rounded-[var(--radius)] items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors"
              aria-label={isFr ? "Rechercher" : "Search"}
            >
              <Search size={16} aria-hidden="true" />
            </button>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              className="h-9 w-9 rounded-[var(--radius)] flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors relative"
              aria-label={isFr ? "Notifications (1 non lue)" : "Notifications (1 unread)"}
            >
              <Bell size={16} aria-hidden="true" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--danger)] ring-2 ring-[var(--surface)]"
                aria-hidden="true"
              />
            </button>
          </div>
        </header>

        {/* Page content — skip link target */}
        <main
          id="main-content"
          tabIndex="-1"
          className="flex-1 overflow-y-auto pb-20 md:pb-6 focus:outline-none"
        >
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
