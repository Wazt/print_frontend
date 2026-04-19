import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, RefreshCw, Building2, ArrowRight } from "lucide-react";
import { getCompanies } from "@/Services/CompanyService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, StatCard, DataCard, DataTable, StatusPill, EmptyState,
  Toolbar, FilterChip, Button,
} from "@/Components/primitives";

const FILTERS = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Actives" },
  { value: "inactive", label: "Inactives" },
];

const FILTERS_EN = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentStatus = searchParams.get("status") || "all";

  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total_items: 0 });

  const fetchCompanies = async (page = currentPage, status = currentStatus) => {
    setIsRefreshing(true);
    try {
      const params = { page };
      if (status !== "all") params.status = status;
      const response = await getCompanies(params);
      setCompanies(response[0] || []);
      setPagination(response[1] || pagination);
    } catch {
      setCompanies([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage, currentStatus);
  }, [currentPage, currentStatus]);

  const handleStatusChange = (status) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const filtered = useMemo(() => {
    if (!searchTerm) return companies;
    const q = searchTerm.toLowerCase();
    return companies.filter((c) =>
      [c.name, c.email, c.phone].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [companies, searchTerm]);

  const filters = t("lang") === "fr" ? FILTERS : FILTERS_EN;

  const columns = [
    {
      key: "name",
      header: t("lang") === "fr" ? "Entreprise" : "Company",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] font-semibold text-[12px] flex-shrink-0">
            {row.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="font-semibold text-[var(--text)]">{row.name}</div>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (row) => row.email || "—" },
    {
      key: "phone",
      header: t("lang") === "fr" ? "Telephone" : "Phone",
      render: (row) => <span className="font-mono text-[13px]">{row.phone || "—"}</span>,
    },
    {
      key: "created_at",
      header: t("lang") === "fr" ? "Cree le" : "Joined",
      render: (row) =>
        new Date(row.created_at).toLocaleDateString(t("lang") === "fr" ? "fr-FR" : "en-US"),
    },
    {
      key: "status",
      header: t("lang") === "fr" ? "Statut" : "Status",
      render: (row) => <StatusPill status={row.status || "ACTIVE"} />,
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
            navigate(`/companies/companyDetails/${row.id}`);
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
        title={t("nav.clients")}
        subtitle={t("lang") === "fr" ? "Gerez vos entreprises partenaires" : "Manage partner companies"}
        icon={Building2}
        actions={
          <Button variant="accent" size="md" onClick={() => navigate("/companies/create")}>
            <Plus size={15} />
            {t("lang") === "fr" ? "Nouvelle entreprise" : "New company"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total"
          value={pagination.total_items}
          icon={Building2}
          tone="accent"
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Page" : "Page"}
          value={`${pagination.page}/${pagination.total_pages}`}
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Affichees" : "Showing"}
          value={companies.length}
          loading={isLoading}
        />
      </div>

      <Toolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={
          t("lang") === "fr" ? "Rechercher une entreprise..." : "Search companies..."
        }
        actions={
          <Button
            variant="outline"
            size="md"
            onClick={() => fetchCompanies()}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {t("lang") === "fr" ? "Actualiser" : "Refresh"}
          </Button>
        }
      />

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

      <DataCard padded={false}>
        <DataTable
          columns={columns}
          rows={filtered}
          loading={isLoading}
          onRowClick={(row) => navigate(`/companies/companyDetails/${row.id}`)}
          empty={
            <EmptyState
              icon={Building2}
              title={t("lang") === "fr" ? "Aucune entreprise" : "No companies"}
              description={
                t("lang") === "fr"
                  ? "Commencez par ajouter votre premiere entreprise partenaire."
                  : "Get started by adding your first partner company."
              }
              action={
                <Button variant="accent" onClick={() => navigate("/companies/create")}>
                  <Plus size={15} />
                  {t("lang") === "fr" ? "Nouvelle entreprise" : "New company"}
                </Button>
              }
            />
          }
        />

        {pagination.total_pages > 1 && (
          <div className="border-t border-[var(--border)] px-5 py-3 flex items-center justify-between">
            <div className="text-[13px] text-[var(--text-3)]">
              {companies.length} / {pagination.total_items}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                {t("lang") === "fr" ? "Precedent" : "Previous"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.total_pages}
                onClick={() => handlePageChange(pagination.page + 1)}
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
