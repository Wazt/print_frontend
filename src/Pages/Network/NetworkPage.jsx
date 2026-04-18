import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Network, Building2, Users, Mail, Phone, Star, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, EmptyState, StatCard, FilterChip, Button,
} from "@/Components/primitives";
import {
  MOCK_COMPANIES, MOCK_CONTACTS, MOCK_MEMBERSHIPS,
  getInitials, avatarGradient, getContactById, getCompanyById,
} from "@/lib/fixtures/contacts";
import {
  PROFILE_ROLES, getRoleLabel, getCompanyTypeLabel,
} from "@/lib/fixtures/companyTypes";

function PersonChip({ contact, membership, isFr, allMemberships, onClick }) {
  const otherCompanies = allMemberships.filter(
    (m) => m.contact_id === contact.id && m.company_id !== membership.company_id
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-3 hover:border-[var(--border-2)] hover:shadow-[var(--shadow-card)] transition-all focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[12px] flex-shrink-0"
          style={{ background: avatarGradient(contact.full_name) }}
          aria-hidden="true"
        >
          {getInitials(contact.full_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="text-[13px] font-semibold text-[var(--text)] truncate">
              {contact.full_name}
            </div>
            {membership.is_primary && (
              <Star
                size={10}
                className="text-[var(--warning)] flex-shrink-0"
                fill="currentColor"
                aria-label={isFr ? "Primaire" : "Primary"}
              />
            )}
            {otherCompanies.length > 0 && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] text-[var(--accent)] font-medium flex-shrink-0"
                title={
                  otherCompanies
                    .map((m) => getCompanyById(m.company_id)?.name)
                    .filter(Boolean)
                    .join(", ")
                }
              >
                <ArrowUpRight size={9} aria-hidden="true" />
                +{otherCompanies.length}
              </span>
            )}
          </div>
          <div className="text-[11px] text-[var(--text-3)] mt-0.5 truncate">
            {getRoleLabel(membership.profile_role, isFr)}
          </div>
          {contact.phone && (
            <div className="text-[10px] text-[var(--text-4)] mt-1 font-mono truncate">
              {contact.phone}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function NetworkPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [selectedRole, setSelectedRole] = useState("INFOGRAPHE");

  // Count contacts per role
  const roleCounts = useMemo(() => {
    const counts = {};
    MOCK_MEMBERSHIPS.forEach((m) => {
      counts[m.profile_role] = (counts[m.profile_role] || 0) + 1;
    });
    return counts;
  }, []);

  // Group memberships for the selected role by company
  const grouped = useMemo(() => {
    const filtered = MOCK_MEMBERSHIPS.filter((m) => m.profile_role === selectedRole);
    const byCompany = {};
    filtered.forEach((m) => {
      if (!byCompany[m.company_id]) byCompany[m.company_id] = [];
      byCompany[m.company_id].push(m);
    });
    return Object.entries(byCompany)
      .map(([companyId, memberships]) => ({
        company: getCompanyById(companyId),
        memberships,
      }))
      .filter((g) => g.company)
      .sort((a, b) => b.memberships.length - a.memberships.length);
  }, [selectedRole]);

  const totalForRole = roleCounts[selectedRole] || 0;

  // Top-level KPI counts
  const stats = useMemo(() => {
    const totalContacts = MOCK_CONTACTS.length;
    const totalInfographes =
      (roleCounts.INFOGRAPHE || 0) + (roleCounts.FREELANCE_INFOGRAPHE || 0);
    const totalImprimerie = MOCK_COMPANIES.filter((c) => c.type === "IMPRIMERIE").length;
    const totalAgences = MOCK_COMPANIES.filter(
      (c) => c.type === "AGENCE_COMMUNICATION"
    ).length;
    return { totalContacts, totalInfographes, totalImprimerie, totalAgences };
  }, [roleCounts]);

  // Popular roles for quick chips (top 6)
  const topRoles = PROFILE_ROLES.filter((r) => (roleCounts[r.value] || 0) > 0)
    .sort((a, b) => (roleCounts[b.value] || 0) - (roleCounts[a.value] || 0))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isFr ? "Reseau" : "Network"}
        subtitle={
          isFr
            ? "Vue admin · trouvez des talents et partenaires dans tout le reseau"
            : "Admin view · find talent and partners across the whole network"
        }
        icon={Network}
        actions={
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--danger-bg)] text-[var(--danger)] text-[11px] font-semibold"
          >
            ADMIN ONLY
          </span>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={isFr ? "Contacts totaux" : "Total contacts"}
          value={stats.totalContacts}
          icon={Users}
          tone="accent"
        />
        <StatCard
          label={isFr ? "Infographes" : "Designers"}
          value={stats.totalInfographes}
          hint={isFr ? "Salaries + freelance" : "Employees + freelance"}
          icon={Users}
          tone="success"
        />
        <StatCard
          label={isFr ? "Imprimeries" : "Print shops"}
          value={stats.totalImprimerie}
          hint={isFr ? "Partenaires livraison" : "Delivery partners"}
          icon={Building2}
          tone="warning"
        />
        <StatCard
          label={isFr ? "Agences" : "Agencies"}
          value={stats.totalAgences}
          icon={Building2}
          tone="default"
        />
      </div>

      {/* Role filter chips */}
      <DataCard
        title={isFr ? "Filtrer par role" : "Filter by role"}
        description={
          isFr
            ? "Cliquez un role pour voir les personnes correspondantes dans toutes les entreprises"
            : "Click a role to see matching people across all companies"
        }
      >
        <div className="flex flex-wrap gap-2">
          {topRoles.map((r) => (
            <FilterChip
              key={r.value}
              active={selectedRole === r.value}
              onClick={() => setSelectedRole(r.value)}
              count={roleCounts[r.value]}
            >
              {isFr ? r.labelFr : r.labelEn}
            </FilterChip>
          ))}
        </div>
      </DataCard>

      {/* Groups by company */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-semibold text-[var(--text)] tracking-tight">
            {getRoleLabel(selectedRole, isFr)}
          </h2>
          <span className="text-[13px] text-[var(--text-3)] tabular-nums">
            · {totalForRole} {totalForRole > 1 ? (isFr ? "personnes" : "people") : (isFr ? "personne" : "person")}
          </span>
        </div>

        {grouped.length === 0 ? (
          <DataCard padded={false}>
            <EmptyState
              icon={Users}
              title={isFr ? "Aucun resultat" : "No results"}
              description={
                isFr
                  ? "Pas encore de contact pour ce role."
                  : "No contact for this role yet."
              }
            />
          </DataCard>
        ) : (
          grouped.map(({ company, memberships }) => (
            <DataCard
              key={company.id}
              title={company.name}
              description={`${getCompanyTypeLabel(company.type, isFr)} · ${memberships.length} ${memberships.length > 1 ? (isFr ? "personnes" : "people") : (isFr ? "personne" : "person")}`}
              icon={Building2}
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/companies/companyDetails/${company.id}`)}
                >
                  {isFr ? "Voir" : "View"}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Button>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {memberships.map((m) => {
                  const contact = getContactById(m.contact_id);
                  if (!contact) return null;
                  return (
                    <PersonChip
                      key={m.id}
                      contact={contact}
                      membership={m}
                      isFr={isFr}
                      allMemberships={MOCK_MEMBERSHIPS}
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    />
                  );
                })}
              </div>
            </DataCard>
          ))
        )}
      </div>
    </div>
  );
}
