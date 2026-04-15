import React from "react";
import { User, Building2, Receipt } from "lucide-react";
import { DataCard } from "@/Components/primitives";
import { useLanguage } from "@/contexts/LanguageContext";

function InfoColumn({ icon: Icon, title, rows, tone = "accent" }) {
  const toneStyles = {
    accent: { bg: "var(--accent-bg)", color: "var(--accent)" },
    success: { bg: "var(--success-bg)", color: "var(--success)" },
    info: { bg: "var(--info-bg)", color: "var(--info)" },
  }[tone];

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="h-9 w-9 rounded-[var(--radius)] flex items-center justify-center flex-shrink-0"
          style={{ background: toneStyles.bg, color: toneStyles.color }}
        >
          <Icon size={16} />
        </div>
        <h3 className="font-semibold text-[14px] text-[var(--text)]">{title}</h3>
      </div>
      <div className="space-y-3 pl-11">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] font-medium mb-0.5">
              {row.label}
            </p>
            <p
              className={`text-[13px] break-words ${
                row.emphasize
                  ? "font-bold text-[var(--text)] text-[15px]"
                  : row.strong
                  ? "font-medium text-[var(--text)]"
                  : "text-[var(--text-2)]"
              }`}
            >
              {row.value ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderDetailSummary({ orderDatas }) {
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  if (!orderDatas) return null;

  const formattedDate = orderDatas.created_at
    ? new Date(orderDatas.created_at).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <DataCard title={isFr ? "Informations de la commande" : "Order information"}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoColumn
          icon={User}
          tone="accent"
          title={isFr ? "Client" : "Customer"}
          rows={[
            {
              label: isFr ? "Nom" : "Name",
              value: orderDatas.creator?.username,
              strong: true,
            },
            { label: "Email", value: orderDatas.creator?.email },
            { label: isFr ? "Telephone" : "Phone", value: orderDatas.creator?.phone },
          ]}
        />
        <InfoColumn
          icon={Building2}
          tone="info"
          title={isFr ? "Entreprise" : "Company"}
          rows={[
            {
              label: isFr ? "Nom" : "Name",
              value: orderDatas.company?.name,
              strong: true,
            },
            { label: "Email", value: orderDatas.company?.email },
            { label: isFr ? "Telephone" : "Phone", value: orderDatas.company?.phone },
          ]}
        />
        <InfoColumn
          icon={Receipt}
          tone="success"
          title={isFr ? "Details" : "Details"}
          rows={[
            {
              label: isFr ? "Date de commande" : "Order date",
              value: formattedDate,
              strong: true,
            },
            {
              label: isFr ? "Montant total" : "Total amount",
              value: `${orderDatas.order_price?.toLocaleString() || 0} DZD`,
              emphasize: true,
            },
            {
              label: isFr ? "Articles" : "Items",
              value: `${orderDatas.items?.length || 0} ${
                isFr ? "article(s)" : "item(s)"
              }`,
            },
          ]}
        />
      </div>
    </DataCard>
  );
}

export default React.memo(OrderDetailSummary);
