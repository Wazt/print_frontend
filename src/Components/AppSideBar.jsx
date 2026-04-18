import {
  Home, Inbox, Users, Settings, LogOut, PlusCircle, Folder,
  HelpCircle, FileText, MessageSquare, Boxes, Package, Receipt, Printer,
  Contact, Network, AlertTriangle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

function useNavSections(t, role) {
  if (role === "CLIENT") {
    return [
      {
        items: [
          { title: t("nav.dashboard"), url: "/", icon: Home },
          { title: t("nav.myOrders"), url: "/Commandes", icon: Inbox, badge: "3" },
          { title: t("nav.myFiles"), url: "/drive", icon: Folder },
          { title: t("nav.invoices"), url: "/payment", icon: Receipt },
          { title: t("nav.messages"), url: "/messages", icon: MessageSquare, badge: "1" },
        ],
      },
    ];
  }

  const isFr = t("lang") === "fr";

  return [
    {
      label: t("nav.dashboard"),
      items: [
        { title: t("nav.dashboard"), url: "/", icon: Home },
        { title: t("nav.orders"), url: "/Commandes", icon: Inbox },
        { title: t("nav.clients"), url: "/companies", icon: Users },
        { title: isFr ? "Contacts" : "Contacts", url: "/contacts", icon: Contact, isNew: true },
      ],
    },
    {
      label: t("nav.finance"),
      items: [
        { title: t("nav.newPayment"), url: "/payment", icon: Receipt },
      ],
    },
    {
      label: t("nav.stockManagement"),
      items: [
        { title: t("nav.products"), url: "/products", icon: Package },
        { title: t("nav.stock"), url: "/stock", icon: Boxes },
      ],
    },
    {
      label: t("nav.administration"),
      items: [
        { title: t("nav.users"), url: "/users", icon: Users },
        { title: t("nav.documents"), url: "/drive", icon: Folder },
        { title: isFr ? "Reseau" : "Network", url: "/network", icon: Network, isNew: true },
        { title: isFr ? "Alertes doublons" : "Duplicate alerts", url: "/admin/duplicate-alerts", icon: AlertTriangle, badge: "1", isNew: true },
        { title: t("nav.settings"), url: "/settings", icon: Settings },
      ],
    },
  ];
}

export function AppSidebar({ onNavigate }) {
  const { profile, logout } = useContext(AuthContext);
  const { t } = useLanguage();
  const location = useLocation();
  const role = profile?.role || "USER";
  const sections = useNavSections(t, role);

  const NavItem = ({ item }) => {
    const active = location.pathname === item.url || (item.url !== "/" && location.pathname.startsWith(item.url));
    return (
      <Link
        to={item.url}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`group flex items-center gap-2.5 h-9 px-3 rounded-[var(--radius)] text-[13px] font-medium transition-all ${
          active
            ? "bg-[var(--brand)] text-[var(--brand-fg)]"
            : "text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        }`}
      >
        <item.icon
          size={16}
          aria-hidden="true"
          className={active ? "" : "text-[var(--text-3)] group-hover:text-[var(--text-2)]"}
        />
        <span className="truncate flex-1">{item.title}</span>
        {item.isNew && !item.badge && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[var(--radius-pill)] uppercase tracking-wider ${
              active ? "bg-white/15 text-white" : "bg-[var(--success-bg)] text-[var(--success)]"
            }`}
          >
            NEW
          </span>
        )}
        {item.badge && (
          <span
            className={`text-[10px] font-semibold px-1.5 rounded-[var(--radius-pill)] ${
              active ? "bg-white/15 text-white" : "bg-[var(--accent-bg)] text-[var(--accent)]"
            }`}
            aria-label={`${item.badge} ${t("lang") === "fr" ? "nouveaux" : "new"}`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-[var(--sidebar-w)] h-screen flex flex-col bg-[var(--surface)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="h-[var(--topbar-h)] px-5 flex items-center border-b border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--brand)] flex items-center justify-center">
            <Printer size={16} className="text-[var(--brand-fg)]" />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-[var(--text)] tracking-tight leading-none">
              PrintFlow
            </div>
            <div className="text-[10px] text-[var(--text-3)] mt-0.5 font-mono">
              {role === "CLIENT" ? "Client Portal" : "Admin Console"}
            </div>
          </div>
        </Link>
      </div>

      {/* CTA */}
      <div className="px-3 pt-4">
        <Link to="/Commandes/creer" onClick={onNavigate}>
          <button className="w-full h-10 rounded-[var(--radius)] bg-[var(--accent)] hover:bg-[var(--accent-2)] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors">
            <PlusCircle size={15} />
            {t("nav.newOrder")}
          </button>
        </Link>
      </div>

      {/* Nav */}
      <nav
        aria-label={t("lang") === "fr" ? "Navigation principale" : "Main navigation"}
        className="flex-1 px-3 py-4 overflow-y-auto"
      >
        {sections.map((section, i) => {
          const labelId = `nav-section-${i}`;
          return (
            <div
              key={i}
              className={i > 0 ? "mt-6" : ""}
              role={section.label ? "group" : undefined}
              aria-labelledby={section.label ? labelId : undefined}
            >
              {section.label && (
                <div
                  id={labelId}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-4)] px-3 mb-2"
                >
                  {section.label}
                </div>
              )}
              <ul className="space-y-0.5 list-none">
                {section.items.map((item) => (
                  <li key={item.url}>
                    <NavItem item={item} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[var(--border)] space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius)]">
          <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--brand)] flex items-center justify-center text-[12px] font-semibold text-[var(--brand-fg)] flex-shrink-0">
            {profile?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-[var(--text)] truncate">{profile?.username || "User"}</div>
            <div className="text-[10px] text-[var(--text-3)]">{role}</div>
          </div>
        </div>

        <Link
          to="/help"
          onClick={onNavigate}
          className="flex items-center gap-2.5 h-9 px-3 rounded-[var(--radius)] text-[13px] text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors"
        >
          <HelpCircle size={15} />
          {t("nav.help")}
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 h-9 px-3 rounded-[var(--radius)] text-[13px] text-[var(--text-2)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)] transition-colors"
        >
          <LogOut size={15} />
          {t("nav.logout")}
        </button>
      </div>
    </aside>
  );
}
