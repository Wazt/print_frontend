import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit2, Trash2, Mail, Phone, Building2, Calendar, User as UserIcon, Loader2,
} from "lucide-react";
import { getUserDetails, deleteUser, updateUser } from "@/Services/UsersService";
import { getCompanies } from "@/Services/CompanyService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, StatusPill, FormField, Input, Select, Button, EmptyState,
} from "@/Components/primitives";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/Components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/Components/ui/sheet";

const ROLE_TONE = { ADMIN: "danger", USER: "accent", CLIENT: "neutral" };

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    company_id: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userRes, companiesRes] = await Promise.all([
        getUserDetails(id),
        getCompanies({ all: true }),
      ]);
      const userData = userRes?.response || userRes?.data || userRes || {};
      setUser(userData);
      setCompanies(Array.isArray(companiesRes) ? companiesRes[0] || companiesRes : []);
      setEditForm({
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "",
        company_id: userData.company?.id?.toString() || "",
      });
    } catch {
      toast.error("Failed to load user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const payload = { ...editForm };
      if (!payload.company_id) payload.company_id = null;
      await updateUser(id, payload);
      toast.success(t("lang") === "fr" ? "Mise a jour" : "Updated");
      setIsEditOpen(false);
      await loadData();
    } catch {
      toast.error(t("lang") === "fr" ? "Echec" : "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(id);
      toast.success(t("lang") === "fr" ? "Utilisateur supprime" : "User deleted");
      navigate("/users");
    } catch {
      toast.error(t("lang") === "fr" ? "Echec" : "Delete failed");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        icon={UserIcon}
        title={t("lang") === "fr" ? "Utilisateur introuvable" : "User not found"}
        action={
          <Button variant="outline" onClick={() => navigate("/users")}>
            <ArrowLeft size={15} />
            {t("lang") === "fr" ? "Retour" : "Back"}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate("/users")} aria-label={t("lang") === "fr" ? "Retour" : "Back"}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={user.username}
          subtitle={user.email}
          actions={
            <>
              <Button variant="outline" size="md" onClick={() => setIsEditOpen(true)}>
                <Edit2 size={14} />
                {t("common.edit")}
              </Button>
              <Button variant="outline" size="md" onClick={() => setIsDeleteOpen(true)}>
                <Trash2 size={14} />
                {t("common.delete")}
              </Button>
            </>
          }
        />
      </div>

      <DataCard>
        <div className="flex items-center gap-4 pb-5 mb-5 border-b border-[var(--border)]">
          <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] font-semibold text-2xl">
            {user.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">{user.username}</h2>
            <div className="mt-1.5">
              <StatusPill tone={ROLE_TONE[user.role] || "neutral"} label={user.role} dot={false} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label={t("lang") === "fr" ? "Telephone" : "Phone"} value={user.phone} />
          <InfoRow icon={Building2} label={t("nav.clients")} value={user.company?.name} />
          <InfoRow
            icon={Calendar}
            label={t("lang") === "fr" ? "Cree le" : "Created"}
            value={user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
          />
        </div>
      </DataCard>

      {/* Edit sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="bg-[var(--surface)] border-l border-[var(--border)]">
          <SheetHeader>
            <SheetTitle className="text-[var(--text)]">
              {t("lang") === "fr" ? "Modifier l'utilisateur" : "Edit user"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <FormField label={t("lang") === "fr" ? "Nom d'utilisateur" : "Username"}>
              <Input value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} />
            </FormField>
            <FormField label="Email">
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </FormField>
            <FormField label={t("lang") === "fr" ? "Telephone" : "Phone"}>
              <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
            </FormField>
            <FormField label="Role">
              <Select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="CLIENT">Client</option>
              </Select>
            </FormField>
            <FormField label={t("nav.clients")}>
              <Select value={editForm.company_id} onChange={(e) => setEditForm({ ...editForm, company_id: e.target.value })}>
                <option value="">{t("lang") === "fr" ? "Aucune" : "None"}</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </FormField>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>{t("common.cancel")}</Button>
            <Button variant="accent" loading={isUpdating} onClick={handleUpdate}>{t("common.save")}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--surface)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--text)]">
              {t("lang") === "fr" ? "Supprimer l'utilisateur ?" : "Delete user?"}
            </DialogTitle>
            <DialogDescription className="text-[var(--text-3)]">
              {t("lang") === "fr"
                ? "Cette action est irreversible."
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>{t("common.cancel")}</Button>
            <Button variant="danger" loading={isDeleting} onClick={handleDelete}>{t("common.delete")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-3)] flex-shrink-0">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-medium">{label}</div>
        <div className="text-[14px] text-[var(--text)] mt-0.5 break-words">{value || "—"}</div>
      </div>
    </div>
  );
}
