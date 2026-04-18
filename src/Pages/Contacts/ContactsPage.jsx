import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Building2, Mail, Phone, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, EmptyState, Toolbar, FilterChip, Button, Select,
} from "@/Components/primitives";
import {
  listAllContacts, getInitials, avatarGradient,
} from "@/lib/fixtures/contacts";
import {
  COMPANY_TYPES, PROFILE_ROLES, getRoleLabel, getCompanyTypeLabel,
} from "@/lib/fixtures/companyTypes";

function ContactCard({ contact, onClick, isFr }) {
  const primaryMembership = contact.memberships.find((m) => m.is_primary) || contact.memberships[0];
  const primaryRole = primaryMembership?.profile_role;
  const count = contact.memberships.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 hover:border-[var(--border-2)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px transition-all focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
      aria-label={`${contact.full_name} · ${primaryRole ? getRoleLabel(primaryRole, isFr) : ""}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-[15px] flex-shrink-0"
          style={{ background: avatarGradient(contact.full_name) }}
          aria-hidden="true"
        >
          {getInitials(contact.full_name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-[var(--text)] truncate">
            {contact.full_name}
          </div>
          <div className="text-[12px] text-[var(--text-3)] truncate mt-0.5">
            {primaryRole ? getRoleLabel(primaryRole, isFr) : (isFr ? "Aucun role" : "No role")}
            {contact.memberships.some((m) => m.is_primary) && (
              <>
                {" · "}
                <Star size={10} className="inline text-[var(--warning)]" aria-hidden="true" />
                {" "}
                {isFr ? "Primaire" : "Primary"}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border)] space-y-2">
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-3)]">
          <Building2 size={11} aria-hidden="true" />
          <span className="truncate">
            {count === 0
              ? isFr ? "Aucune entreprise" : "No company"
              : `${count} ${count > 1 ? (isFr ? "entreprises" : "companies") : (isFr ? "entreprise" : "company")}`}
          </span>
        </div>
        <div className="space-y-0.5">
          {contact.memberships.slice(0, 3).map((m) => (
            <div key={m.id} className="flex items-center gap-1.5 text-[11px]">
              <span className="w-1 h-1 rounded-full bg-[var(--text-4)] flex-shrink-0" aria-hidden="true" />
              <span className="text-[var(--text-2)] truncate">
                {m.company?.name}
              </span>
            </div>
          ))}
          {count > 3 && (
            <div className="text-[11px] text-[var(--text-4)] pl-2.5">
              + {count - 3} {isFr ? "autres" : "more"}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1">
        {contact.email && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-3)]">
            <Mail size={11} aria-hidden="true" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-3)]">
            <Phone size={11} aria-hidden="true" />
            <span>{contact.phone}</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default function ContactsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [companyType, setCompanyType] = useState("all");

  const contacts = useMemo(
    () => listAllContacts({ search, role, companyType }),
    [search, role, companyType]
  );

  const stats = useMemo(() => {
    const total = contacts.length;
    const multiCompany = contacts.filter((c) => c.memberships.length > 1).length;
    const freelance = contacts.filter((c) =>
      c.memberships.some((m) => m.company?.type === "FREELANCE")
    ).length;
    return { total, multiCompany, freelance };
  }, [contacts]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isFr ? "Contacts" : "Contacts"}
        subtitle={
          isFr
            ? `${stats.total} personnes · ${stats.multiCompany} multi-entreprises · ${stats.freelance} freelance`
            : `${stats.total} people · ${stats.multiCompany} multi-company · ${stats.freelance} freelance`
        }
        icon={Users}
        actions={
          <Button variant="accent" size="md" onClick={() => navigate("/contacts/new")}>
            <Plus size={15} aria-hidden="true" />
            {isFr ? "Nouveau contact" : "New contact"}
          </Button>
        }
      />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={isFr ? "Rechercher un contact..." : "Search contacts..."}
        filters={
          <>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="min-w-[160px]"
              aria-label={isFr ? "Role" : "Role"}
            >
              <option value="all">{isFr ? "Tous les roles" : "All roles"}</option>
              {PROFILE_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {isFr ? r.labelFr : r.labelEn}
                </option>
              ))}
            </Select>
            <Select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="min-w-[180px]"
              aria-label={isFr ? "Type d'entreprise" : "Company type"}
            >
              <option value="all">{isFr ? "Tous types" : "All types"}</option>
              {COMPANY_TYPES.map((c) => (
                <option key={c.value} value={c.value}>
                  {isFr ? c.labelFr : c.labelEn}
                </option>
              ))}
            </Select>
          </>
        }
      />

      {/* Quick filter chips for top roles */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: isFr ? "Tous" : "All" },
          { value: "INFOGRAPHE", label: isFr ? "Infographes" : "Designers" },
          { value: "GERANT", label: isFr ? "Gerants" : "Managers" },
          { value: "COMMERCIAL", label: isFr ? "Commerciaux" : "Sales" },
          { value: "FREELANCE_INFOGRAPHE", label: isFr ? "Freelance infographes" : "Freelance designers" },
        ].map((chip) => (
          <FilterChip
            key={chip.value}
            active={role === chip.value}
            onClick={() => setRole(chip.value)}
          >
            {chip.label}
          </FilterChip>
        ))}
      </div>

      {contacts.length === 0 ? (
        <DataCard padded={false}>
          <EmptyState
            icon={Users}
            title={isFr ? "Aucun contact trouve" : "No contacts found"}
            description={
              isFr
                ? "Essayez d'ajuster vos filtres ou creez un nouveau contact."
                : "Try adjusting your filters or create a new contact."
            }
            action={
              <Button variant="accent" onClick={() => navigate("/contacts/new")}>
                <Plus size={15} aria-hidden="true" />
                {isFr ? "Nouveau contact" : "New contact"}
              </Button>
            }
          />
        </DataCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <ContactCard
              key={c.id}
              contact={c}
              isFr={isFr}
              onClick={() => navigate(`/contacts/${c.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
