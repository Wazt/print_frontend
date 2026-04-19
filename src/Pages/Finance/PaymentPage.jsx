import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, CreditCard, Receipt, DollarSign, Building2, CheckCircle, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getOrders } from "@/Services/OrdersService";
import { getOrderDocuments } from "@/Services/FinanceService";
import AXIOS_CONFIG from "@/config/axiosConfig";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, DataCard, FormField, Input, Select, Textarea, Button,
  StatusPill,
} from "@/Components/primitives";

const PAYMENT_METHODS = [
  { value: "CCP", label: "CCP" },
  { value: "BADR", label: "BADR Bank" },
  { value: "CASH", label: "Cash" },
  { value: "CHECK", label: "Check" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [factures, setFactures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    order_id: "",
    facture_id: "",
    amount: "",
    payment_method: "",
    reference: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await getOrders({ all: true });
        setOrders(Array.isArray(response) ? response[0] || [] : response || []);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!formData.order_id) {
      setFactures([]);
      return;
    }
    (async () => {
      try {
        const docs = await getOrderDocuments(formData.order_id);
        setFactures(Array.isArray(docs) ? docs[0] || [] : docs || []);
      } catch {
        setFactures([]);
      }
    })();
  }, [formData.order_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!formData.facture_id) e.facture_id = t("lang") === "fr" ? "Facture requise" : "Invoice required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      e.amount = t("lang") === "fr" ? "Montant invalide" : "Invalid amount";
    if (!formData.payment_method)
      e.payment_method = t("lang") === "fr" ? "Methode requise" : "Method required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await AXIOS_CONFIG.post(`/payments/${formData.facture_id}/payment/create/`, {
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        reference: formData.reference,
        notes: formData.notes,
      });
      toast.success(t("lang") === "fr" ? "Paiement enregistre !" : "Payment recorded!");
      setFormData({
        order_id: "",
        facture_id: "",
        amount: "",
        payment_method: "",
        reference: "",
        notes: "",
      });
    } catch {
      toast.error(t("lang") === "fr" ? "Echec" : "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label={t("lang") === "fr" ? "Retour" : "Back"}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={t("nav.newPayment")}
          subtitle={
            t("lang") === "fr" ? "Enregistrer un paiement client" : "Record a client payment"
          }
          icon={CreditCard}
        />
      </div>

      <DataCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label={t("lang") === "fr" ? "Commande" : "Order"}
            htmlFor="order_id"
            required
          >
            <Select
              id="order_id"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">
                {isLoading
                  ? (t("lang") === "fr" ? "Chargement..." : "Loading...")
                  : (t("lang") === "fr" ? "Selectionner une commande..." : "Select an order...")}
              </option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.order_number} — {order.company?.name} — {order.order_price?.toLocaleString()} DZD
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label={t("lang") === "fr" ? "Facture" : "Invoice"}
            htmlFor="facture_id"
            error={errors.facture_id}
            required
          >
            <Select
              id="facture_id"
              name="facture_id"
              value={formData.facture_id}
              onChange={handleChange}
              disabled={!formData.order_id || factures.length === 0}
            >
              <option value="">
                {!formData.order_id
                  ? (t("lang") === "fr" ? "Selectionner d'abord une commande" : "Select an order first")
                  : factures.length === 0
                    ? (t("lang") === "fr" ? "Aucune facture" : "No invoices")
                    : (t("lang") === "fr" ? "Selectionner une facture..." : "Select an invoice...")}
              </option>
              {factures.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.document_number} — {f.total?.toLocaleString()} DZD
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label={t("lang") === "fr" ? "Montant (DZD)" : "Amount (DZD)"}
              htmlFor="amount"
              error={errors.amount}
              required
            >
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </FormField>

            <FormField
              label={t("lang") === "fr" ? "Methode de paiement" : "Payment method"}
              htmlFor="payment_method"
              error={errors.payment_method}
              required
            >
              <Select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option value="">
                  {t("lang") === "fr" ? "Selectionner..." : "Select..."}
                </option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField
            label={t("lang") === "fr" ? "Reference" : "Reference"}
            htmlFor="reference"
            hint={t("lang") === "fr" ? "Numero de transaction (optionnel)" : "Transaction number (optional)"}
          >
            <Input
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="REF-2026-001"
            />
          </FormField>

          <FormField
            label={t("lang") === "fr" ? "Notes" : "Notes"}
            htmlFor="notes"
          >
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              {t("common.cancel")}
            </Button>
            <Button variant="accent" type="submit" loading={isSubmitting}>
              <CreditCard size={15} />
              {t("lang") === "fr" ? "Enregistrer le paiement" : "Record payment"}
            </Button>
          </div>
        </form>
      </DataCard>
    </div>
  );
}
