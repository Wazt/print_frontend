import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Trash2, Upload, X, Package, FileText, Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import AXIOS_CONFIG from "@/config/axiosConfig";
import { getProducts } from "@/Services/ProductsService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, FormField, Input, Select, Button, EmptyState,
} from "@/Components/primitives";

const FORMATS = [
  { value: "GTO", label: "GTO" },
  { value: "SM72", label: "SM72" },
  { value: "SM74", label: "SM74" },
];

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await getProducts({ all: true });
        setProducts(Array.isArray(response) ? response[0] || [] : response || []);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.filePreview) URL.revokeObjectURL(item.filePreview);
      });
    };
  }, []);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { product_id: "", quantity: 1, format: "GTO", file: null, filePreview: null, fileType: null },
    ]);
  };

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const handleFileChange = (i, file) => {
    if (!file) return;
    if (file.size > 1024 * 1024 * 1024) {
      toast.error(t("lang") === "fr" ? "Fichier trop volumineux (max 1Go)" : "File too large (max 1GB)");
      return;
    }
    let previewUrl = null;
    let fileType = "document";
    if (file.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(file);
      fileType = "image";
    } else if (file.type === "application/pdf") {
      fileType = "pdf";
    }
    const updated = [...items];
    updated[i].file = file;
    updated[i].filePreview = previewUrl;
    updated[i].fileType = fileType;
    setItems(updated);
  };

  const removeFile = (i) => {
    const updated = [...items];
    if (updated[i].filePreview) URL.revokeObjectURL(updated[i].filePreview);
    updated[i].file = null;
    updated[i].filePreview = null;
    updated[i].fileType = null;
    setItems(updated);
  };

  const removeItem = (i) => {
    if (items[i].filePreview) URL.revokeObjectURL(items[i].filePreview);
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (items.length === 0) {
      toast.error(t("lang") === "fr" ? "Ajoutez au moins un article" : "Add at least one item");
      return;
    }
    const invalid = items.some((i) => !i.product_id || !i.quantity || !i.format || !i.file);
    if (invalid) {
      toast.error(t("lang") === "fr" ? "Remplissez tous les champs" : "Fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const itemsData = items.map((it) => ({
        product_id: it.product_id,
        quantity: parseInt(it.quantity),
        format: it.format,
      }));
      formData.append("items_data", JSON.stringify(itemsData));
      items.forEach((it) => {
        if (it.file) formData.append("files", it.file);
      });
      await AXIOS_CONFIG.post("/orders/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(t("lang") === "fr" ? "Commande creee !" : "Order created!");
      setTimeout(() => navigate("/Commandes"), 1000);
    } catch (err) {
      const msg = err.response?.data?.detail || (t("lang") === "fr" ? "Echec" : "An error occurred");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={t("orders.newOrder")}
          subtitle={
            t("lang") === "fr"
              ? "Ajoutez vos produits, quantites et fichiers"
              : "Add products, quantities, and files"
          }
          icon={Package}
          actions={
            <Button variant="outline" size="md" onClick={addItem}>
              <Plus size={15} />
              {t("lang") === "fr" ? "Ajouter un article" : "Add item"}
            </Button>
          }
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {items.length === 0 && (
          <DataCard>
            <EmptyState
              icon={Package}
              title={t("lang") === "fr" ? "Aucun article" : "No items yet"}
              description={
                t("lang") === "fr"
                  ? "Commencez par ajouter un produit a votre commande."
                  : "Start by adding a product to your order."
              }
              action={
                <Button variant="accent" type="button" onClick={addItem}>
                  <Plus size={15} />
                  {t("lang") === "fr" ? "Ajouter un article" : "Add item"}
                </Button>
              }
            />
          </DataCard>
        )}

        {items.map((item, i) => {
          const product = products.find((p) => p.id.toString() === item.product_id);
          return (
            <DataCard
              key={i}
              title={`${t("lang") === "fr" ? "Article" : "Item"} ${i + 1}`}
              action={
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => removeItem(i)}
                  aria-label="Remove"
                >
                  <Trash2 size={15} className="text-[var(--danger)]" />
                </Button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label={t("lang") === "fr" ? "Produit" : "Product"} required>
                  <Select
                    value={item.product_id}
                    onChange={(e) => updateItem(i, "product_id", e.target.value)}
                  >
                    <option value="">
                      {isLoading
                        ? (t("lang") === "fr" ? "Chargement..." : "Loading...")
                        : (t("lang") === "fr" ? "Selectionner..." : "Select...")}
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}{p.base_price ? ` — ${p.base_price} DZD` : ""}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label={t("lang") === "fr" ? "Quantite" : "Quantity"} required>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(i, "quantity", e.target.value)}
                  />
                </FormField>

                <FormField label={t("lang") === "fr" ? "Format" : "Format"} required>
                  <Select
                    value={item.format}
                    onChange={(e) => updateItem(i, "format", e.target.value)}
                  >
                    {FORMATS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </Select>
                </FormField>
              </div>

              {/* File uploader */}
              <div className="mt-4">
                {!item.file ? (
                  <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-2)] cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors">
                    <Upload size={24} className="text-[var(--text-3)]" />
                    <div className="text-center">
                      <div className="text-[14px] font-medium text-[var(--text)]">
                        {t("lang") === "fr" ? "Cliquer pour uploader" : "Click to upload"}
                      </div>
                      <div className="text-[12px] text-[var(--text-3)] mt-0.5">
                        PDF, image ou document — max 1Go
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(i, e.target.files?.[0])}
                      accept=".pdf,image/*,application/*"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)]">
                    <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                      {item.fileType === "image" ? <ImageIcon size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--text)] truncate">{item.file.name}</div>
                      <div className="text-[11px] text-[var(--text-3)]">{formatFileSize(item.file.size)}</div>
                    </div>
                    <Button variant="ghost" size="icon" type="button" onClick={() => removeFile(i)}>
                      <X size={15} />
                    </Button>
                  </div>
                )}
              </div>
            </DataCard>
          );
        })}

        {items.length > 0 && (
          <div className="flex items-center justify-between gap-2 pt-2">
            <Button variant="outline" type="button" onClick={addItem}>
              <Plus size={15} />
              {t("lang") === "fr" ? "Ajouter un article" : "Add another item"}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                {t("common.cancel")}
              </Button>
              <Button variant="accent" type="submit" loading={isSubmitting}>
                {t("lang") === "fr" ? "Creer la commande" : "Create order"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
