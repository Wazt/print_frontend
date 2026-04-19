import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Package, ArrowRight } from "lucide-react";
import { getProducts } from "@/Services/ProductsService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, DataTable, EmptyState, Toolbar, Button,
} from "@/Components/primitives";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setIsRefreshing(true);
    try {
      const data = await getProducts({ all: true });
      setProducts(Array.isArray(data) ? data[0] || data : data || []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return products;
    const q = searchTerm.toLowerCase();
    return products.filter((p) =>
      [p.name, p.description].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [products, searchTerm]);

  const columns = [
    {
      key: "name",
      header: t("lang") === "fr" ? "Produit" : "Product",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
            <Package size={15} />
          </div>
          <div>
            <div className="font-semibold text-[var(--text)]">{row.name}</div>
            {row.description && (
              <div className="text-[12px] text-[var(--text-3)] truncate max-w-md">
                {row.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "base_price",
      header: "Prix",
      align: "right",
      render: (row) => (
        <span className="font-semibold text-[var(--text)] tabular-nums">
          {row.base_price?.toLocaleString()} DZD
        </span>
      ),
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
            navigate(`/products/${row.id}`, { state: { product: row } });
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
        title={t("nav.products")}
        subtitle={
          t("lang") === "fr" ? "Gerez votre catalogue de produits" : "Manage your product catalog"
        }
        icon={Package}
        actions={
          <Button variant="accent" size="md" onClick={() => navigate("/products/new")}>
            <Plus size={15} />
            {t("lang") === "fr" ? "Ajouter" : "Add product"}
          </Button>
        }
      />

      <Toolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("lang") === "fr" ? "Rechercher un produit..." : "Search products..."}
        actions={
          <Button variant="outline" size="md" onClick={fetchProducts} disabled={isRefreshing}>
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
          onRowClick={(row) => navigate(`/products/${row.id}`, { state: { product: row } })}
          empty={
            <EmptyState
              icon={Package}
              title={t("lang") === "fr" ? "Aucun produit" : "No products"}
              action={
                <Button variant="accent" onClick={() => navigate("/products/new")}>
                  <Plus size={15} />
                  {t("lang") === "fr" ? "Ajouter un produit" : "Add product"}
                </Button>
              }
            />
          }
        />
      </DataCard>
    </div>
  );
}
