import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import { getUserDetails, updateUser, AdminchangeUserPassword } from "@/Services/UsersService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, FormField, Input, Select, Button,
} from "@/Components/primitives";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    role: "",
    new_password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDetails(id);
        const user = data?.data?.response || data;
        setFormData({
          username: user.username || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          role: user.role || "",
          new_password: "",
          confirm_password: "",
        });
      } catch {
        toast.error("Failed to load user");
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUser(id, formData);
      if (formData.new_password || formData.confirm_password) {
        if (formData.new_password !== formData.confirm_password) {
          toast.error(t("lang") === "fr" ? "Mots de passe differents" : "Passwords do not match");
          setIsLoading(false);
          return;
        }
        await AdminchangeUserPassword(id, {
          new_password: formData.new_password,
          new_password2: formData.confirm_password,
        });
      }
      toast.success(t("lang") === "fr" ? "Utilisateur mis a jour" : "User updated");
      navigate(`/users/${id}`);
    } catch {
      toast.error(t("lang") === "fr" ? "Echec de la mise a jour" : "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={t("lang") === "fr" ? "Modifier l'utilisateur" : "Edit user"}
          subtitle={formData.username}
          icon={Edit2}
        />
      </div>

      <DataCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label={t("lang") === "fr" ? "Nom d'utilisateur" : "Username"} htmlFor="username">
              <Input id="username" name="username" value={formData.username} onChange={handleChange} />
            </FormField>
            <FormField label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label={t("lang") === "fr" ? "Telephone" : "Phone"}
              htmlFor="phone_number"
            >
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Role" htmlFor="role">
              <Select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="">{t("lang") === "fr" ? "Selectionner..." : "Select..."}</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="CLIENT">Client</option>
              </Select>
            </FormField>
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <h3 className="text-[14px] font-semibold text-[var(--text)] mb-3">
              {t("lang") === "fr" ? "Changer le mot de passe (optionnel)" : "Change password (optional)"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label={t("lang") === "fr" ? "Nouveau mot de passe" : "New password"}
                htmlFor="new_password"
              >
                <Input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={formData.new_password}
                  onChange={handleChange}
                />
              </FormField>
              <FormField
                label={t("lang") === "fr" ? "Confirmer" : "Confirm"}
                htmlFor="confirm_password"
              >
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </FormField>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              {t("common.cancel")}
            </Button>
            <Button variant="accent" type="submit" loading={isLoading}>
              {t("common.save")}
            </Button>
          </div>
        </form>
      </DataCard>
    </div>
  );
}
