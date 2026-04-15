import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit2, Trash2, Mail, Phone, MapPin, Calendar, Building2,
  ShoppingCart, CheckCircle, DollarSign, Loader2, ArrowRight,
} from "lucide-react";
import { getCompanyDetails, deleteCompany, updateCompany } from "@/Services/CompanyService";
import { getOrders } from "@/Services/OrdersService";
import AXIOS_CONFIG from "@/config/axiosConfig";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, StatCard, DataCard, DataTable, StatusPill, EmptyState,
  FormField, Input, Textarea, Button,
} from "@/Components/primitives";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/Components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/Components/ui/sheet";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    if (!id) return;
    (async () => {
      setIsLoading(true);
      try {
        const data = await getCompanyDetails(id);
        setCompany(data);
        setEditForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch {
        toast.error("Failed to load company");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await AXIOS_CONFIG.get(`/company/${id}/stats/`);
        setStats(res.data);
      } catch {
        setStats(null);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [data] = await getOrders({ company_id: id });
        setOrders(data || []);
      } catch {
        setOrders([]);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCompany(id);
      toast.success(t("lang") === "fr" ? "Entreprise supprimee" : "Company deleted");
      navigate("/companies");
    } catch {
      toast.error(t("lang") === "fr" ? "Echec de la suppression" : "Failed to delete");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updated = await updateCompany(id, editForm);
      setCompany(updated);
      toast.success(t("lang") === "fr" ? "Mise a jour" : "Updated");
      setIsEditOpen(false);
    } catch {
      toast.error(t("lang") === "fr" ? "Echec" : "Failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  if (!company) {
    return (
      <EmptyState
        icon={Building2}
        title={t("lang") === "fr" ? "Entreprise introuvable" : "Company not found"}
        action={
          <Button variant="outline" onClick={() => navigate("/companies")}>
            <ArrowLeft size={15} />
            {t("lang") === "fr" ? "Retour" : "Back"}
          </Button>
        }
      />
    );
  }

  const orderColumns = [
    {
      key: "order_number",
      header: "Order",
      render: (row) => (
        <span className="font-mono text-[13px] font-semibold text-[var(--text)]">
          {row.order_number}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "order_price",
      header: "Montant",
      align: "right",
      render: (row) => (
        <span className="tabular-nums font-medium">{row.order_price?.toLocaleString()} DZD</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (row) => <StatusPill status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate("/companies")}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={company.name}
          subtitle={company.email}
          icon={Building2}
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t("lang") === "fr" ? "Commandes" : "Orders"}
          value={stats?.total_orders ?? orders.length}
          icon={ShoppingCart}
          tone="accent"
        />
        <StatCard
          label={t("lang") === "fr" ? "Terminees" : "Finished"}
          value={stats?.finished_orders ?? "—"}
          icon={CheckCircle}
          tone="success"
        />
        <StatCard
          label={t("lang") === "fr" ? "Total facture" : "Total billed"}
          value={stats?.total_billed ? `${stats.total_billed.toLocaleString()} DZD` : "—"}
          icon={DollarSign}
        />
        <StatCard
          label={t("lang") === "fr" ? "Cliente depuis" : "Customer since"}
          value={new Date(company.created_at).toLocaleDateString()}
          icon={Calendar}
        />
      </div>

      {/* Info card */}
      <DataCard title={t("lang") === "fr" ? "Coordonnees" : "Contact info"}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoRow icon={Mail} label="Email" value={company.email} />
          <InfoRow icon={Phone} label={t("lang") === "fr" ? "Telephone" : "Phone"} value={company.phone} />
          <InfoRow icon={MapPin} label={t("lang") === "fr" ? "Adresse" : "Address"} value={company.address} />
        </div>
      </DataCard>

      {/* Orders */}
      <DataCard
        title={t("lang") === "fr" ? "Commandes recentes" : "Recent orders"}
        description={`${orders.length} ${t("lang") === "fr" ? "commandes" : "orders"}`}
        padded={false}
      >
        <DataTable
          columns={orderColumns}
          rows={orders}
          onRowClick={(row) => navigate(`/Commandes/OrderDetails/${row.id}`)}
          empty={
            <EmptyState
              icon={ShoppingCart}
              title={t("lang") === "fr" ? "Aucune commande" : "No orders"}
            />
          }
        />
      </DataCard>

      {/* Edit sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="bg-[var(--surface)] border-l border-[var(--border)]">
          <SheetHeader>
            <SheetTitle className="text-[var(--text)]">
              {t("lang") === "fr" ? "Modifier l'entreprise" : "Edit company"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <FormField label={t("lang") === "fr" ? "Nom" : "Name"}>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </FormField>
            <FormField label={t("lang") === "fr" ? "Telephone" : "Phone"}>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </FormField>
            <FormField label={t("lang") === "fr" ? "Adresse" : "Address"}>
              <Textarea
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                rows={3}
              />
            </FormField>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="accent" loading={isUpdating} onClick={handleUpdate}>
              {t("common.save")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--surface)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--text)]">
              {t("lang") === "fr" ? "Supprimer l'entreprise ?" : "Delete company?"}
            </DialogTitle>
            <DialogDescription className="text-[var(--text-3)]">
              {t("lang") === "fr"
                ? "Cette action est irreversible. Toutes les donnees associees seront perdues."
                : "This action cannot be undone. All associated data will be lost."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="danger" loading={isDeleting} onClick={handleDelete}>
              {t("common.delete")}
            </Button>
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
