import React from "react";
import { Home, Inbox, PlusCircle, Folder, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

function MobileBottomNav() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const items = [
    { icon: Home, label: t("nav.dashboard"), url: "/" },
    { icon: Inbox, label: t("nav.orders"), url: "/Commandes", badge: 3 },
    { icon: PlusCircle, label: t("nav.newOrder"), url: "/Commandes/creer", cta: true },
    { icon: Folder, label: t("nav.documents"), url: "/drive" },
    { icon: User, label: "Profil", url: "/users" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-[64px] flex items-center justify-around border-t border-[var(--border)] bg-[var(--surface)] z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map((item) => {
        const active = pathname === item.url;
        if (item.cta) {
          return (
            <Link key={item.url} to={item.url} className="flex flex-col items-center gap-1 px-3 py-2 flex-1">
              <div className="w-11 h-11 -mt-5 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-lift)]">
                <item.icon size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-medium text-[var(--text-3)]">{item.label}</span>
            </Link>
          );
        }
        return (
          <Link
            key={item.url}
            to={item.url}
            className={`flex flex-col items-center gap-1 px-3 py-2 flex-1 transition-colors relative ${
              active ? "text-[var(--accent)]" : "text-[var(--text-3)]"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge && (
              <span className="absolute top-1 right-[calc(50%-16px)] w-4 h-4 rounded-full bg-[var(--danger)] text-white text-[9px] flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default React.memo(MobileBottomNav);
