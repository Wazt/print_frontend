import { Skeleton } from "@/Components/ui/skeleton";
import {
  Activity,
  ShoppingCart,
  CheckCircle,
  Clock,
  Receipt,
  DollarSign,
  TrendingUp,
  Package,
  CreditCard,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { get_order_analytics } from "@/Services/AnalyticsService";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

function Home() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await get_order_analytics();
        setStats(response);
      } catch {
        toast.error("Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const totalInvoices = stats?.facture_stats
    ? Object.values(stats.facture_stats).reduce((sum, val) => sum + val, 0)
    : 0;

  const pct = (val, total) => (total ? Math.round((val / total) * 100) : 0);

  return (
    <div className="space-y-5 page-in">
      {/* Header */}
      <div>
        <h1 className="font-['Syne'] text-[22px] md:text-[26px] font-bold text-[var(--ob-tx)]">
          {t("dashboard.title")}
        </h1>
        <p className="text-[13px] text-[var(--ob-txd)] mt-1">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {[
          { label: t("dashboard.totalOrders"), val: stats?.order_stats?.total_orders, sub: t("dashboard.allTime"), subCls: "", icon: ShoppingCart, accent: "var(--ob-pl)" },
          { label: t("dashboard.recentOrders"), val: stats?.order_stats?.recent_created, sub: t("dashboard.createdRecently"), subCls: "warn", icon: Clock, accent: "var(--ob-tll)" },
          { label: t("dashboard.completedOrders"), val: stats?.order_stats?.total_finished, sub: `${pct(stats?.order_stats?.total_finished, stats?.order_stats?.total_orders)}% completed`, subCls: "up", icon: CheckCircle, accent: "var(--ob-orl)" },
          { label: t("dashboard.acceptedOrders"), val: stats?.order_stats?.total_accepted, sub: `${pct(stats?.order_stats?.total_accepted, stats?.order_stats?.total_orders)}% accepted`, subCls: "up", icon: Package, accent: "var(--ob-grnl)" },
        ].map((kpi, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[13px] border border-[var(--ob-brd)] p-[12px_14px] cursor-default transition-all duration-200 hover:border-[var(--ob-brd2)] hover:-translate-y-[1px]"
            style={{ background: "var(--card)" }}
          >
            <div className="absolute top-0 right-0 w-[45px] h-[45px] rounded-[0_13px_0_45px] opacity-45" style={{ background: kpi.accent }} />
            <div className="text-[9px] font-bold uppercase tracking-[0.7px] text-[var(--ob-txd)] mb-[5px]">{kpi.label}</div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded bg-[var(--ob-surf3)]" />
            ) : (
              <div className="font-['Syne'] text-[24px] font-bold text-[var(--ob-tx)] leading-none">{kpi.val ?? "—"}</div>
            )}
            <div className={`text-[9.5px] mt-1 ${
              kpi.subCls === "up" ? "text-[var(--ob-grn)]" : kpi.subCls === "warn" ? "text-[var(--ob-or)]" : "text-[var(--ob-txd)]"
            }`}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-[10px] lg:grid-cols-2">
        {/* Order Overview */}
        <div className="rounded-[13px] border border-[var(--ob-brd)] p-[14px] overflow-hidden" style={{ background: "var(--card)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-['Syne'] text-[13px] font-semibold text-[var(--ob-tx)]">
                {t("lang") === "fr" ? "Apercu commandes" : "Order Overview"}
              </div>
              <div className="text-[10px] text-[var(--ob-txd)] mt-[2px]">
                {t("lang") === "fr" ? "Distribution par statut" : "Distribution of order statuses"}
              </div>
            </div>
            <div className="w-[34px] h-[34px] rounded-[10px] border border-[var(--ob-brd)] bg-[var(--ob-surf2)] flex items-center justify-center">
              <Activity size={15} className="text-[var(--ob-p2)]" />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded bg-[var(--ob-surf3)]" />
              <Skeleton className="h-10 w-full rounded bg-[var(--ob-surf3)]" />
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Total", val: stats?.order_stats?.total_orders || 0, pctVal: 100, from: "var(--ob-p)", to: "#9B7DC8" },
                { label: t("orders.accepted"), val: stats?.order_stats?.total_accepted || 0, pctVal: pct(stats?.order_stats?.total_accepted, stats?.order_stats?.total_orders), from: "var(--ob-tl)", to: "#2EDCC8" },
                { label: t("orders.pending"), val: stats?.order_stats?.recent_created || 0, pctVal: pct(stats?.order_stats?.recent_created, stats?.order_stats?.total_orders), from: "var(--ob-or)", to: "#FF8055" },
                { label: t("orders.completed"), val: stats?.order_stats?.total_finished || 0, pctVal: pct(stats?.order_stats?.total_finished, stats?.order_stats?.total_orders), from: "var(--ob-grn)", to: "#6AEDB5" },
              ].map((row, i) => (
                <div key={i} className="space-y-[5px]">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <div className="flex items-center gap-2">
                      <div className="h-[10px] w-[10px] rounded-full" style={{ background: row.from }} />
                      <span className="font-medium text-[var(--ob-txm)]">{row.label}</span>
                    </div>
                    <span className="font-semibold text-[var(--ob-tx)]">{row.val}</span>
                  </div>
                  <div className="h-[5px] bg-[var(--ob-surf3)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${row.pctVal}%`, background: `linear-gradient(90deg, ${row.from}, ${row.to})` }}
                    />
                  </div>
                  {i > 0 && (
                    <p className="text-[9px] text-[var(--ob-txd)] text-right">{row.pctVal}% of total</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoice Status */}
        <div className="rounded-[13px] border border-[var(--ob-brd)] p-[14px] overflow-hidden" style={{ background: "var(--card)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-['Syne'] text-[13px] font-semibold text-[var(--ob-tx)]">
                {t("lang") === "fr" ? "Statut factures" : "Invoice Status"}
              </div>
              <div className="text-[10px] text-[var(--ob-txd)] mt-[2px]">
                {t("lang") === "fr" ? "Repartition des paiements" : "Payment status breakdown"}
              </div>
            </div>
            <div className="w-[34px] h-[34px] rounded-[10px] border border-[var(--ob-brd)] bg-[var(--ob-surf2)] flex items-center justify-center">
              <Receipt size={15} className="text-[var(--ob-tl)]" />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded bg-[var(--ob-surf3)]" />
              <Skeleton className="h-20 w-full rounded bg-[var(--ob-surf3)]" />
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: t("lang") === "fr" ? "Payees" : "Paid", sub: t("lang") === "fr" ? "Reglement complet" : "Fully settled", val: stats?.facture_stats?.PAID || 0, bg: "var(--ob-grnl)", border: "rgba(61,214,140,0.2)", color: "var(--ob-grn)", icon: CheckCircle },
                { label: t("lang") === "fr" ? "Partiellement payees" : "Partial Paid", sub: t("lang") === "fr" ? "Paiement partiel" : "Partially settled", val: stats?.facture_stats?.PARTIAL_PAID || 0, bg: "var(--ob-pl)", border: "rgba(123,82,232,0.2)", color: "var(--ob-p2)", icon: CreditCard },
                { label: t("lang") === "fr" ? "En attente" : "Pending", sub: t("lang") === "fr" ? "En attente de paiement" : "Awaiting payment", val: stats?.facture_stats?.PENDING_PAYMENT || 0, bg: "var(--ob-orl)", border: "rgba(232,98,42,0.2)", color: "var(--ob-or)", icon: Clock },
              ].map((inv, i) => (
                <div key={i} className="p-3 rounded-[10px] border" style={{ background: inv.bg, borderColor: inv.border }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: inv.bg }}>
                        <inv.icon size={14} style={{ color: inv.color }} />
                      </div>
                      <div>
                        <p className="text-[11.5px] font-semibold" style={{ color: inv.color }}>{inv.label}</p>
                        <p className="text-[9px]" style={{ color: inv.color, opacity: 0.7 }}>{inv.sub}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: inv.color }}>{inv.val}</p>
                      <p className="text-[9px]" style={{ color: inv.color, opacity: 0.7 }}>
                        {pct(inv.val, totalInvoices)}%
                      </p>
                    </div>
                  </div>
                  <div className="h-[4px] rounded-full overflow-hidden" style={{ background: inv.border }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct(inv.val, totalInvoices)}%`, background: inv.color }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t border-[var(--ob-brd)] flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--ob-txd)]">Total</span>
                <span className="text-[14px] font-bold text-[var(--ob-tx)]">{totalInvoices}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-[10px] md:grid-cols-3">
        {[
          { label: t("lang") === "fr" ? "Taux completion" : "Completion Rate", sub: t("lang") === "fr" ? "Terminees vs total" : "Orders finished vs total", val: `${pct(stats?.order_stats?.total_finished, stats?.order_stats?.total_orders)}%`, icon: TrendingUp, color: "var(--ob-grn)", accent: "var(--ob-grnl)" },
          { label: t("lang") === "fr" ? "Taux paiement" : "Payment Rate", sub: t("lang") === "fr" ? "Factures payees vs total" : "Invoices paid vs total", val: `${pct(stats?.facture_stats?.PAID || 0, totalInvoices)}%`, icon: DollarSign, color: "var(--ob-tl)", accent: "var(--ob-tll)" },
          { label: t("lang") === "fr" ? "Taux acceptation" : "Acceptance Rate", sub: t("lang") === "fr" ? "Acceptees vs total" : "Orders accepted vs total", val: `${pct(stats?.order_stats?.total_accepted, stats?.order_stats?.total_orders)}%`, icon: CheckCircle, color: "var(--ob-p2)", accent: "var(--ob-pl)" },
        ].map((s, i) => (
          <div key={i} className="rounded-[13px] border border-[var(--ob-brd)] p-[14px] overflow-hidden" style={{ background: "var(--card)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-medium text-[var(--ob-txm)]">{s.label}</p>
                <p className="text-[9px] text-[var(--ob-txd)] mt-[2px]">{s.sub}</p>
              </div>
              <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center" style={{ background: s.accent }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded bg-[var(--ob-surf3)]" />
            ) : (
              <div className="space-y-2">
                <p className="font-['Syne'] text-[24px] font-bold text-[var(--ob-tx)]">{s.val}</p>
                <div className="h-[5px] bg-[var(--ob-surf3)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: s.val, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .page-in { animation: pg .2s ease; }
        @keyframes pg { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
}

export default Home;
