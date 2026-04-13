import React from "react";
import { Home, Inbox, PlusCircle, Folder, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const NAV_ITEMS = (t) => [
  { icon: Home, label: t("nav.dashboard"), url: "/" },
  { icon: Inbox, label: t("nav.orders"), url: "/commandes", badge: 3 },
  { icon: PlusCircle, label: t("nav.newOrder"), url: "/Commandes/creer", cta: true },
  { icon: Folder, label: t("nav.documents"), url: "/drive" },
  { icon: User, label: "Profil", url: "/users" },
];

function MobileBottomNav() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const items = NAV_ITEMS(t);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[58px] flex items-center justify-around border-t border-[var(--ob-brd)] z-[70] md:hidden bg-[rgba(8,11,20,0.92)] backdrop-blur-[20px]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {items.map((item) => {
        const active = pathname === item.url;

        if (item.cta) {
          return (
            <Link
              key={item.url}
              to={item.url}
              className="flex flex-col items-center gap-[2px] px-3 py-[5px] flex-1 relative"
            >
              <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-r from-[var(--ob-p)] to-[var(--ob-tl)] flex items-center justify-center -mt-4 shadow-[0_4px_14px_rgba(123,82,232,0.3)]">
                <item.icon className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-[9px] font-semibold text-[var(--ob-txd)]">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.url}
            to={item.url}
            className={`flex flex-col items-center gap-[3px] px-3 py-[6px] flex-1 transition-colors relative ${
              active ? "text-[var(--ob-p)]" : "text-[var(--ob-txd)]"
            }`}
          >
            <item.icon className="w-[20px] h-[20px]" />
            <span className="text-[9px] font-semibold tracking-[0.2px]">{item.label}</span>
            {item.badge && (
              <span className="absolute top-[4px] right-[calc(50%-14px)] w-[14px] h-[14px] rounded-full bg-[var(--ob-or)] text-white text-[7.5px] flex items-center justify-center font-bold">
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
