import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, RefreshCw, Users, ArrowRight } from "lucide-react";
import getUsers from "@/Services/UsersService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, DataTable, StatusPill, EmptyState,
  Toolbar, Button,
} from "@/Components/primitives";

const ROLE_TONE = { ADMIN: "danger", USER: "accent", CLIENT: "neutral" };

export default function UsersPageList() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setIsRefreshing(true);
    try {
      const response = await getUsers();
      setUsers(response || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return users;
    const q = searchTerm.toLowerCase();
    return users.filter((u) =>
      [u.username, u.email, u.role].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [users, searchTerm]);

  const columns = [
    {
      key: "user",
      header: t("lang") === "fr" ? "Utilisateur" : "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] font-semibold text-[13px] flex-shrink-0">
            {row.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-[var(--text)] truncate">{row.username}</div>
            <div className="text-[12px] text-[var(--text-3)] truncate">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: t("lang") === "fr" ? "Role" : "Role",
      render: (row) => <StatusPill tone={ROLE_TONE[row.role] || "neutral"} label={row.role} dot={false} />,
    },
    {
      key: "company",
      header: t("nav.clients"),
      render: (row) => row.company?.name || "—",
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
            navigate(`/users/${row.id}`);
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
        title={t("nav.users")}
        subtitle={
          t("lang") === "fr" ? "Gerez les utilisateurs et permissions" : "Manage users and permissions"
        }
        icon={Users}
        actions={
          <Button variant="accent" size="md" onClick={() => navigate("/users/create")}>
            <UserPlus size={15} />
            {t("lang") === "fr" ? "Ajouter" : "Add user"}
          </Button>
        }
      />

      <Toolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={
          t("lang") === "fr" ? "Rechercher un utilisateur..." : "Search users..."
        }
        actions={
          <Button variant="outline" size="md" onClick={fetchUsers} disabled={isRefreshing}>
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {t("lang") === "fr" ? "Actualiser" : "Refresh"}
          </Button>
        }
      />

      <DataCard padded={false}>
        <DataTable
          columns={columns}
          rows={filtered}
          loading={loading}
          onRowClick={(row) => navigate(`/users/${row.id}`)}
          empty={
            <EmptyState
              icon={Users}
              title={t("lang") === "fr" ? "Aucun utilisateur" : "No users"}
              action={
                <Button variant="accent" onClick={() => navigate("/users/create")}>
                  <UserPlus size={15} />
                  {t("lang") === "fr" ? "Ajouter un utilisateur" : "Add user"}
                </Button>
              }
            />
          }
        />
      </DataCard>
    </div>
  );
}
