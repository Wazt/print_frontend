import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Boxes, DollarSign, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getRawMaterialById, updateRawMaterial, deleteRawMaterial,
} from "@/Services/StockService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, FormField, Input, Button, EmptyState,
} from "@/Components/primitives";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/Components/ui/sheet";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/Components/ui/dialog";

export default function RawMaterialDetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const { t } = useLanguage();

  const [material, setMaterial] = useState(state?.material || null);
  const [isLoading, setIsLoading] = useState(!state?.material);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ name: "", stock_quantity: "", cost_per_unit: "" });

  useEffect(() => {
    if (!material) {
      (async () => {
        setIsLoading(true);
        try {
          const data = await getRawMaterialById(id);
          setMaterial(data);
        } catch {
          toast.error("Failed to load material");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id, material]);

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name || "",
        stock_quantity: material.stock_quantity || "",
        cost_per_unit: material.cost_per_unit || "",
      });
    }
  }, [material]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updated = await updateRawMaterial(material.id, formData);
      setMaterial(updated);
      toast.success(t("lang") === "fr" ? "Mis a jour" : "Updated");
      setIsEditOpen(false);
    } catch {
      toast.error(t("lang") === "fr" ? "Echec" : "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRawMaterial(material.id);
      toast.success(t("lang") === "fr" ? "Supprime" : "Deleted");
      navigate("/stock");
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

  if (!material) {
    return (
      <EmptyState
        icon={Boxes}
        title={t("lang") === "fr" ? "Materiel introuvable" : "Material not found"}
        action={
          <Button variant="outline" onClick={() => navigate("/stock")}>
            <ArrowLeft size={15} />
            {t("lang") === "fr" ? "Retour" : "Back"}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate("/stock")}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={material.name}
          subtitle={`${material.stock_quantity} ${t("lang") === "fr" ? "unites" : "units"}`}
          icon={Boxes}
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

      <DataCard title={t("lang") === "fr" ? "Details du materiel" : "Material details"}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoRow icon={Boxes} label={t("lang") === "fr" ? "Nom" : "Name"} value={material.name} />
          <InfoRow
            icon={Boxes}
            label={t("lang") === "fr" ? "Stock" : "Stock"}
            value={`${material.stock_quantity} ${t("lang") === "fr" ? "unites" : "units"}`}
          />
          <InfoRow
            icon={DollarSign}
            label={t("lang") === "fr" ? "Cout unitaire" : "Cost per unit"}
            value={`${material.cost_per_unit?.toLocaleString()} DZD`}
          />
          <InfoRow
            icon={Calendar}
            label={t("lang") === "fr" ? "Cree le" : "Created"}
            value={
              material.created_at ? new Date(material.created_at).toLocaleDateString() : "—"
            }
          />
        </div>
      </DataCard>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="bg-[var(--surface)] border-l border-[var(--border)]">
          <SheetHeader>
            <SheetTitle className="text-[var(--text)]">
              {t("lang") === "fr" ? "Modifier le materiel" : "Edit material"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <FormField label={t("lang") === "fr" ? "Nom" : "Name"}>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormField>
            <FormField label={t("lang") === "fr" ? "Quantite" : "Stock quantity"}>
              <Input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              />
            </FormField>
            <FormField label={t("lang") === "fr" ? "Cout unitaire" : "Cost per unit"}>
              <Input
                type="number"
                value={formData.cost_per_unit}
                onChange={(e) => setFormData({ ...formData, cost_per_unit: e.target.value })}
              />
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
              {t("lang") === "fr" ? "Supprimer le materiel ?" : "Delete material?"}
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
