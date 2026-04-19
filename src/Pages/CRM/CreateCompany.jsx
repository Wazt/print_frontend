import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import { createCompany } from "@/Services/CompanyService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, DataCard, FormField, Input, Textarea, Select, Button } from "@/Components/primitives";
import { COMPANY_TYPES } from "@/lib/fixtures/companyTypes";

export default function CreateCompany() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", type: "", email: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = t("lang") === "fr" ? "Nom requis" : "Name required";
    if (!formData.type) e.type = t("lang") === "fr" ? "Type requis" : "Type required";
    if (!formData.email.trim()) e.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email invalide";
    if (!formData.phone.trim()) e.phone = t("lang") === "fr" ? "Telephone requis" : "Phone required";
    if (!formData.address.trim()) e.address = t("lang") === "fr" ? "Adresse requise" : "Address required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await createCompany(formData);
      toast.success(t("lang") === "fr" ? "Entreprise creee !" : "Company created!");
      navigate("/companies");
    } catch {
      toast.error(t("lang") === "fr" ? "Echec de la creation" : "Failed to create company");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label={t("lang") === "fr" ? "Retour" : "Back"}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={t("lang") === "fr" ? "Nouvelle entreprise" : "New company"}
          subtitle={t("lang") === "fr" ? "Ajoutez une entreprise partenaire" : "Add a partner company"}
          icon={Building2}
        />
      </div>

      <DataCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label={t("lang") === "fr" ? "Nom de l'entreprise" : "Company name"}
              htmlFor="name"
              error={errors.name}
              required
            >
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("lang") === "fr" ? "Ex: Lab Perfect" : "Ex: Lab Perfect"}
              />
            </FormField>
            <FormField
              label={t("lang") === "fr" ? "Type d'entreprise" : "Company type"}
              htmlFor="type"
              error={errors.type}
              required
            >
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">
                  {t("lang") === "fr" ? "Selectionnez..." : "Select..."}
                </option>
                {COMPANY_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {t("lang") === "fr" ? ct.labelFr : ct.labelEn}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Email" htmlFor="email" error={errors.email} required>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
            </FormField>
            <FormField
              label={t("lang") === "fr" ? "Telephone" : "Phone"}
              htmlFor="phone"
              error={errors.phone}
              required
            >
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+213 555 00 00 00"
              />
            </FormField>
          </div>

          <FormField
            label={t("lang") === "fr" ? "Adresse" : "Address"}
            htmlFor="address"
            error={errors.address}
            required
          >
            <Textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder={t("lang") === "fr" ? "Adresse complete" : "Full business address"}
            />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              {t("common.cancel")}
            </Button>
            <Button variant="accent" type="submit" loading={isSubmitting}>
              {t("lang") === "fr" ? "Creer l'entreprise" : "Create company"}
            </Button>
          </div>
        </form>
      </DataCard>
    </div>
  );
}
