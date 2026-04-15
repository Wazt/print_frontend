import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { createProduct } from "@/Services/ProductsService";
import getRawMaterials from "@/Services/StockService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, FormField, Input, Textarea, Select, Button,
} from "@/Components/primitives";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [rawMaterials, setRawMaterials] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    base_price: "",
    raw_materials: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getRawMaterials();
        setRawMaterials(Array.isArray(data) ? data : data?.[0] || []);
      } catch {
        toast.error("Failed to load raw materials");
      }
    })();
  }, []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const addMaterial = () =>
    setForm((prev) => ({
      ...prev,
      raw_materials: [...prev.raw_materials, { raw_material_id: "", quantity: "" }],
    }));

  const updateMaterial = (index, key, value) => {
    const updated = [...form.raw_materials];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, raw_materials: updated }));
  };

  const removeMaterial = (index) => {
    const updated = [...form.raw_materials];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, raw_materials: updated }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!form.name) {
      toast.warning(t("lang") === "fr" ? "Nom requis" : "Name required");
      return;
    }
    setIsSubmitting(true);
    try {
      await createProduct({
        name: form.name,
        description: form.description,
        base_price: Number(form.base_price),
        raw_materials: form.raw_materials.map((m) => ({
          raw_material_id: m.raw_material_id,
          quantity: Number(m.quantity),
        })),
      });
      toast.success(t("lang") === "fr" ? "Produit cree !" : "Product created!");
      navigate("/products");
    } catch {
      toast.error(t("lang") === "fr" ? "Echec" : "Failed to create product");
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
          title={t("lang") === "fr" ? "Nouveau produit" : "New product"}
          subtitle={
            t("lang") === "fr"
              ? "Ajoutez un produit a votre catalogue"
              : "Add a product to your catalog"
          }
          icon={Package}
        />
      </div>

      <DataCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label={t("lang") === "fr" ? "Nom du produit" : "Product name"} htmlFor="name" required>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("lang") === "fr" ? "Ex: Carte de visite" : "Ex: Business card"}
            />
          </FormField>

          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </FormField>

          <FormField
            label={t("lang") === "fr" ? "Prix de base (DZD)" : "Base price (DZD)"}
            htmlFor="base_price"
            required
          >
            <Input
              id="base_price"
              type="number"
              step="0.01"
              value={form.base_price}
              onChange={(e) => updateField("base_price", e.target.value)}
              placeholder="0.00"
            />
          </FormField>

          {/* Raw materials */}
          <div className="border-t border-[var(--border)] pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[var(--text)]">
                {t("lang") === "fr" ? "Matieres premieres" : "Raw materials"}
              </h3>
              <Button variant="outline" size="sm" type="button" onClick={addMaterial}>
                <Plus size={13} />
                {t("lang") === "fr" ? "Ajouter" : "Add"}
              </Button>
            </div>

            <div className="space-y-3">
              {form.raw_materials.length === 0 && (
                <p className="text-[13px] text-[var(--text-3)] py-2">
                  {t("lang") === "fr"
                    ? "Aucune matiere premiere ajoutee."
                    : "No raw materials added."}
                </p>
              )}
              {form.raw_materials.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Select
                    className="flex-1"
                    value={m.raw_material_id}
                    onChange={(e) => updateMaterial(i, "raw_material_id", e.target.value)}
                  >
                    <option value="">{t("lang") === "fr" ? "Selectionner..." : "Select..."}</option>
                    {rawMaterials.map((rm) => (
                      <option key={rm.id} value={rm.id}>{rm.name}</option>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    placeholder={t("lang") === "fr" ? "Quantite" : "Qty"}
                    className="w-32"
                    value={m.quantity}
                    onChange={(e) => updateMaterial(i, "quantity", e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeMaterial(i)}
                    aria-label={t("lang") === "fr" ? "Supprimer la matiere" : "Remove material"}
                  >
                    <Trash2 size={14} className="text-[var(--danger)]" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              {t("common.cancel")}
            </Button>
            <Button variant="accent" type="submit" loading={isSubmitting}>
              <Plus size={15} />
              {t("lang") === "fr" ? "Creer le produit" : "Create product"}
            </Button>
          </div>
        </form>
      </DataCard>
    </div>
  );
}
