import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Building2, Calendar, Edit2, Trash2, Users,
  ExternalLink, Star, MapPin, FileText, Plus,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, Button, StatusPill, EmptyState,
} from "@/Components/primitives";
import {
  getContactById, getMembershipsForContact, getInitials, avatarGradient,
} from "@/lib/fixtures/contacts";
import {
  getRoleLabel, getCompanyTypeLabel,
} from "@/lib/fixtures/companyTypes";

function MembershipCard({ membership, isFr }) {
  const c = membership.company;
  if (!c) return null;

  return (
    <Link
      to={`/companies/companyDetails/${c.id}`}
      className="block bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--border-2)] hover:shadow-[var(--shadow-lift)] transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <Building2 size={18} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="text-[15px] font-semibold text-[var(--text)] truncate">
                {c.name}
              </div>
              {membership.is_primary && (
                <StatusPill tone="warning" label={isFr ? "Primaire" : "Primary"} size="sm" dot={false} />
              )}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-medium mt-0.5">
              {getCompanyTypeLabel(c.type, isFr)}
            </div>
          </div>
        </div>
        <ExternalLink size={14} className="text-[var(--text-4)] flex-shrink-0 mt-1" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-pill)] text-[11px] font-medium"
          style={{
            background: "var(--accent-bg)",
            color: "var(--accent)",
          }}
        >
          {getRoleLabel(membership.profile_role, isFr)}
        </span>
        {membership.start_date && (
          <span className="text-[11px] text-[var(--text-3)] inline-flex items-center gap-1">
            <Calendar size={11} aria-hidden="true" />
            {isFr ? "Depuis " : "Since "}
            {new Date(membership.start_date).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {c.address && (
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-3)] mt-2">
          <MapPin size={11} aria-hidden="true" />
          <span>{c.address}</span>
        </div>
      )}
    </Link>
  );
}

export default function ContactDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const contact = getContactById(id);
  const memberships = contact ? getMembershipsForContact(id) : [];

  if (!contact) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/contacts")}
            aria-label={isFr ? "Retour" : "Back"}
          >
            <ArrowLeft size={16} />
          </Button>
        </div>
        <EmptyState
          icon={Users}
          title={isFr ? "Contact introuvable" : "Contact not found"}
          action={
            <Button variant="outline" onClick={() => navigate("/contacts")}>
              <ArrowLeft size={15} />
              {isFr ? "Retour aux contacts" : "Back to contacts"}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/contacts")}
          aria-label={isFr ? "Retour" : "Back"}
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(`/contacts/${id}/edit`)}
        >
          <Edit2 size={14} aria-hidden="true" />
          {isFr ? "Modifier" : "Edit"}
        </Button>
        <Button
          variant="outline"
          size="md"
          className="!text-[var(--danger)] hover:!bg-[var(--danger-bg)]"
        >
          <Trash2 size={14} aria-hidden="true" />
          {isFr ? "Supprimer" : "Delete"}
        </Button>
      </div>

      {/* Hero card — LinkedIn-style profile */}
      <DataCard padded>
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-bold text-[28px] md:text-[32px] flex-shrink-0"
            style={{ background: avatarGradient(contact.full_name) }}
            aria-hidden="true"
          >
            {getInitials(contact.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[26px] font-bold text-[var(--text)] tracking-tight">
                {contact.full_name}
              </h1>
              {contact.linked_user_id && (
                <StatusPill tone="success" label={isFr ? "Compte actif" : "Active user"} size="sm" />
              )}
            </div>
            <div className="text-[14px] text-[var(--text-3)] mt-1">
              {memberships.length > 0
                ? `${getRoleLabel(memberships.find((m) => m.is_primary)?.profile_role || memberships[0].profile_role, isFr)}`
                : isFr ? "Aucun role attribue" : "No role assigned"}
              {memberships.length > 1 && (
                <span className="text-[var(--text-4)]">
                  {" · "}
                  {memberships.length - 1} {isFr ? "autres roles" : "other roles"}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[13px] text-[var(--text-2)]">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors"
                >
                  <Mail size={13} aria-hidden="true" />
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors"
                >
                  <Phone size={13} aria-hidden="true" />
                  {contact.phone}
                </a>
              )}
              <div className="flex items-center gap-1.5 text-[var(--text-3)]">
                <Calendar size={13} aria-hidden="true" />
                {isFr ? "Ajoute le " : "Added "}
                {new Date(contact.created_at).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {contact.notes && (
              <div className="mt-4 p-3 rounded-[var(--radius)] bg-[var(--surface-2)] text-[13px] text-[var(--text-2)] border-l-2 border-[var(--accent)]">
                <div className="flex items-start gap-2">
                  <FileText size={13} className="mt-0.5 text-[var(--text-3)] flex-shrink-0" aria-hidden="true" />
                  <div>{contact.notes}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DataCard>

      {/* Memberships / Experience */}
      <DataCard
        title={isFr ? "Experience professionnelle" : "Professional experience"}
        description={
          memberships.length === 0
            ? isFr ? "Aucune entreprise liee" : "No companies linked"
            : `${memberships.length} ${memberships.length > 1 ? (isFr ? "roles" : "roles") : (isFr ? "role" : "role")}`
        }
        icon={Building2}
        action={
          <Button size="sm" variant="outline" onClick={() => navigate(`/contacts/${id}/edit`)}>
            <Plus size={13} aria-hidden="true" />
            {isFr ? "Ajouter" : "Add"}
          </Button>
        }
      >
        {memberships.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={isFr ? "Pas encore d'entreprise" : "No company yet"}
            description={
              isFr
                ? "Liez ce contact a une ou plusieurs entreprises avec leur role."
                : "Link this contact to one or more companies with their role."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {memberships.map((m) => (
              <MembershipCard key={m.id} membership={m} isFr={isFr} />
            ))}
          </div>
        )}
      </DataCard>
    </div>
  );
}
