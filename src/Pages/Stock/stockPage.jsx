import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Boxes, ArrowRight, AlertTriangle, TrendingUp } from "lucide-react";
import getRawMaterials from "@/Services/StockService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, StatCard, DataCard, DataTable, StatusPill, EmptyState,
  Toolbar, Button,
} from "@/Components/primitives";

export default function RawMaterialsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMaterials = async () => {
    setIsRefreshing(true);
    try {
      const data = await getRawMaterials();
      setMaterials(Array.isArray(data) ? data : data?.[0] || []);
    } catch {
      setMaterials([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return materials;
    const q = searchTerm.toLowerCase();
    return materials.filter((m) =>
      [m.name].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [materials, searchTerm]);

  const lowStockCount = materials.filter((m) => parseFloat(m.stock_quantity) <= 10).length;
  const highCostCount = materials.filter((m) => parseFloat(m.cost_per_unit) >= 100).length;

  const columns = [
    {
      key: "name",
      header: t("lang") === "fr" ? "Materiel" : "Material",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
            <Boxes size={15} />
          </div>
          <div className="font-semibold text-[var(--text)]">{row.name}</div>
        </div>
      ),
    },
    {
      key: "stock_quantity",
      header: t("lang") === "fr" ? "Quantite" : "Stock",
      align: "right",
      render: (row) => {
        const qty = parseFloat(row.stock_quantity);
        const tone = qty <= 10 ? "danger" : qty <= 30 ? "warning" : "success";
        return (
          <div className="flex items-center justify-end gap-2">
            <span className="font-semibold text-[var(--text)] tabular-nums">{row.stock_quantity}</span>
            <StatusPill
              tone={tone}
              label={qty <= 10 ? "Low" : qty <= 30 ? "Med" : "OK"}
              size="sm"
              dot={false}
            />
          </div>
        );
      },
    },
    {
      key: "cost_per_unit",
      header: t("lang") === "fr" ? "Cout unitaire" : "Cost per unit",
      align: "right",
      render: (row) => (
        <span className="tabular-nums font-medium">{row.cost_per_unit?.toLocaleString()} DZD</span>
      ),
    },
    {
      key: "created_at",
      header: t("lang") === "fr" ? "Ajoute le" : "Added",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
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
            navigate(`/stock/${row.id}`, { state: { material: row } });
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
        title={t("nav.stock")}
        subtitle={
          t("lang") === "fr" ? "Gerez votre stock de matieres premieres" : "Manage your raw materials inventory"
        }
        icon={Boxes}
        actions={
          <Button variant="accent" size="md" onClick={() => navigate("/stock/create")}>
            <Plus size={15} />
            {t("lang") === "fr" ? "Ajouter" : "Add material"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label={t("lang") === "fr" ? "Total materiaux" : "Total materials"}
          value={materials.length}
          icon={Boxes}
          tone="accent"
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Stock faible" : "Low stock"}
          value={lowStockCount}
          hint={t("lang") === "fr" ? "<= 10 unites" : "<= 10 units"}
          icon={AlertTriangle}
          tone={lowStockCount > 0 ? "danger" : "success"}
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Cout eleve" : "High cost"}
          value={highCostCount}
          hint={t("lang") === "fr" ? ">= 100 DZD" : ">= 100 DZD"}
          icon={TrendingUp}
          tone="warning"
          loading={isLoading}
        />
      </div>

      <Toolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={
          t("lang") === "fr" ? "Rechercher un materiel..." : "Search materials..."
        }
        actions={
          <Button variant="outline" size="md" onClick={fetchMaterials} disabled={isRefreshing}>
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {t("lang") === "fr" ? "Actualiser" : "Refresh"}
          </Button>
        }
      />

      <DataCard padded={false}>
        <DataTable
          columns={columns}
          rows={filtered}
          loading={isLoading}
          onRowClick={(row) => navigate(`/stock/${row.id}`, { state: { material: row } })}
          empty={
            <EmptyState
              icon={Boxes}
              title={t("lang") === "fr" ? "Aucun materiel" : "No materials"}
              action={
                <Button variant="accent" onClick={() => navigate("/stock/create")}>
                  <Plus size={15} />
                  {t("lang") === "fr" ? "Ajouter un materiel" : "Add material"}
                </Button>
              }
            />
          }
        />
      </DataCard>
    </div>
  );
}
