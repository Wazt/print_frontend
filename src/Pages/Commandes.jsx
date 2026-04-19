import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Download, Plus, RefreshCw, Package, CheckCircle, Clock, ArrowRight,
} from "lucide-react";
import { getOrders } from "@/Services/OrdersService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, StatCard, DataCard, DataTable, StatusPill, EmptyState,
  Toolbar, FilterChip, Button,
} from "@/Components/primitives";

const STATUS_FILTERS = [
  { value: "all", label: "Toutes" },
  { value: "PENDING", label: "En attente" },
  { value: "ACCEPTED", label: "Acceptees" },
  { value: "PROCESSING", label: "En production" },
  { value: "DELIVRED", label: "Livrees" },
  { value: "PAIED", label: "Payees" },
  { value: "FINISHED", label: "Terminees" },
  { value: "CANCELLED", label: "Annulees" },
  { value: "REJECTED", label: "Rejetees" },
];

const STATUS_FILTERS_EN = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "PROCESSING", label: "Processing" },
  { value: "DELIVRED", label: "Delivered" },
  { value: "PAIED", label: "Paid" },
  { value: "FINISHED", label: "Finished" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REJECTED", label: "Rejected" },
];

export default function Commandes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total_items: 0 });

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentStatus = searchParams.get("status") || "all";

  const fetchOrders = async (page = currentPage, status = currentStatus) => {
    setIsRefreshing(true);
    try {
      const params = { page };
      if (status && status !== "all") params.status = status;
      const response = await getOrders(params);
      setOrders(response[0] || []);
      setPagination(response[1] || { page: 1, total_pages: 1, total_items: 0 });
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, currentStatus);
  }, [currentPage, currentStatus]);

  const handleStatusChange = (newStatus) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", newStatus);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const q = searchTerm.toLowerCase();
    return orders.filter((order) =>
      [order.order_number, order.company?.name, order.created_by]
        .filter(Boolean)
        .some((v) => v.toString().toLowerCase().includes(q))
    );
  }, [orders, searchTerm]);

  const statusCounts = useMemo(() => ({
    PENDING: orders.filter((o) => o.status?.toUpperCase() === "PENDING").length,
    PROCESSING:
      orders.filter((o) => o.status?.toUpperCase() === "PROCESSING").length +
      orders.filter((o) => o.status?.toUpperCase() === "PROCESSED").length,
    FINISHED: orders.filter((o) => o.status?.toUpperCase() === "FINISHED").length,
  }), [orders]);

  const filters = t("lang") === "fr" ? STATUS_FILTERS : STATUS_FILTERS_EN;

  const columns = [
    {
      key: "order_number",
      header: "Order",
      render: (row) => (
        <div>
          <div className="font-semibold text-[var(--text)] font-mono text-[13px]">
            {row.order_number}
          </div>
          <div className="text-[11px] text-[var(--text-3)] mt-0.5">
            {row.creator?.username || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Client",
      render: (row) => row.company?.name || "—",
    },
    {
      key: "created_at",
      header: "Date",
      render: (row) =>
        new Date(row.created_at).toLocaleDateString(t("lang") === "fr" ? "fr-FR" : "en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      key: "order_price",
      header: "Montant",
      align: "right",
      render: (row) => (
        <span className="font-semibold text-[var(--text)] tabular-nums">
          {row.order_price?.toLocaleString()} DZD
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/Commandes/OrderDetails/${row.id}`);
          }}
        >
          {t("lang") === "fr" ? "Voir" : "View"}
          <ArrowRight size={13} />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("orders.title")}
        subtitle={t("orders.subtitle")}
        actions={
          <>
            <Button variant="outline" size="md">
              <Download size={15} />
              {t("orders.export")}
            </Button>
            <Button variant="accent" size="md" onClick={() => navigate("/Commandes/creer")}>
              <Plus size={15} />
              {t("orders.newOrder")}
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t("orders.totalOrders")}
          value={pagination.total_items}
          icon={Package}
          tone="accent"
          loading={isLoading}
        />
        <StatCard
          label={t("orders.pending")}
          value={statusCounts.PENDING}
          icon={Clock}
          tone="warning"
          loading={isLoading}
        />
        <StatCard
          label={t("orders.inProgress")}
          value={statusCounts.PROCESSING}
          icon={ArrowRight}
          tone="accent"
          loading={isLoading}
        />
        <StatCard
          label={t("orders.completed")}
          value={statusCounts.FINISHED}
          icon={CheckCircle}
          tone="success"
          loading={isLoading}
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("lang") === "fr" ? "Rechercher une commande..." : "Search orders..."}
        actions={
          <Button
            variant="outline"
            size="md"
            onClick={() => fetchOrders(currentPage, currentStatus)}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {t("lang") === "fr" ? "Actualiser" : "Refresh"}
          </Button>
        }
      />

      {/* Status filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <FilterChip
            key={f.value}
            active={currentStatus === f.value}
            onClick={() => handleStatusChange(f.value)}
          >
            {f.label}
          </FilterChip>
        ))}
      </div>

      {/* Table */}
      <DataCard padded={false}>
        <DataTable
          columns={columns}
          rows={filteredOrders}
          loading={isLoading}
          onRowClick={(row) => navigate(`/Commandes/OrderDetails/${row.id}`)}
          empty={
            <EmptyState
              illustration={searchTerm ? undefined : "production"}
              icon={searchTerm ? Package : undefined}
              title={t("lang") === "fr" ? "Aucune commande" : "No orders found"}
              description={
                searchTerm
                  ? t("lang") === "fr"
                    ? "Essayez d'ajuster votre recherche"
                    : "Try adjusting your search"
                  : t("lang") === "fr"
                    ? "Commencez par creer votre premiere commande d'impression"
                    : "Get started by creating your first print order"
              }
              action={
                <Button variant="accent" onClick={() => navigate("/Commandes/creer")}>
                  <Plus size={15} />
                  {t("orders.newOrder")}
                </Button>
              }
            />
          }
        />

        {pagination.total_pages > 1 && (
          <div className="border-t border-[var(--border)] px-5 py-3 flex items-center justify-between">
            <div className="text-[13px] text-[var(--text-3)]">
              {t("lang") === "fr" ? "Page" : "Page"}{" "}
              <span className="font-semibold text-[var(--text)]">{pagination.page}</span>{" "}
              {t("lang") === "fr" ? "sur" : "of"}{" "}
              <span className="font-semibold text-[var(--text)]">{pagination.total_pages}</span>
              <span className="ml-2 text-[var(--text-4)]">·</span>
              <span className="ml-2">
                {pagination.total_items} {t("lang") === "fr" ? "commandes" : "orders"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                {t("lang") === "fr" ? "Precedent" : "Previous"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.total_pages}
              >
                {t("lang") === "fr" ? "Suivant" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </DataCard>
    </div>
  );
}
