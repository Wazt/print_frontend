import {
  Home, Inbox, Users, Settings,
  LogOut, PlusCircle, Folder,
  HelpCircle, ChevronDown, FileText, MessageSquare
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sidebar, SidebarContent, SidebarFooter } from "@/Components/ui/sidebar";

function useSections(t, role) {
  if (role === "CLIENT") {
    return [
      {
        key: "main",
        items: [
          { title: t("nav.dashboard"), url: "/", icon: Home },
          { title: t("nav.myOrders"), url: "/commandes", icon: Inbox, badge: "3" },
          { title: t("nav.myFiles"), url: "/drive", icon: Folder },
          { title: t("nav.invoices"), url: "/payment", icon: FileText },
          { title: t("nav.messages"), url: "/messages", icon: MessageSquare, badge: "1" },
        ],
      },
    ];
  }

  return [
    {
      key: "main",
      items: [
        { title: t("nav.dashboard"), url: "/", icon: Home },
        { title: t("nav.orders"), url: "/commandes", icon: Inbox },
        { title: t("nav.clients"), url: "/companies", icon: Users },
      ],
    },
    {
      key: "finance",
      title: t("nav.finance"),
      items: [
        { title: t("nav.overview"), url: "/finances", icon: Home },
        { title: t("nav.createInvoice"), url: "/create", icon: Inbox },
        { title: t("nav.newPayment"), url: "/payment", icon: FileText },
      ],
    },
    {
      key: "stock",
      title: t("nav.stockManagement"),
      restricted: true,
      items: [
        { title: t("nav.products"), url: "/products", icon: Folder },
        { title: t("nav.stock"), url: "/stock", icon: Folder },
      ],
    },
    {
      key: "admin",
      title: t("nav.administration"),
      restricted: true,
      items: [
        { title: t("nav.users"), url: "/users", icon: Users },
        { title: t("nav.documents"), url: "/drive", icon: Folder },
        { title: t("nav.settings"), url: "/settings", icon: Settings },
      ],
    },
  ];
}

