import React from "react";
import { Package } from "lucide-react";
import { DataCard, EmptyState } from "@/Components/primitives";
import { useLanguage } from "@/contexts/LanguageContext";
import OrderDetailItemDetails from "./OrderDetailItemDetails";

function OrderDetailItems({ orderDatas, onUpdateSuccess, userRole }) {
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";
  const items = orderDatas?.items || [];

  if (!items.length) {
    return (
      <DataCard padded={false}>
        <EmptyState
          icon={Package}
          title={isFr ? "Aucun article" : "No items yet"}
          description={
            isFr
              ? "Cette commande ne contient aucun article."
              : "This order has no items attached."
          }
        />
      </DataCard>
    );
  }

  return (
    <DataCard
      title={isFr ? "Articles de la commande" : "Order items"}
      description={`${items.length} ${isFr ? "article(s)" : "item(s)"}`}
      icon={Package}
    >
      <div className="space-y-3">
        {items.map((item) => (
          <OrderDetailItemDetails
            key={item.id}
            item={item}
            onUpdateSuccess={onUpdateSuccess}
            userRole={userRole}
          />
        ))}
      </div>
    </DataCard>
  );
}

export default React.memo(OrderDetailItems);
