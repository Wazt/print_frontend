import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Boxes } from "lucide-react";
import { toast } from "sonner";
import { createRawMaterial } from "@/Services/StockService";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, DataCard, FormField, Input, Button } from "@/Components/primitives";

export default function RawMaterialCreatePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", stock_quantity: "", cost_per_unit: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.stock_quantity || !form.cost_per_unit) {
      toast.error(t("lang") === "fr" ? "Tous les champs sont requis" : "All fields required");
      return;
    }
    setIsSubmitting(true);
    try {
      await createRawMaterial({
        name: form.name,
        stock_quantity: parseFloat(form.stock_quantity),
        cost_per_unit: parseFloat(form.cost_per_unit),
      });
      toast.success(t("lang") === "fr" ? "Materiel cree !" : "Material created!");
      navigate("/stock");
    } catch {
      toast.error(t("lang") === "fr" ? "Echec" : "Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={t("lang") === "fr" ? "Nouveau materiel" : "New material"}
          subtitle={
            t("lang") === "fr" ? "Ajoutez une matiere premiere" : "Add a raw material"
          }
          icon={Boxes}
        />
      </div>

      <DataCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label={t("lang") === "fr" ? "Nom" : "Name"} htmlFor="name" required>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("lang") === "fr" ? "Ex: Papier couche 170g" : "Ex: Coated paper 170g"}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label={t("lang") === "fr" ? "Quantite en stock" : "Stock quantity"}
              htmlFor="stock_quantity"
              required
            >
              <Input
                id="stock_quantity"
                type="number"
                step="0.01"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                placeholder="100"
              />
            </FormField>
            <FormField
              label={t("lang") === "fr" ? "Cout unitaire (DZD)" : "Cost per unit (DZD)"}
              htmlFor="cost_per_unit"
              required
            >
              <Input
                id="cost_per_unit"
                type="number"
                step="0.01"
                value={form.cost_per_unit}
                onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })}
                placeholder="200"
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => navigate("/stock")}>
              {t("common.cancel")}
            </Button>
            <Button variant="accent" type="submit" loading={isSubmitting}>
              <Plus size={15} />
              {t("lang") === "fr" ? "Creer le materiel" : "Create material"}
            </Button>
          </div>
        </form>
      </DataCard>
    </div>
  );
}
