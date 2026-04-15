import { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails } from "@/Services/OrdersService";
import { RefreshCw, FileText, DollarSign, ArrowLeft, Loader2, Cloud } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { toast } from "sonner";
import OrderDetailHeader from "@/Components/OrderDetails/OrderDetailHeader";
import OrderDetailSummary from "@/Components/OrderDetails/OrderDetailSummary";
import OrderDetailItems from "@/Components/OrderDetails/OrderDetailItems";
import OrderWorkflowTimeline from "@/Components/OrderDetails/OrderWorkflowTimeline";
import OrderFinancialSection from "@/Components/OrderDetails/OrderFinancialSection";
import ClientOrderDetails from "@/Pages/ClientOrderDetails";
import AuthContext from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button, DataCard, StatusPill } from "@/Components/primitives";

export default function OrderDetails() {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useContext(AuthContext);
  const { t } = useLanguage();
  const userRole = profile?.role || "USER";

  const fetchOrderDetails = useCallback(
    async (showToast = false) => {
      if (showToast) setIsRefreshing(true);
      try {
        const response = await getOrderDetails(id);
        setOrderData(response);
        if (showToast) toast.success("Order refreshed");
      } catch {
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  useEffect(() => {
    if (!orderData?.items) return;
    const hasUploading = orderData.items.some(
      (item) => item.file?.status === "uploading" || item.file?.status === "pending"
    );
    if (!hasUploading) return;
    const intervalId = setInterval(() => fetchOrderDetails(false), 10000);
    return () => clearInterval(intervalId);
  }, [orderData, fetchOrderDetails]);

  if (isLoading && !orderData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin text-[var(--accent)] mx-auto mb-3" size={32} />
          <p className="text-[var(--text-3)] text-sm">
            {t("lang") === "fr" ? "Chargement de la commande..." : "Loading order details..."}
          </p>
        </div>
      </div>
    );
  }

  // Client role gets the dedicated client view
  if (userRole === "CLIENT") {
    return <ClientOrderDetails order={orderData} />;
  }

  const hasUploading = orderData?.items?.some(
    (item) => item.file?.status === "uploading" || item.file?.status === "pending"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft size={16} />
          </Button>
          <div className="min-w-0">
            <div className="text-[11px] text-[var(--text-3)] font-mono uppercase tracking-wider">
              {t("lang") === "fr" ? "Commande" : "Order"}
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text)] tracking-tight font-mono">
              {orderData?.order_number || "—"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {orderData?.status && <StatusPill status={orderData.status} size="lg" />}
          <Button
            variant="outline"
            size="md"
            onClick={() => fetchOrderDetails(true)}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {t("lang") === "fr" ? "Actualiser" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Upload banner */}
      {hasUploading && (
        <div className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--info-bg)] border border-[var(--info)]/20">
          <Cloud className="text-[var(--info)]" size={18} />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[var(--info)]">
              {t("lang") === "fr"
                ? "Upload en cours vers Google Drive"
                : "Uploading files to Google Drive"}
            </p>
            <p className="text-[12px] text-[var(--info)]/70 mt-0.5">
              {t("lang") === "fr"
                ? "Actualisation automatique toutes les 10 secondes"
                : "Auto-refreshing every 10 seconds"}
            </p>
          </div>
          <Loader2 className="animate-spin text-[var(--info)]" size={18} />
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <DataCard padded={false} className="overflow-visible">
          <div className="p-1.5">
            <TabsList className="grid w-full grid-cols-2 bg-[var(--surface-2)] p-1 h-auto rounded-[var(--radius)]">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-[var(--surface)] data-[state=active]:shadow-[var(--shadow-card)] data-[state=active]:text-[var(--text)] text-[var(--text-3)] gap-2 h-9 rounded-[var(--radius-sm)] text-[13px] font-medium"
              >
                <FileText size={14} />
                <span className="hidden sm:inline">
                  {t("lang") === "fr" ? "Details commande" : "Order Details"}
                </span>
                <span className="sm:hidden">
                  {t("lang") === "fr" ? "Details" : "Details"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="data-[state=active]:bg-[var(--surface)] data-[state=active]:shadow-[var(--shadow-card)] data-[state=active]:text-[var(--text)] text-[var(--text-3)] gap-2 h-9 rounded-[var(--radius-sm)] text-[13px] font-medium"
              >
                <DollarSign size={14} />
                <span className="hidden sm:inline">
                  {t("lang") === "fr" ? "Devis & Paiements" : "Quotes & Payments"}
                </span>
                <span className="sm:hidden">
                  {t("lang") === "fr" ? "Finances" : "Financial"}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </DataCard>

        <TabsContent value="details" className="space-y-6 mt-0">
          <OrderWorkflowTimeline status={orderData?.status} />

          <OrderDetailHeader
            order_data={orderData}
            onStatusChange={() => fetchOrderDetails(false)}
            userRole={userRole}
          />

          {userRole === "ADMIN" && <OrderDetailSummary orderDatas={orderData} />}

          <OrderDetailItems
            orderDatas={orderData}
            onUpdateSuccess={() => fetchOrderDetails(false)}
            userRole={userRole}
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6 mt-0">
          <OrderFinancialSection orderId={id} orderData={orderData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
