import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, Building2, ArrowRight, Merge, XCircle, CheckCircle2, User,
  MapPin, Mail,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, EmptyState, StatCard, Button, StatusPill,
} from "@/Components/primitives";
import {
  MOCK_DUPLICATE_ALERTS, getCompanyById, getMembershipsForCompany,
} from "@/lib/fixtures/contacts";
import { getCompanyTypeLabel } from "@/lib/fixtures/companyTypes";

function CompanyComparison({ company, label, isFr, selected, onSelect }) {
  const memberships = getMembershipsForCompany(company.id);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left w-full rounded-[var(--radius-lg)] border-2 p-4 transition-all focus-visible:outline-none ${
        selected
          ? "border-[var(--accent)] bg-[var(--accent-bg)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-2)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-3)]">
          {label}
        </div>
        {selected && (
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)]">
            <CheckCircle2 size={12} aria-hidden="true" />
            {isFr ? "Gagnant" : "Keep"}
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-[var(--text-2)]" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-[var(--text)] truncate">
            {company.name}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] mt-0.5">
            {getCompanyTypeLabel(company.type, isFr)}
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-[12px] text-[var(--text-2)]">
        {company.email && (
          <div className="flex items-center gap-1.5">
            <Mail size={11} className="text-[var(--text-3)]" aria-hidden="true" />
            <span className="truncate">{company.email}</span>
          </div>
        )}
        {company.address && (
          <div className="flex items-center gap-1.5">
            <MapPin size={11} className="text-[var(--text-3)]" aria-hidden="true" />
            <span className="truncate">{company.address}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 pt-1 text-[var(--text-3)]">
          <User size={11} aria-hidden="true" />
          {memberships.length} {memberships.length > 1 ? (isFr ? "contacts lies" : "linked contacts") : (isFr ? "contact lie" : "linked contact")}
        </div>
      </div>
    </button>
  );
}

export default function DuplicateAlertsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [alerts, setAlerts] = useState(MOCK_DUPLICATE_ALERTS);
  const [expanded, setExpanded] = useState(alerts[0]?.id);
  const [winners, setWinners] = useState({});

  const unresolved = alerts.filter((a) => !a.resolved);

  const handleMerge = (alert) => {
    const winnerId = winners[alert.id];
    if (!winnerId) {
      toast.error(
        isFr ? "Choisissez l'entreprise gagnante" : "Choose the winning company"
      );
      return;
    }
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id ? { ...a, resolved: true, resolved_action: "merged" } : a
      )
    );
    toast.success(isFr ? "Fusion effectuee" : "Companies merged");
  };

  const handleKeepBoth = (alert) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id ? { ...a, resolved: true, resolved_action: "kept_both" } : a
      )
    );
    toast.success(isFr ? "Les deux entreprises sont conservees" : "Both companies kept");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isFr ? "Alertes de doublons" : "Duplicate alerts"}
        subtitle={
          isFr
            ? "Examinez les entreprises potentiellement en doublon creees lors d'inscriptions"
            : "Review potentially duplicate companies created during signup"
        }
        icon={AlertTriangle}
        actions={
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--danger-bg)] text-[var(--danger)] text-[11px] font-semibold"
          >
            ADMIN ONLY
          </span>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label={isFr ? "En attente" : "Unresolved"}
          value={unresolved.length}
          hint={isFr ? "A traiter" : "Needs review"}
          icon={AlertTriangle}
          tone={unresolved.length > 0 ? "warning" : "success"}
        />
        <StatCard
          label={isFr ? "Fusions" : "Merged"}
          value={alerts.filter((a) => a.resolved_action === "merged").length}
          hint={isFr ? "Cette semaine" : "This week"}
          icon={Merge}
          tone="accent"
        />
        <StatCard
          label={isFr ? "Conservees" : "Kept both"}
          value={alerts.filter((a) => a.resolved_action === "kept_both").length}
          icon={CheckCircle2}
          tone="default"
        />
        <StatCard
          label={isFr ? "Total" : "Total alerts"}
          value={alerts.length}
          icon={AlertTriangle}
          tone="default"
        />
      </div>

      {unresolved.length === 0 ? (
        <DataCard padded={false}>
          <EmptyState
            icon={CheckCircle2}
            title={isFr ? "Aucune alerte en attente" : "No pending alerts"}
            description={
              isFr
                ? "Tout est a jour. Les nouvelles alertes apparaissent ici quand un client s'inscrit avec un nom d'entreprise potentiellement deja present."
                : "All clear. New alerts appear here whenever a signup uses a company name that may already exist."
            }
          />
        </DataCard>
      ) : (
        <div className="space-y-4">
          {unresolved.map((alert) => {
            const existing = getCompanyById(alert.existing_company_id);
            const newCo = getCompanyById(alert.new_company_id);
            const isOpen = expanded === alert.id;
            const winnerId = winners[alert.id];

            if (!existing || !newCo) return null;

            return (
              <DataCard
                key={alert.id}
                title={
                  isFr
                    ? `Doublon potentiel : "${existing.name}"`
                    : `Potential duplicate: "${existing.name}"`
                }
                description={
                  <div className="flex items-center gap-2 flex-wrap text-[12px]">
                    <StatusPill tone="warning" label={isFr ? "En attente" : "Pending"} size="sm" />
                    <span>
                      {isFr ? "Cree par " : "Created by "}
                      <span className="font-semibold text-[var(--text-2)]">
                        {alert.created_by_email}
                      </span>
                    </span>
                    <span>
                      · {new Date(alert.created_at).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                }
                icon={AlertTriangle}
                action={
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpanded(isOpen ? null : alert.id)}
                  >
                    {isOpen ? (isFr ? "Reduire" : "Collapse") : (isFr ? "Examiner" : "Review")}
                    <ArrowRight size={13} aria-hidden="true" />
                  </Button>
                }
              >
                {isOpen && (
                  <div className="space-y-4">
                    <div className="text-[13px] text-[var(--text-2)]">
                      {isFr
                        ? "Comparez les deux fiches. Choisissez l'entreprise gagnante, puis fusionnez (les contacts sont migres vers la gagnante) ou conservez les deux."
                        : "Compare the two records. Pick the winning company, then merge (contacts migrate to winner) or keep both separate."}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CompanyComparison
                        company={existing}
                        label={isFr ? "Existante" : "Existing"}
                        isFr={isFr}
                        selected={winnerId === existing.id}
                        onSelect={() =>
                          setWinners((p) => ({ ...p, [alert.id]: existing.id }))
                        }
                      />
                      <CompanyComparison
                        company={newCo}
                        label={isFr ? "Nouvelle (inscription)" : "New (from signup)"}
                        isFr={isFr}
                        selected={winnerId === newCo.id}
                        onSelect={() =>
                          setWinners((p) => ({ ...p, [alert.id]: newCo.id }))
                        }
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => handleKeepBoth(alert)}
                      >
                        <XCircle size={14} aria-hidden="true" />
                        {isFr ? "Conserver les deux" : "Keep both"}
                      </Button>
                      <Button
                        variant="accent"
                        size="md"
                        onClick={() => handleMerge(alert)}
                        disabled={!winnerId}
                      >
                        <Merge size={14} aria-hidden="true" />
                        {isFr
                          ? winnerId ? "Fusionner vers la selection" : "Selectionnez un gagnant"
                          : winnerId ? "Merge into selected" : "Select a winner"}
                      </Button>
                    </div>
                  </div>
                )}
              </DataCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