export function AppSidebar() {
  const { profile, logout } = useContext(AuthContext);
  const { t } = useLanguage();
  const location = useLocation();
  const role = profile?.role || "USER";

  const sections = useSections(t, role);

  const [collapsed, setCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useMemo(() => {
    sections.forEach((section) => {
      if (section.items.some((i) => i.url === location.pathname)) {
        setOpenSection(section.key);
      }
    });
  }, [location.pathname]);

  const isRestricted = (section) =>
    section.restricted && (role === "USER" || role === "CLIENT");

  const renderItem = (item) => {
    const active = location.pathname === item.url;

    return (
      <Link
        key={item.title}
        to={item.url}
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[12.5px] font-medium transition-all duration-150 relative border border-transparent
          ${active
            ? "bg-gradient-to-r from-[rgba(123,82,232,0.12)] to-[rgba(26,188,176,0.06)] border-[rgba(123,82,232,0.18)] text-[var(--ob-tx)]"
            : "text-[var(--ob-txm)] hover:bg-[var(--ob-surf2)] hover:text-[var(--ob-tx)]"}
        `}
      >
        {active && (
          <span className="absolute left-0 top-[22%] h-[56%] w-[2px] rounded-r-sm bg-gradient-to-b from-[var(--ob-p)] to-[var(--ob-tl)]" />
        )}
        <item.icon className={`h-[14px] w-[14px] shrink-0 transition-colors ${active ? "text-[var(--ob-p2)]" : "opacity-65"}`} />
        {!collapsed && <span className="truncate">{item.title}</span>}
        {!collapsed && item.badge && (
          <span className="ml-auto text-[8.5px] font-bold px-[5px] py-[1px] rounded-[10px] bg-[var(--ob-or)] text-white">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const renderSection = (section) => {
    if (isRestricted(section)) return null;

    if (section.key === "main") {
      return (
        <div key={section.key} className="space-y-[2px]">
          {section.items.map(renderItem)}
        </div>
      );
    }

    const isOpen = openSection === section.key;

    return (
      <div key={section.key} className="space-y-[2px]">
        <button
          onClick={() => setOpenSection(isOpen ? null : section.key)}
          className="flex items-center justify-between w-full px-3 py-2 text-[8px] font-bold uppercase tracking-[1.3px] text-[var(--ob-txdd)] font-mono hover:text-[var(--ob-txm)]"
        >
          {!collapsed && section.title}
          {!collapsed && (
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-[2px]"
            >
              {section.items.map(renderItem)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Sidebar
      className={`h-screen flex flex-col transition-all duration-300 border-r border-[var(--ob-brd)]
        ${collapsed ? "w-20" : "w-[210px]"}
      `}
      style={{ background: "var(--sidebar)" }}
    >
      {/* Logo */}
      <div className="px-[13px] py-[15px] border-b border-[var(--ob-brd)]">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-[9px]">
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-gradient-to-br from-[rgba(94,59,143,0.3)] to-[rgba(26,188,176,0.15)] border border-[rgba(123,82,232,0.3)]">
                <span className="text-[13px]">🖨</span>
              </div>
              <div>
                <div className="font-['Syne'] text-[13px] font-bold text-[var(--ob-tx)]">PrintFlow</div>
                <div className="text-[9px] text-[var(--ob-txd)]">Print Manager</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[var(--ob-txm)] hover:text-[var(--ob-tx)] text-sm"
          >
            ☰
          </button>
        </div>

        {/* API status */}
        {!collapsed && (
          <div className="flex items-center gap-[5px] mt-2 rounded-full px-[9px] py-[3px] w-fit bg-[rgba(61,214,140,0.07)] border border-[rgba(61,214,140,0.2)]">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--ob-grn)] shadow-[0_0_8px_rgba(61,214,140,0.6)]" />
            <span className="text-[9px] text-[rgba(61,214,140,0.8)]">API connected</span>
          </div>
        )}
      </div>

      {/* Scrollable nav */}
      <SidebarContent className="flex-1 overflow-y-auto py-[10px] px-[7px] space-y-4">
        {/* CTA */}
        {!collapsed && (
          <Link to="/Commandes/creer">
            <button className="w-full rounded-[10px] px-[13px] py-[10px] text-white text-[12px] font-semibold font-['Syne'] flex items-center justify-center gap-2 transition-all relative overflow-hidden bg-gradient-to-r from-[#5E3B8F] via-[#7B52E8] to-[#1ABCB0] bg-[length:200%] animate-[gshift_4s_ease_infinite] hover:opacity-90">
              <PlusCircle size={14} /> {t("nav.newOrder")}
            </button>
          </Link>
        )}

        {sections.map(renderSection)}
      </SidebarContent>

      {/* User area */}
      <SidebarFooter className="border-t border-[var(--ob-brd)] px-[13px] py-[10px] space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-[27px] h-[27px] rounded-[7px] bg-gradient-to-br from-[#5E3B8F] to-[#1ABCB0] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {profile?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-[var(--ob-tx)] truncate">{profile?.username || "User"}</div>
              <div className="text-[9px] text-[var(--ob-txd)]">{role}</div>
            </div>
          </div>
        )}

        <Link
          to="/help"
          className="flex items-center gap-2 text-[12px] text-[var(--ob-txm)] hover:text-[var(--ob-tx)] transition-colors"
        >
          <HelpCircle className="h-[14px] w-[14px]" />
          {!collapsed && t("nav.help")}
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-[12px] text-[var(--ob-txm)] hover:text-[var(--ob-red)] w-full transition-colors"
        >
          <LogOut className="h-[14px] w-[14px]" />
          {!collapsed && t("nav.logout")}
        </button>
      </SidebarFooter>

      <style>{`
        @keyframes gshift { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
      `}</style>
    </Sidebar>
  );
}
