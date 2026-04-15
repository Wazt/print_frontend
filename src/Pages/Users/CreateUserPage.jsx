import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Shield, User as UserIcon, Building2 } from "lucide-react";
import { getCompanies } from "@/Services/CompanyService";
import { createUser } from "@/Services/UsersService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, FormField, Input, Select, Button,
} from "@/Components/primitives";

export default function CreateUserPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    company_id: "",
    password: "",
    password2: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await getCompanies({ all: true });
        setCompanies(Array.isArray(response) ? response[0] || [] : response || []);
      } catch {
        toast.error("Failed to load companies");
      }
    })();
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.username || formData.username.length < 3)
      e.username = t("lang") === "fr" ? "Min. 3 caracteres" : "Min. 3 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Email invalide";
    if (!formData.role) e.role = t("lang") === "fr" ? "Role requis" : "Role required";
    if (!formData.company_id) e.company_id = t("lang") === "fr" ? "Entreprise requise" : "Company required";
    if (!formData.password || formData.password.length < 12)
      e.password = t("lang") === "fr" ? "Min. 12 caracteres" : "Min. 12 characters";
    if (formData.password !== formData.password2)
      e.password2 = t("lang") === "fr" ? "Les mots de passe ne correspondent pas" : "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(t("lang") === "fr" ? "Corrigez les erreurs" : "Fix the errors");
      return;
    }
    setIsLoading(true);
    try {
      await createUser(formData);
      toast.success(t("lang") === "fr" ? "Utilisateur cree !" : "User created!");
      setTimeout(() => navigate("/users"), 1000);
    } catch {
      toast.error(t("lang") === "fr" ? "Echec de la creation" : "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label={t("lang") === "fr" ? "Retour" : "Back"}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={t("lang") === "fr" ? "Nouvel utilisateur" : "New user"}
          subtitle={
            t("lang") === "fr"
              ? "Creez un compte avec un role et une entreprise"
              : "Create an account with a role and company"
          }
          icon={UserPlus}
        />
      </div>

      <DataCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label={t("lang") === "fr" ? "Nom d'utilisateur" : "Username"}
              htmlFor="username"
              error={errors.username}
              required
            >
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="john.doe"
              />
            </FormField>
            <FormField label="Email" htmlFor="email" error={errors.email} required>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label={t("lang") === "fr" ? "Role" : "Role"} htmlFor="role" error={errors.role} required>
              <Select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="">{t("lang") === "fr" ? "Selectionner..." : "Select..."}</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="CLIENT">Client</option>
              </Select>
            </FormField>
            <FormField
              label={t("nav.clients")}
              htmlFor="company_id"
              error={errors.company_id}
              required
            >
              <Select
                id="company_id"
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
              >
                <option value="">{t("lang") === "fr" ? "Selectionner..." : "Select..."}</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label={t("lang") === "fr" ? "Mot de passe" : "Password"}
              htmlFor="password"
              error={errors.password}
              hint={t("lang") === "fr" ? "Min. 12 caracteres" : "Min. 12 characters"}
              required
            >
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormField>
            <FormField
              label={t("lang") === "fr" ? "Confirmer" : "Confirm"}
              htmlFor="password2"
              error={errors.password2}
              required
            >
              <Input
                id="password2"
                name="password2"
                type="password"
                value={formData.password2}
                onChange={handleChange}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              {t("common.cancel")}
            </Button>
            <Button variant="accent" type="submit" loading={isLoading}>
              <UserPlus size={15} />
              {t("lang") === "fr" ? "Creer l'utilisateur" : "Create user"}
            </Button>
          </div>
        </form>
      </DataCard>
    </div>
  );
}
