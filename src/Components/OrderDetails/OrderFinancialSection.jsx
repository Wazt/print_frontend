import React, { useState, useEffect, useCallback } from "react";
import {
  FileText, Download, Plus, Calendar, CheckCircle, Clock, XCircle,
  CreditCard, Receipt, Eye, Loader2, User, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { createDevis, getOrderDocuments } from "@/Services/FinanceService";
import { Button, DataCard, StatCard, StatusPill, EmptyState } from "@/Components/primitives";
import { useLanguage } from "@/contexts/LanguageContext";

const DOC_STATUS_LABELS = {
  DRAFT: { en: "Draft", fr: "Brouillon" },
  PENDING: { en: "Pending", fr: "En attente" },
  APPROVED: { en: "Approved", fr: "Approuve" },
  PAID: { en: "Paid", fr: "Paye" },
  PARTIAL_PAID: { en: "Partial paid", fr: "Paie partiel" },
  CANCELLED: { en: "Cancelled", fr: "Annule" },
};

function formatCurrency(amount) {
  return `${(amount || 0).toLocaleString()} DZD`;
}

function formatDate(dateString, isFr) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DocumentStatusPill({ status, isFr }) {
  const labels = DOC_STATUS_LABELS[status];
  const label = labels ? (isFr ? labels.fr : labels.en) : status;

  const statusTone = {
    DRAFT: "neutral",
    PENDING: "warning",
    APPROVED: "success",
    PAID: "success",
    PARTIAL_PAID: "info",
    CANCELLED: "danger",
  }[status] || "neutral";

  return <StatusPill tone={statusTone} label={label} size="sm" />;
}

function DocumentCard({ doc, type, isFr }) {
  const isDevis = type === "devis";

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-2)] transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[15px] text-[var(--text)] font-mono">
              {doc.document_number}
            </h3>
            <DocumentStatusPill status={doc.status} isFr={isFr} />
            {!isDevis && doc.devis_id && (
              <StatusPill
                tone="info"
                label={isFr ? "Depuis devis" : "From quote"}
                size="sm"
                dot={false}
              />
            )}
          </div>

          {/* Financial details */}
          <div
            className={`grid grid-cols-2 ${
              isDevis ? "md:grid-cols-3" : "md:grid-cols-4"
            } gap-3`}
          >
            <FinanceCell
              label={isFr ? "Total HT" : "Total HT"}
              value={formatCurrency(doc.total_ht)}
            />
            <FinanceCell
              label={isFr ? "Total TTC" : "Total TTC"}
              value={formatCurrency(doc.total)}
              strong
            />
            {!isDevis && (
              <FinanceCell
                label={isFr ? "Paye" : "Paid"}
                value={formatCurrency(doc.total_paid)}
                tone="success"
              />
            )}
            <FinanceCell
              label={isFr ? "Restant" : "Remaining"}
              value={formatCurrency(doc.total_remaining)}
              tone={doc.total_remaining > 0 ? "danger" : "success"}
            />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text-3)]">
            {doc.creator?.username && (
              <span className="flex items-center gap-1.5">
                <User size={12} />
                {isFr ? "Par" : "By"}: {doc.creator.username}
              </span>
            )}
            {doc.company?.name && (
              <span className="flex items-center gap-1.5">
                <Building2 size={12} />
                {doc.company.name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDate(doc.created_at, isFr)}
            </span>
          </div>

          {/* Payments (only for factures) */}
          {!isDevis && doc.payments?.length > 0 && (
            <div
              className="rounded-[var(--radius)] p-3"
              style={{
                background: "var(--success-bg)",
                border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={14} style={{ color: "var(--success)" }} />
                <h4
                  className="font-semibold text-[12px]"
                  style={{ color: "var(--success)" }}
                >
                  {isFr ? "Paiements" : "Payments"} ({doc.payments.length})
                </h4>
              </div>
              <div className="space-y-1.5">
                {doc.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between text-[12px]"
                    style={{ color: "var(--success)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span style={{ opacity: 0.8 }}>
                        {isFr ? "via" : "via"} {payment.payment_method}
                      </span>
                    </div>
                    <span style={{ opacity: 0.7 }}>
                      {formatDate(payment.created_at, isFr)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approval */}
          {doc.approved_at && doc.approver && (
            <div
              className="flex items-center gap-2 text-[12px] rounded-[var(--radius)] px-3 py-2"
              style={{
                background: "var(--success-bg)",
                color: "var(--success)",
              }}
            >
              <CheckCircle size={14} />
              <span>
                {isFr ? "Approuve par" : "Approved by"} {doc.approver.username}{" "}
                {isFr ? "le" : "on"} {formatDate(doc.approved_at, isFr)}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col gap-2 flex-shrink-0">
          <Button size="sm" variant="outline">
            <Eye size={14} />
            {isFr ? "Voir" : "View"}
          </Button>
          <Button size="sm" variant="outline">
            <Download size={14} />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function FinanceCell({ label, value, strong, tone }) {
  const color =
    tone === "danger"
      ? "var(--danger)"
      : tone === "success"
      ? "var(--success)"
      : "var(--text)";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] font-medium mb-1">
        {label}
      </p>
      <p
        className={`tabular-nums ${strong ? "text-[15px] font-bold" : "text-[13px] font-semibold"}`}
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

function OrderFinancialSection({ orderId, orderData }) {
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingDevis, setIsCreatingDevis] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const [documentsData] = await getOrderDocuments(orderId);
      setDocuments(documentsData || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error(isFr ? "Echec du chargement" : "Failed to load financial documents");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, isFr]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCreateDevis = async () => {
    if (!orderData?.company?.id) {
      toast.error(isFr ? "Infos entreprise manquantes" : "Company information is missing");
      return;
    }
    setIsCreatingDevis(true);
    try {
      await createDevis({ order_id: orderId, company_id: orderData.company.id });
      toast.success(isFr ? "Devis cree" : "Quote created successfully");
      await fetchDocuments();
    } catch (error) {
      console.error("Failed to create devis:", error);
      toast.error(isFr ? "Echec de la creation du devis" : "Failed to create quote");
    } finally {
      setIsCreatingDevis(false);
    }
  };

  const devis = documents.filter((doc) => doc.document_type === "DEVIS");
  const factures = documents.filter((doc) => doc.document_type === "FACTURE");

  const allPayments = factures.flatMap((f) => f.payments || []);
  const totalQuoted = devis.reduce((sum, d) => sum + (d.total || 0), 0);
  const totalInvoiced = factures.reduce((sum, f) => sum + (f.total || 0), 0);
  const totalPaid = factures.reduce((sum, f) => sum + (f.total_paid || 0), 0);
  const totalRemaining = factures.reduce((sum, f) => sum + (f.total_remaining || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2
            className="animate-spin text-[var(--accent)] mx-auto mb-3"
            size={28}
          />
          <p className="text-[13px] text-[var(--text-3)]">
            {isFr ? "Chargement des documents..." : "Loading financial documents..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={isFr ? "Total devise" : "Total quoted"}
          value={formatCurrency(totalQuoted)}
          hint={`${devis.length} ${isFr ? "devis" : "quote(s)"}`}
          icon={FileText}
          tone="accent"
        />
        <StatCard
          label={isFr ? "Total facture" : "Total invoiced"}
          value={formatCurrency(totalInvoiced)}
          hint={`${factures.length} ${isFr ? "facture(s)" : "invoice(s)"}`}
          icon={Receipt}
          tone="accent"
        />
        <StatCard
          label={isFr ? "Total paye" : "Total paid"}
          value={formatCurrency(totalPaid)}
          hint={`${allPayments.length} ${isFr ? "paiement(s)" : "payment(s)"}`}
          icon={CheckCircle}
          tone="success"
        />
        <StatCard
          label={isFr ? "Restant" : "Remaining"}
          value={formatCurrency(totalRemaining)}
          hint={
            totalRemaining > 0
              ? isFr ? "En attente" : "Outstanding"
              : isFr ? "Tout paye" : "Fully paid"
          }
          icon={CreditCard}
          tone={totalRemaining > 0 ? "danger" : "success"}
        />
      </div>

      {/* Quotes (DEVIS) */}
      <DataCard
        title={isFr ? "Devis" : "Quotes"}
        description={`${devis.length} ${isFr ? "devis genere(s)" : "quote(s) generated"}`}
        icon={FileText}
        action={
          <Button
            size="sm"
            variant="accent"
            onClick={handleCreateDevis}
            disabled={isCreatingDevis}
            loading={isCreatingDevis}
          >
            <Plus size={14} />
            {isFr ? "Nouveau devis" : "New quote"}
          </Button>
        }
      >
        {devis.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={isFr ? "Aucun devis" : "No quotes yet"}
            description={
              isFr
                ? "Aucun devis n'a ete genere pour cette commande."
                : "No quotes have been generated for this order."
            }
          />
        ) : (
          <div className="space-y-3">
            {devis.map((quote) => (
              <DocumentCard key={quote.id} doc={quote} type="devis" isFr={isFr} />
            ))}
          </div>
        )}
      </DataCard>

      {/* Invoices (FACTURES) */}
      <DataCard
        title={isFr ? "Factures" : "Invoices"}
        description={`${factures.length} ${isFr ? "facture(s) emise(s)" : "invoice(s) issued"}`}
        icon={Receipt}
        action={
          <Button size="sm" variant="accent" disabled>
            <Plus size={14} />
            {isFr ? "Nouvelle facture" : "New invoice"}
          </Button>
        }
      >
        {factures.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={isFr ? "Aucune facture" : "No invoices yet"}
            description={
              isFr
                ? "Aucune facture n'a ete emise pour cette commande."
                : "No invoices have been issued for this order."
            }
          />
        ) : (
          <div className="space-y-3">
            {factures.map((facture) => (
              <DocumentCard key={facture.id} doc={facture} type="facture" isFr={isFr} />
            ))}
          </div>
        )}
      </DataCard>
    </div>
  );
}

export default OrderFinancialSection;
