import { useEffect, useState } from "react";
import {
  ShoppingCart, CheckCircle, Clock, Package, TrendingUp, Receipt, DollarSign,
  Activity, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { get_order_analytics } from "@/Services/AnalyticsService";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { PageHeader, StatCard, DataCard, SectionTitle, Button } from "@/Components/primitives";

export default function Home() {
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
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        actions={
          <Button variant="accent" size="md" asChild>
            <Link to="/Commandes/creer">
              {t("nav.newOrder")}
              <ArrowRight size={15} />
            </Link>
          </Button>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t("dashboard.totalOrders")}
          value={stats?.order_stats?.total_orders}
          hint={t("dashboard.allTime")}
          icon={ShoppingCart}
          tone="accent"
          loading={isLoading}
        />
        <StatCard
          label={t("dashboard.recentOrders")}
          value={stats?.order_stats?.recent_created}
          hint={t("dashboard.createdRecently")}
          icon={Clock}
          tone="warning"
          loading={isLoading}
        />
        <StatCard
          label={t("dashboard.completedOrders")}
          value={stats?.order_stats?.total_finished}
          delta={`${pct(stats?.order_stats?.total_finished, stats?.order_stats?.total_orders)}%`}
          deltaPositive
          icon={CheckCircle}
          tone="success"
          loading={isLoading}
        />
        <StatCard
          label={t("dashboard.acceptedOrders")}
          value={stats?.order_stats?.total_accepted}
          delta={`${pct(stats?.order_stats?.total_accepted, stats?.order_stats?.total_orders)}%`}
          deltaPositive
          icon={Package}
          loading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DataCard
          title={t("lang") === "fr" ? "Apercu commandes" : "Order Overview"}
          description={t("lang") === "fr" ? "Distribution par statut" : "Distribution of order statuses"}
          icon={Activity}
        >
          <div className="space-y-4">
            {[
              {
                label: "Total",
                value: stats?.order_stats?.total_orders || 0,
                pctVal: 100,
                color: "var(--accent)",
              },
              {
                label: t("orders.accepted"),
                value: stats?.order_stats?.total_accepted || 0,
                pctVal: pct(stats?.order_stats?.total_accepted, stats?.order_stats?.total_orders),
                color: "var(--info)",
              },
              {
                label: t("orders.pending"),
                value: stats?.order_stats?.recent_created || 0,
                pctVal: pct(stats?.order_stats?.recent_created, stats?.order_stats?.total_orders),
                color: "var(--warning)",
              },
              {
                label: t("orders.completed"),
                value: stats?.order_stats?.total_finished || 0,
                pctVal: pct(stats?.order_stats?.total_finished, stats?.order_stats?.total_orders),
                color: "var(--success)",
              },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: row.color }} />
                    <span className="text-[13px] text-[var(--text-2)]">{row.label}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-[var(--text)] tabular-nums">{row.value}</span>
                </div>
                <div className="h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${row.pctVal}%`, background: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        <DataCard
          title={t("lang") === "fr" ? "Statut factures" : "Invoice Status"}
          description={t("lang") === "fr" ? "Repartition des paiements" : "Payment status breakdown"}
          icon={Receipt}
        >
          <div className="space-y-3">
            {[
              {
                label: t("lang") === "fr" ? "Payees" : "Paid",
                sub: t("lang") === "fr" ? "Reglement complet" : "Fully settled",
                value: stats?.facture_stats?.PAID || 0,
                color: "var(--success)",
                bg: "var(--success-bg)",
              },
              {
                label: t("lang") === "fr" ? "Partiellement payees" : "Partial Paid",
                sub: t("lang") === "fr" ? "Paiement partiel" : "Partially settled",
                value: stats?.facture_stats?.PARTIAL_PAID || 0,
                color: "var(--info)",
                bg: "var(--info-bg)",
              },
              {
                label: t("lang") === "fr" ? "En attente" : "Pending",
                sub: t("lang") === "fr" ? "Attente paiement" : "Awaiting payment",
                value: stats?.facture_stats?.PENDING_PAYMENT || 0,
                color: "var(--warning)",
                bg: "var(--warning-bg)",
              },
            ].map((inv) => (
              <div
                key={inv.label}
                className="p-3 rounded-[var(--radius)]"
                style={{ background: inv.bg }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold" style={{ color: inv.color }}>
                      {inv.label}
                    </div>
                    <div className="text-[11px] mt-0.5 opacity-70" style={{ color: inv.color }}>
                      {inv.sub}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold tabular-nums" style={{ color: inv.color }}>
                      {inv.value}
                    </div>
                    <div className="text-[11px] opacity-70" style={{ color: inv.color }}>
                      {pct(inv.value, totalInvoices)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-[13px] text-[var(--text-3)]">Total</span>
              <span className="text-[16px] font-semibold text-[var(--text)] tabular-nums">{totalInvoices}</span>
            </div>
          </div>
        </DataCard>
      </div>

      {/* Quick stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={t("lang") === "fr" ? "Taux completion" : "Completion rate"}
          value={`${pct(stats?.order_stats?.total_finished, stats?.order_stats?.total_orders)}%`}
          hint={t("lang") === "fr" ? "Terminees vs total" : "Finished vs total"}
          icon={TrendingUp}
          tone="success"
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Taux paiement" : "Payment rate"}
          value={`${pct(stats?.facture_stats?.PAID || 0, totalInvoices)}%`}
          hint={t("lang") === "fr" ? "Factures payees" : "Invoices paid"}
          icon={DollarSign}
          tone="accent"
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Taux acceptation" : "Acceptance rate"}
          value={`${pct(stats?.order_stats?.total_accepted, stats?.order_stats?.total_orders)}%`}
          hint={t("lang") === "fr" ? "Acceptees vs total" : "Accepted vs total"}
          icon={CheckCircle}
          tone="success"
          loading={isLoading}
        />
      </div>
    </div>
  );
}
