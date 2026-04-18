import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Users, User, Mail, Phone, FileText, Building2, Plus,
  Trash2, Star,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, FormField, Input, Textarea, Select, Button,
} from "@/Components/primitives";
import {
  getContactById, getMembershipsForContact, MOCK_COMPANIES,
} from "@/lib/fixtures/contacts";
import { PROFILE_ROLES, getRoleLabel, getCompanyTypeLabel } from "@/lib/fixtures/companyTypes";

/**
 * ContactFormPage — handles both create (no id) and edit (with id).
 * In the prototype it doesn't persist anything; shows a toast on save.
 */
export default function ContactFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const isEdit = Boolean(id);
  const existingContact = isEdit ? getContactById(id) : null;
  const existingMemberships = isEdit ? getMembershipsForContact(id) : [];

  const [form, setForm] = useState(() => ({
    full_name: existingContact?.full_name || "",
    email: existingContact?.email || "",
    phone: existingContact?.phone || "",
    notes: existingContact?.notes || "",
  }));

  const [memberships, setMemberships] = useState(() =>
    existingMemberships.map((m) => ({
      tempId: m.id,
      company_id: m.company_id,
      profile_role: m.profile_role,
      is_primary: m.is_primary || false,
    }))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (f) => (e) =>
    setForm((prev) => ({ ...prev, [f]: typeof e === "string" ? e : e.target.value }));

  const addMembership = () => {
    setMemberships((prev) => [
      ...prev,
      { tempId: `new-${Date.now()}`, company_id: "", profile_role: "", is_primary: prev.length === 0 },
    ]);
  };

  const updateMembership = (i, field, value) => {
    setMemberships((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      // Only one primary at a time
      if (field === "is_primary" && value) {
        next.forEach((m, idx) => {
          if (idx !== i) m.is_primary = false;
        });
      }
      return next;
    });
  };

  const removeMembership = (i) => {
    setMemberships((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast.error(isFr ? "Le nom est requis" : "Name is required");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        isEdit
          ? isFr ? "Contact mis a jour" : "Contact updated"
          : isFr ? "Contact cree" : "Contact created"
      );
      navigate(isEdit ? `/contacts/${id}` : "/contacts");
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => navigate(isEdit ? `/contacts/${id}` : "/contacts")}
          aria-label={isFr ? "Retour" : "Back"}
        >
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={
            isEdit
              ? (existingContact?.full_name || (isFr ? "Modifier le contact" : "Edit contact"))
              : (isFr ? "Nouveau contact" : "New contact")
          }
          subtitle={
            isEdit
              ? (isFr ? "Modifier les infos et les liens" : "Edit info and links")
              : (isFr ? "Ajouter une personne a votre base de contacts" : "Add a person to your contact database")
          }
          icon={isEdit ? User : Users}
        />
      </div>

      <DataCard title={isFr ? "Informations" : "Basic info"}>
        <div className="space-y-4">
          <FormField label={isFr ? "Nom complet" : "Full name"} htmlFor="full_name" required>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
              <Input
                id="full_name"
                value={form.full_name}
                onChange={update("full_name")}
                placeholder="Jane Doe"
                required
                className="pl-9 w-full"
              />
            </div>
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email" htmlFor="email">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="jane@agence.dz"
                  className="pl-9 w-full"
                />
              </div>
            </FormField>
            <FormField label={isFr ? "Telephone" : "Phone"} htmlFor="phone">
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+213 555 00 00 00"
                  className="pl-9 w-full"
                />
              </div>
            </FormField>
          </div>
          <FormField
            label={isFr ? "Notes" : "Notes"}
            htmlFor="notes"
            hint={isFr ? "Optionnel · context interne" : "Optional · internal context"}
          >
            <Textarea
              id="notes"
              value={form.notes}
              onChange={update("notes")}
              rows={3}
              placeholder={
                isFr
                  ? "Ex: Specialiste packaging, disponible le mercredi..."
                  : "e.g., Packaging specialist, available Wednesdays..."
              }
            />
          </FormField>
        </div>
      </DataCard>

      <DataCard
        title={isFr ? "Liens aux entreprises" : "Company memberships"}
        description={
          isFr
            ? "Une personne peut appartenir a plusieurs entreprises avec des roles differents"
            : "A person can belong to multiple companies with different roles"
        }
        icon={Building2}
        action={
          <Button size="sm" variant="outline" type="button" onClick={addMembership}>
            <Plus size={13} />
            {isFr ? "Ajouter" : "Add"}
          </Button>
        }
      >
        {memberships.length === 0 ? (
          <div className="text-center py-6 text-[13px] text-[var(--text-3)]">
            {isFr
              ? "Aucun lien. Ce contact peut exister sans entreprise."
              : "No links yet. This contact can exist without any company."}
          </div>
        ) : (
          <div className="space-y-3">
            {memberships.map((m, i) => {
              const company = MOCK_COMPANIES.find((c) => c.id === m.company_id);
              return (
                <div
                  key={m.tempId}
                  className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-2)] border border-[var(--border)]"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold">
                      {isFr ? "Lien" : "Link"} {i + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateMembership(i, "is_primary", !m.is_primary)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-[var(--radius-pill)] text-[10px] font-semibold transition-colors ${
                          m.is_primary
                            ? "bg-[var(--warning-bg)] text-[var(--warning)]"
                            : "bg-[var(--surface)] text-[var(--text-3)] hover:text-[var(--text)]"
                        }`}
                      >
                        <Star size={10} fill={m.is_primary ? "currentColor" : "none"} aria-hidden="true" />
                        {isFr ? "Primaire" : "Primary"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMembership(i)}
                        className="h-7 w-7 rounded-[var(--radius)] inline-flex items-center justify-center text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
                        aria-label={isFr ? "Supprimer ce lien" : "Remove link"}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField label={isFr ? "Entreprise" : "Company"}>
                      <Select
                        value={m.company_id}
                        onChange={(e) => updateMembership(i, "company_id", e.target.value)}
                      >
                        <option value="">
                          {isFr ? "Selectionner..." : "Select..."}
                        </option>
                        {MOCK_COMPANIES.filter((c) => !c.isDuplicateOf).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} · {getCompanyTypeLabel(c.type, isFr)}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField label={isFr ? "Role / Profil" : "Role / Profile"}>
                      <Select
                        value={m.profile_role}
                        onChange={(e) => updateMembership(i, "profile_role", e.target.value)}
                      >
                        <option value="">
                          {isFr ? "Selectionner..." : "Select..."}
                        </option>
                        {PROFILE_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {isFr ? r.labelFr : r.labelEn}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  </div>

                  {company && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-3)]">
                      {company.address && (
                        <span>
                          📍 {company.address}
                        </span>
                      )}
                      {m.profile_role && (
                        <span className="ml-3">
                          {isFr ? "Apercu : " : "Preview: "}
                          <span className="font-semibold text-[var(--text-2)]">
                            {getRoleLabel(m.profile_role, isFr)} @ {company.name}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DataCard>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => navigate(isEdit ? `/contacts/${id}` : "/contacts")}
        >
          {isFr ? "Annuler" : "Cancel"}
        </Button>
        <Button variant="accent" type="submit" loading={isSubmitting}>
          {isEdit
            ? isFr ? "Enregistrer" : "Save changes"
            : isFr ? "Creer le contact" : "Create contact"}
        </Button>
      </div>
    </form>
  );
}
