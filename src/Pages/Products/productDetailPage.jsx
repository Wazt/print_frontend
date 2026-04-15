import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Package, FileText, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getProductById, updateProduct, deleteProduct } from "@/Services/ProductsService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, FormField, Input, Textarea, Button, EmptyState,
} from "@/Components/primitives";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/Components/ui/sheet";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/Components/ui/dialog";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const { t } = useLanguage();

  const [product, setProduct] = useState(state?.product || null);
  const [isLoading, setIsLoading] = useState(!state?.product);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", base_price: "" });

  useEffect(() => {
    if (!product) {
      (async () => {
        setIsLoading(true);
        try {
          const data = await getProductById(id);
          setProduct(data);
        } catch {
          toast.error("Failed to load product");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id, product]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        base_price: product.base_price ?? "",
      });
    }
  }, [product]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updated = await updateProduct(product.id, formData);
      setProduct(updated);
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
      await deleteProduct(product.id);
      toast.success(t("lang") === "fr" ? "Supprime" : "Deleted");
      navigate("/products");
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

  if (!product) {
    return (
      <EmptyState
        icon={Package}
        title={t("lang") === "fr" ? "Produit introuvable" : "Product not found"}
        action={
          <Button variant="outline" onClick={() => navigate("/products")}>
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
        <Button variant="outline" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={product.name}
          subtitle={`${product.base_price?.toLocaleString()} DZD`}
          icon={Package}
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

      <DataCard title={t("lang") === "fr" ? "Details" : "Details"}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoRow icon={Package} label={t("lang") === "fr" ? "Nom" : "Name"} value={product.name} />
          <InfoRow icon={FileText} label="Description" value={product.description} />
          <InfoRow
            icon={DollarSign}
            label={t("lang") === "fr" ? "Prix de base" : "Base price"}
            value={`${product.base_price?.toLocaleString()} DZD`}
          />
        </div>
      </DataCard>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="bg-[var(--surface)] border-l border-[var(--border)]">
          <SheetHeader>
            <SheetTitle className="text-[var(--text)]">
              {t("lang") === "fr" ? "Modifier" : "Edit product"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <FormField label={t("lang") === "fr" ? "Nom" : "Name"}>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </FormField>
            <FormField label="Description">
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </FormField>
            <FormField label={t("lang") === "fr" ? "Prix" : "Price"}>
              <Input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
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
              {t("lang") === "fr" ? "Supprimer le produit ?" : "Delete product?"}
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
